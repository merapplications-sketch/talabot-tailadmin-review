// Handler-level A parity tests. Fake hook scheduling, real component handlers.
// Not browser/React reconciliation or backend permission evidence.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict'),ts=require('typescript');
const root=path.resolve('src/components/talabot/native');
function harness(file,{seed={},mutationResult={error:'preview_readonly'},props={}}={}){
  const storage=new Map(Object.entries(seed)),states=[],requests=[],cache=new Map();let cursor=0,back=0;
  const storageAPI={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)};
  const hooks={useState(initial){const i=cursor++;if(!(i in states))states[i]=typeof initial==='function'?initial():initial;return [states[i],v=>{states[i]=typeof v==='function'?v(states[i]):v}];}};
  function load(name){const resolved=path.resolve(root,name);if(cache.has(resolved))return cache.get(resolved);
    const exports={};cache.set(resolved,exports);
    const code=ts.transpileModule(fs.readFileSync(resolved,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
    const req=n=>{
      if(n==='react')return hooks;if(n==='react/jsx-runtime')return require(n);
      if(n==='next-intl')return {useLocale:()=> 'en'};
      if(n==='./mutation-service')return {mutations:{ticketSetStatus:async(...args)=>{requests.push(args);if(mutationResult instanceof Error)throw mutationResult;return mutationResult;},ticketStaffReply:async()=>mutationResult}};
      if(n==='./domain')return {tables:JSON.parse(fs.readFileSync(path.join(root,'fixture.json'))),text:(r,k)=>r[k]==null?'':String(r[k]),number:(r,k)=>Number(r[k]||0),previewWrite:()=>({error:{message:'preview_readonly'}})};
      if(n==='./format')return {formatDate:v=>v};
      if(n==='./scenario-responses')return load('scenario-responses.ts');
      if(n==='./native-form')return {__esModule:true,default:function NativeForm(){}};
      // UI primitives are opaque leaves: no simulated widget assertions.
      return new Proxy({},{get:(_,key)=>key==='__esModule'?true:String(key)});
    };
    vm.runInNewContext(code,{exports,require:req,console,URLSearchParams,sessionStorage:storageAPI,location:{search:'?section=support&id=t1'}},{filename:resolved});return exports;
  }
  const Component=load(file).default;
  const ticket={id:'t1',customer_id:'00000000-0000-0000-0000-000000000001',order_id:'ord1',status:'open',reason:'late'};
  const render=()=>{cursor=0;return Component({ticket,t:k=>k,back:()=>back++,openOrder(){},...props});};
  return {render,storage,states,requests,get back(){return back;}};
}
function nodes(tree,pred){if(!tree||typeof tree!=='object')return [];if(Array.isArray(tree))return tree.flatMap(n=>nodes(n,pred));return [...(pred(tree)?[tree]:[]),...nodes(tree.props?.children,pred)];}
function button(h,label){return nodes(h.render(),n=>n.type==='Button'&&n.props.children===label)[0];}
const seed={'ux02-native:ticket:t1':JSON.stringify({note:'Synthetic resolution',refund:''})};
let passed=0,failed=0;async function test(name,fn){try{await fn();passed++;console.log('PASS '+name)}catch(e){failed++;console.log('FAIL '+name+' — '+e.message)}}
(async()=>{
await test('confirmed resolved success clears decision draft and returns to support list',async()=>{const h=harness('ticket-details.tsx',{seed,mutationResult:{ok:true}});await button(h,'xResolve').props.onClick();assert.deepEqual(JSON.parse(h.storage.get('ux02-native:ticket:t1')),{note:'',refund:''});assert.equal(h.back,1);});
await test('preview refusal keeps decision draft and current ticket',async()=>{const h=harness('ticket-details.tsx',{seed});await button(h,'xResolve').props.onClick();assert.equal(h.storage.get('ux02-native:ticket:t1'),seed['ux02-native:ticket:t1']);assert.equal(h.back,0);assert(nodes(h.render(),n=>n.props?.role==='alert'&&n.props.children==='nativeWriteBlocked').length);});
await test('closed ticket offers only reopening, no reply or new decision',async()=>{for(const status of ['resolved','rejected']){const h=harness('ticket-details.tsx',{props:{ticket:{id:'t1',status,order_id:'ord1'}}});assert(button(h,'xReopen'));assert(!button(h,'xReject'));assert.equal(nodes(h.render(),n=>typeof n.type==='function'&&n.type.name==='NativeForm').length,0);await button(h,'xReopen').props.onClick();assert.deepEqual(Array.from(h.requests[0]),['t1','open','',null]);}});
await test('short rejection note never reaches mutation',async()=>{const h=harness('ticket-details.tsx',{seed:{'ux02-native:ticket:t1':'{"note":"x","refund":""}'}});await button(h,'xReject').props.onClick();assert.equal(h.requests.length,0);assert(nodes(h.render(),n=>n.props?.children==='xRejNote').length);});
await test('refund above available synthetic room never reaches mutation',async()=>{const h=harness('ticket-details.tsx',{seed:{'ux02-native:ticket:t1':'{"note":"valid reason","refund":"107"}'}});await button(h,'xResolve').props.onClick();assert.equal(h.requests.length,0);assert(nodes(h.render(),n=>n.props?.children==='xRefHigh').length);});
await test('refund requires explicit confirmation; cancel keeps draft and sends nothing',async()=>{const h=harness('ticket-details.tsx',{seed:{'ux02-native:ticket:t1':'{"note":"valid reason","refund":"10"}'}});await button(h,'xResolve').props.onClick();let dialog=nodes(h.render(),n=>n.type==='Dialog')[0];assert.equal(dialog.props.open,true);await button(h,'aClose2').props.onClick();assert.equal(h.requests.length,0);assert.equal(JSON.parse(h.storage.get('ux02-native:ticket:t1')).refund,'10');await button(h,'xResolve').props.onClick();dialog=nodes(h.render(),n=>n.type==='Dialog')[0];const confirm=nodes(dialog,n=>n.type==='Button'&&n.props.children==='xResolve')[0];await confirm.props.onClick();assert.deepEqual(Array.from(h.requests[0]),['t1','resolved','valid reason','10']);assert.equal(h.back,0);});
await test('rejected success clears draft and returns; non-refund argument is null',async()=>{const h=harness('ticket-details.tsx',{seed,mutationResult:{ok:true}});await button(h,'xReject').props.onClick();assert.equal(h.back,1);assert.equal(h.requests[0][3],null);assert.equal(JSON.parse(h.storage.get('ux02-native:ticket:t1')).note,'');});
await test('thrown error preserves draft and releases pending state',async()=>{const h=harness('ticket-details.tsx',{seed,mutationResult:new Error('offline')});await button(h,'xResolve').props.onClick();assert.equal(h.storage.get('ux02-native:ticket:t1'),seed['ux02-native:ticket:t1']);assert.equal(button(h,'xResolve').props.disabled,false);assert(nodes(h.render(),n=>n.props?.children==='err_generic').length);});
async function reply(result,resetAfterSuccess){const fields=[{key:'body',label:'xReplyPh',type:'textarea',maxLength:500}],draftKey='ux02-native:draft:'+JSON.stringify(['support','t1','',['body']]);const h=harness('native-form.tsx',{seed:{[draftKey]:'{"body":"Retain this synthetic reply"}'},props:{title:'xSend',fields,resetAfterSuccess,operation:async()=>result}});nodes(h.render(),n=>n.type==='Button'&&n.props['aria-label']==='xSend')[0].props.onClick();const form=nodes(h.render(),n=>n.type==='form')[0];form.props.onSubmit({preventDefault(){}});await new Promise(r=>setImmediate(r));return {h,draftKey};}
await test('reply form clears stored body only after explicit success',async()=>{const {h,draftKey}=await reply({ok:true},true);assert.deepEqual(JSON.parse(h.storage.get(draftKey)),{});});
await test('reply error keeps stored body and shows refusal',async()=>{const {h,draftKey}=await reply({error:'preview_readonly'},true);assert.equal(JSON.parse(h.storage.get(draftKey)).body,'Retain this synthetic reply');assert(nodes(h.render(),n=>n.props?.children==='nativeWriteBlocked').length);});
await test('non-reply form draft remains unchanged after success',async()=>{const {h,draftKey}=await reply({ok:true},false);assert.equal(JSON.parse(h.storage.get(draftKey)).body,'Retain this synthetic reply');});
await test('support reply opts into success clearing without changing other forms',async()=>{const h=harness('ticket-details.tsx');const form=nodes(h.render(),n=>typeof n.type==='function'&&n.type.name==='NativeForm')[0];assert.equal(form.props.resetAfterSuccess,true);});
console.log(`${passed} handler checks passed; ${failed} failed. No backend success, browser or mobile claim.`);if(failed)process.exitCode=1;
})();

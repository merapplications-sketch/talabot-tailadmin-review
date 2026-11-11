// Existing filters and navigation controller run against synthetic rows/in-memory browser boundary.
// Tests do not claim real browser layout, HTTP or actual scroll geometry.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),ts=require('typescript'),assert=require('node:assert/strict');
function harness(search='?section=orders&q=demo&status=preparing'){
 const states=[],stored=new Map(),events={},frame=[],scroll=[];let cursor=0;
 const loc={search},window={history:{pushState(_a,_b,url){loc.search=url},replaceState(_a,_b,url){loc.search=url}},scrollTo(_x,y){ctx.scrollY=y;scroll.push(y)}};
 const hooks={useState(v){const i=cursor++;if(!(i in states))states[i]=typeof v==='function'?v():v;return [states[i],v=>states[i]=typeof v==='function'?v(states[i]):v]},useCallback:f=>f,useEffect:fn=>fn()};
 const storage={getItem:k=>stored.get(k)??null,setItem:(k,v)=>stored.set(k,String(v))};
 const ctx={console,URLSearchParams,location:loc,window,sessionStorage:storage,scrollY:0,requestAnimationFrame:fn=>frame.push(fn),addEventListener:(k,fn)=>events[k]=fn,removeEventListener(){}};
 const cache=new Map();function load(p){p=path.resolve(p);if(cache.has(p))return cache.get(p);const exports={};cache.set(p,exports);const code=ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText;const req=n=>{if(n==='react')return hooks;if(n==='react/jsx-runtime')return require(n);if(n==='next-intl')return{useLocale:()=> 'en',useTranslations:()=>k=>k};if(n==='./fixture.json')return require('../src/components/talabot/native/fixture.json');if(['./domain','./ratings-data','./navigation','./b-route','./log-data','./format'].includes(n))return load(path.join(path.dirname(p),n+'.ts'));return new Proxy({},{get:(_,k)=>k==='__esModule'?true:String(k)});};vm.runInNewContext(code,{...ctx,exports,require:req,get scrollY(){return ctx.scrollY}},{filename:p});return exports;}
 const nav=load('src/components/talabot/native/navigation.ts');
 return {load,storage,loc,scroll,ctx,events,flush(){while(frame.length)frame.shift()()},render(){cursor=0;return nav.useNativeNavigation()},renderEntity(props){cursor=0;return load('src/components/talabot/native/entity-sections.tsx').default({section:'ratings',query:'',id:'r1',t:k=>k,navigate(){},...props})}};
}
const nodes=(v,p)=>!v||typeof v!=='object'?[]:Array.isArray(v)?v.flatMap(x=>nodes(x,p)):[...(p(v)?[v]:[]),...nodes(v.props?.children,p)];
let pass=0,fail=0;function test(n,fn){try{fn();pass++;console.log('PASS '+n)}catch(e){fail++;console.log('FAIL '+n+' — '+e.message)}}
const h=harness(),d=h.load('src/components/talabot/native/domain.ts');
const rows=[
 {id:'before',created_at:'2026-11-09T18:59:59Z',store_id:'s1',payment:'cash',status:'pending'},
 {id:'start',created_at:'2026-11-09T19:00:00Z',store_id:'s1',payment:'cash',status:'preparing'},
 {id:'middle',created_at:'2026-11-10T09:00:00Z',store_id:'s2',payment:'wallet',status:'delivered'},
 {id:'end',created_at:'2026-11-10T18:59:59Z',store_id:'s1',payment:'wallet',status:'preparing'},
 {id:'after',created_at:'2026-11-10T19:00:00Z',store_id:'s2',payment:'cash',status:'cancelled'},
];
const ids=f=>Array.from(d.secondaryFilter(rows,f).rows,r=>r.id);
test('period includes Dushanbe day boundaries and excludes adjacent days',()=>assert.deepEqual(ids({start:'2026-11-10',end:'2026-11-10'}),['start','middle','end']));
test('each period endpoint works independently',()=>{assert.deepEqual(ids({start:'2026-11-11'}),['after']);assert.deepEqual(ids({end:'2026-11-09'}),['before']);});
test('store and payment filters independently retain only matching rows',()=>{assert.deepEqual(ids({store:'s2'}),['middle','after']);assert.deepEqual(ids({payment:'wallet'}),['middle','end']);});
test('oldest and newest sorting preserve all rows and do not mutate source',()=>{assert.deepEqual(ids({sort:'oldest'}),['before','start','middle','end','after']);assert.deepEqual(ids({sort:'newest'}),['after','end','middle','start','before']);assert.equal(rows[0].id,'before');});
test('supported date/store/payment/status/search intersection yields one correct order',()=>{const source=d.searchOrders('#end','preparing',rows);assert.deepEqual(Array.from(d.secondaryFilter(source,{start:'2026-11-10',end:'2026-11-10',store:'s1',payment:'wallet',sort:'newest'}).rows,r=>r.id),['end']);});
test('invalid period returns explicit error, preserves filter inputs; correction applies',()=>{const f={start:'2026-11-11',end:'2026-11-10'};assert.equal(d.secondaryFilter(rows,f).error,'invalid_range');assert.deepEqual(f,{start:'2026-11-11',end:'2026-11-10'});f.start='2026-11-10';assert.equal(d.secondaryFilter(rows,f).error,null);assert.deepEqual(ids(f),['start','middle','end']);});
test('empty intersection does not mutate any inputs',()=>{const f={store:'missing',start:'2026-11-10',payment:'cash'};assert.deepEqual(ids(f),[]);assert.deepEqual(f,{store:'missing',start:'2026-11-10',payment:'cash'});});
test('order details/back preserves query,status and scroll; rehydrate preserves URL state',()=>{const n=h.render();h.ctx.scrollY=724;n.navigate({id:'start'});assert.equal(h.render().state.id,'start');h.render().back();h.flush();assert.equal(h.render().state.id,'');assert.equal(h.render().state.query,'demo');assert.equal(h.render().state.status,'preparing');assert.equal(h.scroll.at(-1),724);assert.equal(harness(h.loc.search).render().state.query,'demo');});
test('ratings linked order returns to exact rating context and list position remains saved',()=>{const h=harness('?section=ratings&q=Cold&id=r1');h.storage.setItem('ux02-native:filter:ratings','done');h.storage.setItem('ux02-native:scroll:?section=ratings&q=Cold','450');h.ctx.scrollY=120;h.render().navigate({section:'orders',id:'ord1'});h.render().back();h.flush();assert.equal(h.loc.search,'?section=ratings&q=Cold&id=r1');assert.equal(h.storage.getItem('ux02-native:filter:ratings'),'done');assert.equal(h.scroll.at(-1),120);h.render().back();h.flush();assert.equal(h.render().state.id,'');assert.equal(h.scroll.at(-1),450);});
test('rating detail Back uses restoration handler rather than navigation-to-top',()=>{const h=harness();const domain=h.load('src/components/talabot/native/domain.ts'),previous=domain.tables.ratings;domain.tables.ratings=[{id:'r1',order_id:'ord1'}];let restored=0;try{const tree=h.renderEntity({onBack:()=>restored++});const b=nodes(tree,n=>n.type==='Button'&&n.props.children?.includes?.('aBack'))[0];assert(b);b.props.onClick();assert.equal(restored,1);}finally{domain.tables.ratings=previous;}});
console.log(`${pass} list journey checks passed; ${fail} failed.`);if(fail)process.exitCode=1;

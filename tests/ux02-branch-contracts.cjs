// Narrow, preserved A operations only. Does not claim a migrated branch-management UI.
const fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript'),assert=require('node:assert/strict');
const cache={};function load(name){if(cache[name])return cache[name];const code=ts.transpileModule(fs.readFileSync('src/components/talabot/native/'+name,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,exports={};cache[name]=exports;vm.runInNewContext(code,{exports,require:n=>load(n.slice(2)+'.js'),console});return exports;}
const requests=[],service=load('mutation-service.js').createPreviewMutations(r=>requests.push(JSON.parse(JSON.stringify(r))));
let n=0;async function test(name,fn){await fn();console.log('PASS '+name);n++;}
(async()=>{
await test('approveItem only updates approved flag for selected menu item; preview refuses real write',async()=>{const r=await service.approveItem('synthetic-item');assert.equal(r.error,'preview_readonly');assert.deepEqual(requests.pop(),{kind:'table',table:'menu_items',action:'update',row:{approved:true},filter:{key:'id',value:'synthetic-item'}})});
await test('brand creation trims name and preserves original RPC arguments',async()=>{const r=await service.brandCreate('  Demo Brand  ','owner@example.test');assert.equal(r.error,'preview_readonly');assert.deepEqual(requests.pop(),{kind:'rpc',name:'brand_create',args:{p_name:'Demo Brand',p_owner_email:'owner@example.test'}})});
await test('brand name bounds rejected before transport',async()=>{for(const name of ['x','x'.repeat(61)])assert.equal((await service.brandCreate(name,'owner@example.test')).error,'bad_value');assert.equal(requests.length,0)});
await test('invalid brand identifier rejected before transport',async()=>{assert.equal((await service.brandAttach('synthetic-store','brand-1','branch')).error,'bad_value');assert.equal(requests.length,0)});
await test('branch attachment preserves source UUID, trimmed 60-character contract, store ID',async()=>{const id='11111111-1111-4111-8111-111111111111';await service.brandAttach('synthetic-store',id,'  '+'x'.repeat(65)+'  ');assert.deepEqual(requests.pop(),{kind:'rpc',name:'brand_attach',args:{p_store:'synthetic-store',p_brand:id,p_branch:'x'.repeat(60)}})});
await test('branch detach only sends store ID and does not claim success',async()=>{const r=await service.brandDetach('synthetic-store');assert.equal(r.error,'preview_readonly');assert.deepEqual(requests.pop(),{kind:'rpc',name:'brand_detach',args:{p_store:'synthetic-store'}})});
console.log(n+' narrow A contract checks passed; UI placement, confirmations and backend permissions remain unverified.');
})().catch(e=>{console.error(e);process.exitCode=1});

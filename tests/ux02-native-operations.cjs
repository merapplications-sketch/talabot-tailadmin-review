const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
const cache={};function load(name){if(cache[name])return cache[name];const p='src/components/talabot/native/'+name,code=ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,exports={};cache[name]=exports;vm.runInNewContext(code,{exports,console:{error:()=>{}},URLSearchParams,require:n=>n.endsWith('.json')?JSON.parse(fs.readFileSync('src/components/talabot/native/'+n.slice(2))):load(n.slice(2)+(['./contract-validators','./mutation-service'].includes(n)?'.js':'.ts'))});return exports}
const o=load('order-operations.ts'),requests=[],service=load('mutation-service.js').createPreviewMutations(r=>requests.push(JSON.parse(JSON.stringify(r))));
let count=0;async function test(name,fn){await fn();console.log('PASS '+name);count++}
(async()=>{
const now=o.snapshotTime,base={id:'demo-driver',driver_status:'approved',online:true,last_seen:new Date(now-60000).toISOString()},order={id:'demo-order',store_id:'s1',status:'ready'};
await test('stale heartbeat excluded at 120 seconds',()=>{assert(o.isLive(base,now));assert(!o.isLive({...base,last_seen:new Date(now-120000).toISOString()},now))});
await test('busy driver excluded without new business rules',()=>{assert.equal(o.assignmentCandidates(order,[base],[{driver_id:base.id,status:'pickedup'}],now).length,0)});
await test('eligible approved driver retained',()=>assert.equal(o.assignmentCandidates(order,[base],[],now).length,1));
await test('unassigned alert only after original 90-second threshold',()=>{const row={...order,created_at:new Date(now-90000).toISOString()};assert.equal(o.operationalAlerts([row],[],[],now).unassigned.length,0);assert.equal(o.operationalAlerts([{...row,created_at:new Date(now-90001).toISOString()}],[],[],now).unassigned.length,1)});
await test('assigned or terminal orders not assignable',()=>{assert(!o.canAssign({...order,driver_id:'d'}));assert(!o.canAssign({...order,status:'delivered'}))});
await test('low rating resolved excluded',()=>{assert(o.lowRating({store_stars:2},2));assert(!o.lowRating({store_stars:2,handled_at:'done'},2))});
await test('support reply rules',()=>{assert(o.needsReply({status:'open'}));assert(!o.needsReply({status:'resolved'}));assert(!o.needsReply({status:'open',last_staff_at:'2026-11-10T10:00Z',last_customer_at:'2026-11-10T09:00Z'}))});
await test('assignment preserves original RPC arguments; no success claimed',async()=>{const r=await service.assignDriver(order.id,base.id);assert.equal(r.error,'preview_readonly');assert.deepEqual(requests.pop(),{kind:'rpc',name:'admin_assign_driver',args:{p_order:'demo-order',p_driver:'demo-driver'}})});
await test('wallet zero never reaches transport',async()=>{const before=requests.length;assert.equal((await service.walletAdjust('demo','0','reason')).error,'bad_value');assert.equal(requests.length,before)});
await test('wallet amount rounding and trimmed note match source',async()=>{await service.walletAdjust('demo',12.345,'  correction  ');assert.deepEqual(requests.pop(),{kind:'rpc',name:'wallet_adjust',args:{p_user:'demo',p_amount:12.35,p_note:'correction'}})});
await test('customer phone normalization and reason match source',async()=>{await service.setCustomerPhone('demo','0900000062',' correction ');assert.deepEqual(requests.pop(),{kind:'rpc',name:'admin_set_customer_phone',args:{p_user:'demo',p_phone:'+992900000062',p_reason:'correction'}})});
await test('invalid staff permission rejected before transport',async()=>assert.equal((await service.staffSet('demo@test.com',['invented'],true)).error,'bad_value'));
await test('driver limit maximum preserved',async()=>assert.equal((await service.setDriverLimit('demo',1000001)).error,'bad_value'));
await test('negative refund rejected',async()=>assert.equal((await service.ticketSetStatus('demo','resolved','note',-1)).error,'bad_value'));
await test('rejected ticket requires reason',async()=>assert.equal((await service.ticketSetStatus('demo','rejected','x',null)).error,'note_required'));
await test('happy-hour overnight row contract preserved',async()=>{await service.saveHH({title:' Demo ',days:[1,8],start:'21:00',end:'01:00',pct:10.9,active:true});assert.deepEqual(requests.pop(),{kind:'table',table:'happy_hours',action:'insert',row:{title:'Demo',store_id:null,days:[1],start_time:'21:00',end_time:'01:00',discount_pct:10,active:true}})});
await test('native mutation service has no production transport',()=>{const source=fs.readFileSync('src/components/talabot/native/mutation-service.js','utf8');assert(!/fetch\(|XMLHttpRequest|createClient|https?:\/\//.test(source));assert.equal(Object.keys(service).length,37)});
console.log(count+' new affected checks passed; no server RBAC or production success claim.');
})().catch(e=>{console.error(e);process.exitCode=1});

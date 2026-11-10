const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const source=fs.readFileSync('src/components/talabot/native/domain.ts','utf8');const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
const module0={exports:{}};vm.runInNewContext(code,{exports:module0.exports,require:()=>JSON.parse(fs.readFileSync('src/components/talabot/native/fixture.json')),URLSearchParams});const d=module0.exports;
(async()=>{let n=0;function check(name,fn){fn();console.log('PASS '+name);n++}
check('A metric definitions',()=>assert.deepEqual(JSON.parse(JSON.stringify(d.metrics())),{orders:7,revenue:415,commission:44,active:4}));
check('search by id and status',()=>assert.equal(d.searchOrders('#ord4','delivered').length,1));check('wrong status',()=>assert.equal(d.searchOrders('ord4','pending').length,0));check('customer search',()=>assert.equal(d.searchOrders('Муаммад').length,7));check('phone search',()=>assert.equal(d.searchOrders('900000000').length,7));check('empty search result',()=>assert.equal(d.searchOrders('missing').length,0));
check('cancelled online is not proven refunded',()=>{const f=d.finance(d.findOrder('ord5'));assert(f.online&&f.dead&&!f.commissionRecognized);assert(f.walletReturned)});
check('delivered commission only',()=>assert(d.finance(d.findOrder('ord4')).commissionRecognized));check('unknown id',()=>assert.equal(d.findOrder('absent'),undefined));
check('reload restores query and recomputes results',()=>{const state=d.listState('?section=orders&q=ord4&status=delivered');assert.equal(d.searchOrders(state.query,state.status).length,1)});
check('chat location safe parser',()=>{assert.equal(d.parseLocation('LOC:999,68'),null);assert.equal(d.parseLocation('<img>'),null);assert.equal(d.parseLocation('LOC:38.56,68.78').lat,38.56)});
const denied=await d.readOrders('','all','denied'),error=await d.readOrders('','all','error');check('read denied and failure distinct',()=>{assert.equal(denied.error,'not_allowed');assert.equal(error.error,'unavailable')});check('writes fail explicitly and do not mutate fixture',()=>{const before=JSON.stringify(d.tables);assert.equal(d.previewWrite().error.code,'PREVIEW');assert.equal(JSON.stringify(d.tables),before)});
check('native source has no embedding or legacy runtime',()=>{for(const f of fs.readdirSync('src/components/talabot/native').filter(f=>/tsx?$/.test(f))){const s=fs.readFileSync('src/components/talabot/native/'+f,'utf8');assert(!/iframe|dangerouslySetInnerHTML|innerHTML|TLB\.|render0|talabat-core/.test(s),f)}});
console.log(n+' checks passed');})();

// Additional regression cases discovered during source parity review.
assert.equal(d.finance({payment:'Наличными',status:'delivered'}).cash,true);
assert.equal(d.finance({payment:'Cash',status:'pending'}).cash,true);
assert.equal(d.finance({payment:'cash',status:'delivered',cash_settled_at:'2026-11-10'}).settled,true);
assert.equal(d.elapsedSeconds('2026-11-10T09:01:01.400Z','2026-11-10T09:00:00.900Z'),61);
assert.equal(d.tables.orders.filter(o=>o.customer_id==='pv-cust62').length,62);
assert(d.findOrder('h999')._hist);
assert.equal(d.searchOrders('').length,7);
assert.equal(d.secondaryFilter(d.tables.orders,{start:'2026-11-11',end:'2026-11-10'}).error,'invalid_range');
console.log('PASS 8 order parity regressions (cash aliases, settlement, second boundaries, history, initial scope, invalid period)');

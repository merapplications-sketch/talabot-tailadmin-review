// Real B SSR and source-derived rating logic. No browser/backend claims.
process.env.UX02_SSR_OUTPUT='docs/ux02/ratings-parity';
const {load,wrap,React,storage}=require('./ux02-composition-ssr.cjs');
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {tables}=load('src/components/talabot/native/domain');
const Entity=load('src/components/talabot/native/entity-sections').default;
const dict=require('../src/components/talabot/native/dictionary.json').en;
const base={store_id:'s1',created_at:'2026-11-11T04:00:00Z',comment:''};
const sample=[
 {id:'store-only',store_stars:3}, {id:'driver-only',driver_stars:2},
 {id:'both',store_stars:5,driver_stars:4,comment:'[Cold | Late] Synthetic comment'},
 {id:'low-handled',store_stars:1,driver_stars:1,handled_at:'2026-11-11T05:00:00Z',handled_note:'Resolved synthetic note'},
 {id:'missing',store_stars:null}, {id:'high-unhandled',store_stars:4,driver_stars:5},
 {id:'boundary-three',driver_stars:3}, {id:'store-handled',store_stars:3,handled_at:'2026-11-11T05:00:00Z'},
].map(r=>({...base,...r,order_id:r.id}));
const previous=tables.ratings;tables.ratings=sample;
let passed=0,failed=0;function test(name,fn){try{fn();passed++;console.log('PASS '+name)}catch(e){failed++;console.log('FAIL '+name+' — '+e.message)}}
const render=(id='',filter='all',query='')=>{storage.clear();if(filter!==null)storage.setItem('ux02-native:filter:ratings',filter);return wrap(React.createElement(Entity,{section:'ratings',query,id,t:k=>dict[k]||k,navigate(){},onBack(){}}));};
const list=h=>h.slice(h.indexOf('<table'),h.indexOf('</table>')+8);
const summaries=h=>h.match(/data-testid="summary-cards"[\s\S]*?(?=<label|<section)/)?.[0]||'';
try{
 test('comment labelled consistently in desktop row and mobile card, never Phone',()=>{const h=render();assert(!h.includes('>Phone<'));assert.equal((h.match(/>Comment</g)||[]).length,9);assert(h.includes('Synthetic comment'));assert(!h.includes('href="tel:'));});
 test('needs filter includes only existing <=3 unhandled values',()=>{const h=list(render('','need'));for(const id of ['store-only','driver-only','boundary-three'])assert(h.includes(id),id);for(const id of ['both','low-handled','missing','high-unhandled','store-handled'])assert(!h.includes(id),id);});
 test('handled filter excludes all unhandled values',()=>{const h=list(render('','done'));assert(h.includes('low-handled'));assert(h.includes('store-handled'));assert(!h.includes('high-unhandled'));assert(!h.includes('store-only'));});
 test('default follows A needs filter; all retains missing and high ratings',()=>{assert(!list(render('',null)).includes('high-unhandled'));for(const row of sample)assert(list(render()).includes(row.id),row.id);});
 test('summary averages/counts hand calculated: driver 15/5=3.0; store16/5=3.2; needs3,total8',()=>{const h=render();assert.equal((h.match(/data-summary-info/g)||[]).length,4);for(const value of ['3.0 ★','3.2 ★','Couriers · 5 ratings','Stores · 5 ratings'])assert(h.includes(value),value);assert(/>3<\/span>/.test(h));assert(/>8<\/span>/.test(h));});
 test('summary scope unchanged across display filters and empty search',()=>{const a=summaries(render());assert(a);for(const [f,q]of[['need',''],['done',''],['all','no-match']])assert.equal(summaries(render('',f,q)),a);});
 test('missing values do not create zero stars in detail',()=>{const h=render('missing');assert(!h.includes('0<!-- --> ★'));assert(!h.includes('0 ★'));assert(h.includes(dict.aNoCmt));assert(h.includes(dict.uRNot));});
 test('secondary detail retains store,date,tagged comment and available ratings',()=>{const h=render('both');for(const v of ['Ресторан','Nov 11, 2026','Cold','Late','Synthetic comment','5','4'])assert(h.includes(v),v);assert(!h.includes('[Cold | Late]'));assert(!h.includes('role="dialog"'));});
 test('handled details retain date/note and expose only reopen',()=>{const h=render('low-handled');assert(h.includes('Resolved synthetic note'));assert(h.includes('10:00'));assert(h.includes(dict.aReopen));assert(!h.includes(dict.aResolveT));});
 test('empty list uses original em dash and zero counts, never invented zero average',()=>{tables.ratings=[];const h=render();assert.equal((h.match(/data-summary-info/g)||[]).length,4);assert(!h.includes('0.0'));assert(h.includes('Couriers · 0 ratings'));tables.ratings=sample;});
 test('long comment remains intact in details and no markup is interpreted',()=>{const comment='long synthetic '.repeat(90)+'<script>bad</script>';tables.ratings=[{...sample[0],comment}];const h=render('store-only');assert(h.includes('long synthetic '.repeat(90)));assert(h.includes('&lt;script&gt;bad&lt;/script&gt;'));tables.ratings=sample;});
 test('rating logic matches original avg/lowOf/needR/cmtParts including null and tags',()=>{const p='src/components/talabot/native/ratings-data.ts';assert(fs.existsSync(p),'source-derived rating functions not present');const actual=load(p);const source=fs.readFileSync('public/operations-source/admin.html','utf8');const code=['avg','lowOf','needR'].map(n=>source.match(new RegExp('const '+n+'=[^\\n]+'))[0]).join('\n')+'\n'+source.match(/function cmtParts\(c\)\{[^\n]+/)[0]+'\nthis.original={avg,lowOf,needR,cmtParts}';const ctx={};vm.runInNewContext(code,ctx);for(const r of sample)assert.equal(actual.needsRatingFollowup(r),ctx.original.needR(r));for(const key of ['driver_stars','store_stars'])assert.deepEqual(JSON.parse(JSON.stringify(actual.ratingAverage(sample,key))),JSON.parse(JSON.stringify(ctx.original.avg(sample,key))));for(const v of ['',null,'[ a | b || c ] text','['+'x'.repeat(161)+'] text','[1|2|3|4|5|6|7|8|9] remaining'])assert.deepEqual(JSON.parse(JSON.stringify(actual.ratingComment(v))),JSON.parse(JSON.stringify(ctx.original.cmtParts(v))));assert.equal(actual.needsRatingFollowup({driver_stars:3}),true);assert.equal(ctx.original.lowOf({driver_stars:3},2),false);});
}finally{tables.ratings=previous;storage.clear();}
console.log(`${passed} ratings parity checks passed; ${failed} failed (plus8 shared SSR checks).`);if(failed)process.exitCode=1;

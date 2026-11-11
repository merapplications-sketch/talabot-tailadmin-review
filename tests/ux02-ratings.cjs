// Full server render using original B components; no browser or backend claim.
process.env.UX02_SSR_OUTPUT ||= 'docs/ux02/support-continuation';
const {load,wrap,React}=require('./ux02-composition-ssr.cjs');
const assert=require('node:assert/strict');
const {tables}=load('src/components/talabot/native/domain');
const Entity=load('src/components/talabot/native/entity-sections').default;
const dict=require('../src/components/talabot/native/dictionary.json').en;
const previous=tables.ratings;
const render=handled=>{tables.ratings=[{id:'synthetic-rating',order_id:'ord1',store_stars:2,driver_stars:4,comment:'Synthetic customer feedback',handled_at:handled?'2026-11-11T04:00:00Z':null,handled_note:handled?'Synthetic previous resolution':''}];return wrap(React.createElement(Entity,{section:'ratings',query:'',id:'synthetic-rating',t:k=>dict[k]||k,navigate(){}}));};
let passed=0,failed=0;function test(name,fn){try{fn();passed++;console.log('PASS '+name)}catch(e){failed++;console.log('FAIL '+name+' — '+e.message)}}
try{
 test('handled rating exposes reopen but not another resolve form',()=>{const h=render(true);assert(h.includes(dict.aReopen));assert(!h.includes(dict.aResolveT));});
 test('unhandled rating exposes resolve but not reopen',()=>{const h=render(false);assert(h.includes(dict.aResolveT));assert(!h.includes(dict.aReopen));});
 test('handled rating retains both stars, customer comment, prior note and order link',()=>{const h=render(true);for(const value of ['Synthetic customer feedback','Synthetic previous resolution','ord1','2','4'])assert(h.includes(value),value);});
 test('rating forms remain closed initially in both states',()=>{for(const handled of [true,false])assert(!render(handled).includes('role="dialog"'));});
}finally{tables.ratings=previous;}
console.log(`${passed} rating state checks passed; ${failed} failed (plus8 shared SSR checks).`);if(failed)process.exitCode=1;

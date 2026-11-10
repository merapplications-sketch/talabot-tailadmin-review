const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),cp=require('child_process');
const current=fs.readFileSync('public/operations-source/admin.html','utf8');
const old=cp.execFileSync('git',['show','6782f98:public/operations-source/admin.html'],{encoding:'utf8'});
function boot(html){let ready,called=0;const ctx={window:{},TLB:{start:(_,cb)=>cb(),on:()=>{}},autoR(){},uiRestore(){},render(){called++},document:{addEventListener:(_,cb)=>ready=cb}};vm.runInNewContext(html.split('\n').find(x=>x.includes("TLB.start('admin'")),ctx);ctx.window.uxInit=()=>{};if(ready)ready();return called;}
assert.throws(()=>boot(old),/uxInit/);assert.equal(boot(current),1);
const app={firstElementChild:null,querySelector:()=>null,lastChild:null};
const ctx={window:{TLB:{},addEventListener(){}},TLB:{lang:()=> 'en',orders:()=>[]},tab:'o',D:null,OQ:'',f:'',location:{search:'',origin:'http://test'},sessionStorage:{getItem:()=>null,setItem(){}},URLSearchParams,document:{body:{},getElementById:id=>id==='app'?app:null,createElement(){throw new Error('Adapter touched empty app before initial render')}},MutationObserver:class{observe(){}},ResizeObserver:class{observe(){}},addEventListener(){},parent:{postMessage(){}}};
vm.runInNewContext(fs.readFileSync('public/operations-source/adapter.js','utf8'),ctx);
console.log('PASS: old uxInit race reproduced; DOMContentLoaded starts once after adapter definition; empty app is not mutated before initial render.');

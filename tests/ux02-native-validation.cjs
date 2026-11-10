const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
const cache={};function load(path){if(cache[path])return cache[path];const output=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;const exports={};cache[path]=exports;vm.runInNewContext(output,{exports,URLSearchParams,require:name=>name.endsWith('.json')?JSON.parse(fs.readFileSync('src/components/talabot/native/'+name.slice(2))):load('src/components/talabot/native/'+name.slice(2)+(name==='./contract-validators'?'.js':'.ts'))});return exports}
const v=load('src/components/talabot/native/validation.ts');let n=0;function check(name,fn){fn();console.log('PASS '+name);n++}
check('wallet zero rejected',()=>assert.equal(v.validateWallet({amount:'0',note:'correction'}),'err_bad_value'));
check('wallet reason required',()=>assert.equal(v.validateWallet({amount:'20',note:'x'}),'err_bad_value'));
check('wallet negative correction retained',()=>assert.equal(v.validateWallet({amount:'-20.25',note:'correction'}),null));
check('wallet bound enforced',()=>assert.equal(v.validateWallet({amount:'100000.01',note:'correction'}),'err_bad_value'));
check('invalid phone rejected',()=>assert.equal(v.validatePhone({phone:'1234',reason:'correction'}),'err_bad_phone'));
check('phone reason required',()=>assert.equal(v.validatePhone({phone:'900000062',reason:'x'}),'err_note_required'));
check('valid Tajik phone shape',()=>assert.equal(v.validatePhone({phone:'900000062',reason:'correction'}),null));
check('staff permission selection required',()=>assert.equal(v.validateStaff({email:'demo@example.test'}),'aStfPick'));
check('merchant discount cap preserved',()=>assert.equal(v.validateMerchant({name:'Demo',phone:'900000062',discount_pct:20,max_discount_pct:10}),'err_discount_over_max'));
check('promo over 100 percent rejected',()=>assert.equal(v.validatePromo({code:'DEMO',kind:'percent',value:101}),'err_bad_promo'));
check('promo invalid date range rejected',()=>assert.equal(v.validatePromo({code:'DEMO',kind:'fixed',value:10,starts_at:'2026-11-11',ends_at:'2026-11-10'}),'err_bad_promo'));
check('happy hours overnight permitted',()=>assert.equal(v.validateHappy({title:'Demo',days:'1,2',discount_pct:10,start_time:'21:00',end_time:'01:00'}),null));
check('happy hours same time rejected',()=>assert.equal(v.validateHappy({title:'Demo',days:'1,2',discount_pct:10,start_time:'21:00',end_time:'21:00'}),'yHeNeed'));
check('Dushanbe date contract',()=>assert.equal(v.datesToContract({ends_at:'2026-11-10'}).ends_at,'2026-11-10T23:59:59+05:00'));
console.log(n+' validation checks passed. These validate client input constraints, not server authorization.');

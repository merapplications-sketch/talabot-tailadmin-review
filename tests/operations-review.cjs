const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/root/.cache/ms-playwright/chromium_headless_shell-1161/chrome-linux/headless_shell'});
 const context=await browser.newContext();const page=await context.newPage();const out=process.env.OP_OUT||'docs/evidence/operations-review';fs.mkdirSync(out,{recursive:true});const checks=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base=process.env.BASE_URL||'http://127.0.0.1:3022';
 async function open(path){await page.goto(base+path,{waitUntil:'networkidle'});await page.locator('.op-main[aria-busy=false]').waitFor();}
 for(const locale of ['en','ru','tg'])for(const theme of ['light','dark'])for(const [width,height] of [[390,844],[1440,1000]]){
  await page.setViewportSize({width,height});await open(`/${locale}/review/operations`);await page.evaluate(theme=>{localStorage.setItem('theme-mode',theme);},theme);await page.reload({waitUntil:'networkidle'});await page.locator('.op-main[aria-busy=false]').waitFor();
  for(let i=0;i<6;i++){await page.locator('.op-tabs button').nth(i).click();assert.equal(await page.locator('.op-desktop tbody tr').count()>0,true);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${locale}/${theme}/${width}/${i} overflow`);}
  checks.push({locale,theme,width,modules:6,overflow:false});await page.screenshot({path:`${out}/${locale}-${theme}-${width}.png`,fullPage:true});
 }
 await context.clearCookies();await page.setViewportSize({width:390,height:844});await open('/review/operations');
 await page.getByLabel('Search ID or name').fill('DEMO-M02');assert.equal(await page.locator('.op-mobile article').count(),1);
 await page.getByLabel('Sort by name').selectOption('desc');await page.reload({waitUntil:'networkidle'});assert.equal(await page.getByLabel('Search ID or name').inputValue(),'DEMO-M02');assert.equal(await page.getByLabel('Sort by name').inputValue(),'desc');
 await page.locator('.op-mobile button').click();assert.equal(await page.locator('.op-detail h2').evaluate(el=>document.activeElement===el),true);await page.goBack();await page.locator('.op-detail').waitFor({state:'hidden'});assert.equal(await page.getByLabel('Search ID or name').inputValue(),'DEMO-M02');await page.locator('.op-mobile button').click();await page.getByRole('button',{name:'Close details'}).click();await page.locator('.op-detail').waitFor({state:'hidden'});assert.equal(await page.getByLabel('Search ID or name').inputValue(),'DEMO-M02');
 await page.getByLabel('Search ID or name').fill('missing-example');assert.equal(await page.getByText('No matching examples',{exact:true}).count(),1);await page.getByRole('button',{name:'Reset filters'}).click();
 await page.locator('.op-filters select').first().selectOption('paused');assert.equal(await page.locator('.op-mobile article').count(),1);
 checks.push({search:true,filter:true,sortReload:true,detailsReturn:true,emptyReset:true});
 await page.locator('.op-tabs button').nth(3).click();await page.locator('.op-mobile button').click();
 const returnButton=page.getByRole('button',{name:'Record meal returned (demo)'});assert.equal(await returnButton.isDisabled(),true);await page.getByLabel('Restaurant prior consent recorded (demo)').check();assert.equal(await returnButton.isDisabled(),true);await page.getByLabel('Reason (required)',{exact:true}).fill('Synthetic cancellation');await returnButton.click();
 const forms=page.locator('.op-timeline form');await page.getByLabel('Actual amount (TJS)',{exact:true}).fill('60');await forms.nth(0).getByRole('button').click();await page.getByLabel('Driver confirms actual receipt',{exact:true}).fill('55');await forms.nth(1).getByRole('button').click();assert.equal(await page.getByText('Amounts differ — review required',{exact:true}).count(),1);assert.equal(await page.getByText('25.00 TJS',{exact:true}).count(),1);
 await page.getByLabel('Driver confirms actual receipt',{exact:true}).fill('60');await forms.nth(1).getByRole('button').click();assert.equal(await page.getByText('Partial recovery — claim remains open',{exact:true}).count(),1);assert.equal(await page.getByText('20.00 TJS',{exact:true}).count(),1);
 await page.getByLabel('Actual amount (TJS)',{exact:true}).fill('80');await forms.nth(0).getByRole('button').click();await page.getByLabel('Driver confirms actual receipt',{exact:true}).fill('80');await forms.nth(1).getByRole('button').click();assert.equal(await page.getByText('Cash recovered — delivery fee still requires review',{exact:true}).count(),1);
 await page.getByLabel('Actual amount (TJS)',{exact:true}).fill('80.001');await forms.nth(0).getByRole('button').click();assert.equal(await page.getByRole('alert').count(),1);
 checks.push({consentGuard:true,reasonGuard:true,mismatch:true,partialOpenClaim:true,fullRecoveryFeePending:true,decimalValidation:true});await page.screenshot({path:`${out}/cash-return-390.png`,fullPage:true});
 await page.locator('.op-tabs button').nth(2).click();await page.locator('.op-mobile button').first().click();assert.equal(await page.getByRole('button',{name:'Save demo draft'}).isDisabled(),true);await page.getByLabel('Simulated permission').check();await page.getByLabel('Signed integer points').fill('25');await page.getByLabel('Reason (required)').fill('Demo adjustment');await page.getByRole('button',{name:'Save demo draft'}).click();assert.equal(await page.getByRole('status').count()>0,true);checks.push({pointsPermissionAndReason:true});
 assert.deepEqual(errors,[]);fs.writeFileSync(`${out}/results.json`,JSON.stringify({engine:'Chromium',safari:false,checks,errors},null,2));await browser.close();console.log(`PASS operations: ${checks.length} groups, 72 module viewport checks`);
})().catch(e=>{console.error(e);process.exit(1)});

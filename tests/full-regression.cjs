// Existing admin suites, run against a separately started synthetic preview.
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const output = process.env.REGRESSION_OUTPUT || '/tmp/talabot-full-regression';
fs.mkdirSync(output, { recursive: true });
const suites = ['date-tests.mjs','forms-tests.mjs','talabot-orders-wording.mjs','talabot-orders-data.cjs','talabot-directory-data.cjs','talabot-analytics-data.cjs','talabot-design.cjs','talabot-input-nav.cjs','talabot-orders.cjs','talabot-orders-filters.cjs','talabot-orders-followup.cjs','talabot-directories.cjs','talabot-pages-focused.cjs','talabot-pages-visual.cjs','talabot-statistics.cjs','visual-review.cjs','notification-clipping.cjs','window-followup.cjs','safari-followup-acceptance.cjs','safari-followup-regression.cjs'];
if (!process.env.BASE_URL) throw new Error('BASE_URL must point to a synthetic review server');
const results=[];
for (const suite of suites) {
  const started=Date.now();
  fs.mkdirSync(path.resolve(output,suite.replace(/\.[^.]+$/,'')), {recursive:true});
  const result=spawnSync(process.execPath,[path.join('tests',suite)],{encoding:'utf8',timeout:300000,env:{...process.env,LOCAL:'1',QA_OUTPUT_DIR:path.resolve(output,suite.replace(/\.[^.]+$/,''))},maxBuffer:10*1024*1024});
  fs.writeFileSync(path.join(output,suite+'.log'),(result.stdout||'')+(result.stderr||''));
  results.push({suite,exitCode:result.status,durationMs:Date.now()-started,error:result.error?.message||null});
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({base:process.env.BASE_URL,results},null,2));
  console.log(`${result.status===0?'PASS':'FAIL'} ${suite}`);
}
process.exitCode=results.some(r=>r.exitCode!==0)?1:0;

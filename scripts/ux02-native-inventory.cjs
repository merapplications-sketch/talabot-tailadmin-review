const fs=require('fs'),vm=require('vm'),ts=require('typescript'),crypto=require('crypto');
const admin=fs.readFileSync('public/operations-source/admin.html','utf8'),core=fs.readFileSync('public/operations-source/talabat-core.js','utf8');
const calls=[...new Set([...admin.matchAll(/TLB\.(\w+)\s*\(/g)].map(x=>x[1]))].sort();
const ast=ts.createSourceFile('core.js',core,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS),definitions={};
function walk(n){if(ts.isPropertyAssignment(n)&&n.name&&calls.includes(n.name.getText(ast))){definitions[n.name.getText(ast)]={source:n.getText(ast),line:ast.getLineAndCharacterOfPosition(n.getStart(ast)).line+1};}ts.forEachChild(n,walk);}walk(ast);
const inventory={reference:'89b229e58526091594af5586fc15be13bb0c3cc4',hash:crypto.createHash('sha256').update(core).digest('hex'),calls,definitions,unresolved:calls.filter(x=>!definitions[x]),scope:'Source extraction only. Client checks are not proof of server authorization. Unknown contracts stay blocked.'};
fs.writeFileSync('docs/ux02/native/contracts.json',JSON.stringify(inventory,null,2));
let fixture=fs.readFileSync('public/operations-source/preview-client.js','utf8').split(' if(window.__EMPTY)')[0]+'})();';
class FixedDate extends Date{constructor(...args){super(...(args.length?args:['2026-11-10T12:00:00Z']));} static now(){return 1794312000000;}}
const sandbox={window:{},Date:FixedDate};vm.runInNewContext(fixture,sandbox);
fs.writeFileSync('src/components/talabot/native/fixture.json',JSON.stringify(sandbox.window.__pvTables,null,2));
console.log(JSON.stringify({calls:calls.length,definitions:Object.keys(definitions).length,unresolved:inventory.unresolved,tables:Object.keys(sandbox.window.__pvTables).length}));

const fs=require('fs'),ts=require('typescript'),vm=require('vm');let dict;
const core=fs.readFileSync('public/operations-source/talabat-core.js','utf8'),ast=ts.createSourceFile('core',core,99,true);
function visit(n){if(ts.isVariableDeclaration(n)&&n.name.getText(ast)==='I')dict=vm.runInNewContext('('+n.initializer.getText(ast)+')');ts.forEachChild(n,visit)}visit(ast);
const a=fs.readFileSync('public/operations-source/admin.html','utf8');for(const match of a.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)){const tree=ts.createSourceFile('a',match[1],99,true);function walk(n){if(ts.isCallExpression(n)&&n.expression.getText(tree)==='TLB.addDict'){const [ru,en]=n.arguments.map(x=>vm.runInNewContext('('+x.getText(tree)+')'));Object.assign(dict.ru,ru);Object.assign(dict.en,en)}ts.forEachChild(n,walk)}walk(tree)}
fs.writeFileSync('src/components/talabot/native/dictionary.json',JSON.stringify(dict,null,2));

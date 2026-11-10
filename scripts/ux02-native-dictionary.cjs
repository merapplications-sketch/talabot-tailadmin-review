async function dictionaryMain(){
const fs=await import('node:fs'),ts=(await import('typescript')).default,vm=await import('node:vm');let dict;
const core=fs.readFileSync('public/operations-source/talabat-core.js','utf8'),ast=ts.createSourceFile('core',core,99,true);
function visit(n){if(ts.isVariableDeclaration(n)&&n.name.getText(ast)==='I')dict=vm.runInNewContext('('+n.initializer.getText(ast)+')');ts.forEachChild(n,visit)}visit(ast);
function extend(n){if(ts.isCallExpression(n)&&n.expression.getText(ast)==='Object.assign'&&/^I\.(ru|en)$/.test(n.arguments[0]?.getText(ast)||'')&&ts.isObjectLiteralExpression(n.arguments[1])){const lang=n.arguments[0].getText(ast).slice(2);Object.assign(dict[lang],vm.runInNewContext('('+n.arguments[1].getText(ast)+')'));}ts.forEachChild(n,extend)}extend(ast);
const a=fs.readFileSync('public/operations-source/admin.html','utf8');for(const match of a.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)){const tree=ts.createSourceFile('a',match[1],99,true);function walk(n){if(ts.isCallExpression(n)&&n.expression.getText(tree)==='TLB.addDict'){const [ru,en]=n.arguments.map(x=>vm.runInNewContext('('+x.getText(tree)+')'));Object.assign(dict.ru,ru);Object.assign(dict.en,en)}ts.forEachChild(n,walk)}walk(tree)}
fs.writeFileSync('src/components/talabot/native/dictionary.json',JSON.stringify(dict,null,2));

}
dictionaryMain().catch(error=>{console.error(error);process.exitCode=1;});

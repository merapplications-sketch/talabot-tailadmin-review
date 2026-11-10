async function main(){
 const fs=await import('node:fs'),ts=(await import('typescript')).default;
 const source=fs.readFileSync('public/operations-source/talabat-core.js','utf8'),ast=ts.createSourceFile('core',source,99,true),wanted=['cleanStore','validStore','validBanner','validPromo','normPhone','num'],found={};
 function walk(node){if(ts.isFunctionDeclaration(node)&&wanted.includes(node.name?.text)){found[node.name.text]=node.getText(ast)}ts.forEachChild(node,walk)}walk(ast);
 if(wanted.some(k=>!found[k]))throw Error('Missing source validator');
 fs.writeFileSync('src/components/talabot/native/contract-validators.js','// Pure client validators extracted verbatim from frozen A; no DOM, auth or transport.\n'+wanted.map(k=>'export '+found[k]).join('\n'));
 console.log('Extracted 6 pure validators from A; original source unchanged.');
}
main().catch(error=>{console.error(error);process.exitCode=1});

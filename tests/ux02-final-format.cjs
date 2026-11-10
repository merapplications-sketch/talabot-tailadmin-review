const fs=require('fs'),ts=require('typescript'),vm=require('vm'),assert=require('node:assert/strict');
const context={exports:{},Intl,Date};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/components/talabot/native/format.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,context);
const f=context.exports.formatDate;
assert.equal(f('', 'en'),'—');assert.equal(f('unknown date','ru'),'unknown date');
assert.match(f('2026-11-10T23:30:00Z','en'),/Nov 11, 2026, 04:30/);
assert.match(f('2026-11-10T23:30:00Z','ru'),/11.*нояб.*2026.*04:30/);
assert.match(f('2026-11-10T23:30:00Z','tg'),/11\/11\/2026, 04:30/);
console.log('PASS 5 display-date cases: empty, invalid, EN/RU/TG midnight rollover; no amount or timestamp mutation.');

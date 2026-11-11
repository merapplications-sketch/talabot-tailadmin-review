// Server-rendered composition checks. These do not measure pixels or test a browser.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const ts=require('typescript'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const {NextIntlClientProvider}=require('next-intl');
const root=process.cwd(),cache=new Map();
const icon=(props)=>React.createElement('svg',props);
const icons=new Proxy({}, {get:(_,name)=>name==='__esModule'?true:icon});
const stored=new Map();
const storage={getItem:k=>stored.get(k)??null,setItem:(k,v)=>stored.set(k,v),clear:()=>stored.clear()};
function load(file){
 file=path.resolve(file);
 if(file.endsWith('.png?url'))return '/original-logo.png';
 if(!path.extname(file)) file=[file+'.tsx',file+'.ts',file+'.js',path.join(file,'index.tsx'),path.join(file,'index.ts')].find(fs.existsSync);
 if(cache.has(file))return cache.get(file).exports;
 if(file.endsWith('.json')) return JSON.parse(fs.readFileSync(file));
 if(/\.(css|png|svg)$/.test(file))return {};
 const mod={exports:{}};cache.set(file,mod);
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText;
 const localRequire=name=>{
  if(name==='@/icons'||name.startsWith('@/icons/'))return icons;
  if(name==='next/navigation') return {useSearchParams:()=>new URLSearchParams(''),usePathname:()=>'/orders'};
  if(name==='@/i18n/navigation')return {useRouter:()=>({replace(){},push(){}}),usePathname:()=>'/orders',Link:({children,href,...p})=>{delete p.scroll;return React.createElement('a',{href,...p},children)}};
  if(name.startsWith('@/'))return load(path.join(root,'src',name.slice(2)));
  if(name.startsWith('.'))return load(path.resolve(path.dirname(file),name));
  return require(name);
 };
 vm.runInNewContext(code,{module:mod,exports:mod.exports,require:localRequire,console,URL,URLSearchParams,sessionStorage:storage,localStorage:storage,location:{search:''},setTimeout,clearTimeout},{filename:file});
 return mod.exports;
}
const messages=require('../src/messages/en.json');
const dict=require('../src/components/talabot/native/dictionary.json').en;
const {TooltipProvider}=load('src/components/ui/tooltip');
const wrap=component=>renderToStaticMarkup(React.createElement(NextIntlClientProvider,{locale:'en',messages,timeZone:'Asia/Dushanbe'},React.createElement(TooltipProvider,null,component)));
const {OrdersPresentation}=load('src/components/talabot/native/b-shell/list-patterns');
const {tables}=load('src/components/talabot/native/domain');
const SummaryCards=load('src/components/talabot/native/b-shell/summary-cards').default;
const noop=()=>{};
const props={rows:tables.orders.filter(o=>!o._hist).slice(0,7),t:k=>dict[k]||k,query:'',onSearch:noop,status:'all',onStatus:noop,filters:{store:'',payment:'',start:'',end:'',sort:''},onFilters:noop,filterError:null,resultCount:7,loading:false,error:'',onRetry:noop,hasMore:false,onMore:noop,onReset:noop,onDetails:noop};
const html=wrap(React.createElement(OrdersPresentation,props));
let checks=0;function test(name,fn){fn();checks++;console.log('PASS '+name)}
test('one order search, inside original filter panel',()=>{assert.equal((html.match(/type="search"/g)||[]).length,1);assert(html.indexOf('type="search"')<html.indexOf('order-quick-filters'));assert(html.includes('tp-order-search flex items-end gap-3'));});
test('four quick shortcuts and all statuses in closed secondary section',()=>{const quick=html.split('data-testid="order-quick-filters"')[1].split('</div>')[0];assert.equal((quick.match(/aria-pressed=/g)||[]).length,4);const secondary=html.match(/<details[^>]*class="tp-secondary-filters[^>]*>[\s\S]*?<\/details>/)[0];assert(!/^<details[^>]*\bopen/.test(secondary));for(const status of ['all','pending','preparing','ready','pickedup','delivered','cancelled','rejected'])assert(secondary.includes(`value="${status}"`),status);assert.equal((html.match(/aria-label="Status"/g)||[]).length,1);});
test('filter panel closes before desktop table and phone cards',()=>{const end=html.indexOf('</section>');assert(end<html.indexOf('data-testid="orders-table"'));assert(html.includes('data-testid="orders-cards"'));assert(html.includes('data-testid="orders-list"'));assert(html.includes('tp-active-filters'));assert(!html.includes('36 orders'));assert(!html.includes('November 9, 2026')); });
test('A list payment, item count, fee and parties retained',()=>{for(const text of ['ord0','Wallet','2 items','delivery 10 TJS','Муаммад','Ресторан'])assert(html.includes(text),text);});
test('invalid dates and empty/error outcomes remain visible',()=>{assert(wrap(React.createElement(OrdersPresentation,{...props,rows:[],filterError:'invalid_range'})).includes('role="alert"'));assert(wrap(React.createElement(OrdersPresentation,{...props,rows:[],error:'unavailable'})).includes('Your filters are preserved'));assert(wrap(React.createElement(OrdersPresentation,{...props,loading:true})).includes('uOqBusy')===false);});
test('SummaryCards remains informational and uses B four-card structure',()=>{const h=wrap(React.createElement(SummaryCards,{cards:[24,12,18,'3,782'].map((value,i)=>({key:String(i),label:'B'+i,value,Icon:icon}))}));assert.equal((h.match(/data-summary-info/g)||[]).length,4);assert(!h.includes('<button'));assert(h.includes('grid grid-cols-2 gap-4 md:gap-6 xl:grid-cols-4'));});
const AppHeader=load('src/components/talabot/native/b-shell/app-header').default;
const {SidebarProvider}=load('src/components/ui/sidebar');
test('header contains no duplicate search or generic search substitute',()=>{const h=wrap(React.createElement(SidebarProvider,null,React.createElement(AppHeader,{controls:null,notifications:null})));assert(!h.includes('<input'));assert(!h.includes('searchPlaceholder'));assert(h.includes('Toggle Sidebar'));});
const {OrdersList}=load('src/components/talabot/orders');
const b=wrap(React.createElement(OrdersList));
test('B and D shared composition hooks render with equal hierarchy',()=>{for(const hook of ['orders-list','tp-order-search','order-quick-filters','tp-secondary-filters','tp-active-filters','orders-table','orders-cards'])assert(b.includes(hook)&&html.includes(hook),hook);const hierarchy=h=>['type="search"','order-quick-filters','tp-secondary-filters','tp-active-filters','orders-table','orders-cards'].map(x=>h.indexOf(x));for(const positions of [hierarchy(b),hierarchy(html)])assert.deepEqual(positions,[...positions].sort((a,b)=>a-b));});
const outputDir=process.env.UX02_SSR_OUTPUT||'docs/ux02/source-conformance';
fs.mkdirSync(outputDir,{recursive:true});
fs.writeFileSync(path.join(outputDir,'rendered-D.html'),html);
fs.writeFileSync(path.join(outputDir,'rendered-B.html'),b);
console.log(`${checks} server-rendered composition checks passed; icons stubbed only for this nonvisual test; no viewport or interaction claim.`);

module.exports={load,wrap,React,storage};

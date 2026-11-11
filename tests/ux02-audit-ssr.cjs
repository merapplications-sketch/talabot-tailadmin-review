process.env.UX02_SSR_OUTPUT='docs/ux02/audit-corrections';
const {load,wrap,React,storage}=require('./ux02-composition-ssr.cjs');
const assert=require('node:assert/strict');
const Entity=load('src/components/talabot/native/entity-sections').default;
const {ThemeProvider}=load('src/context/theme-context');
const Form=load('src/components/talabot/native/native-form').default;
const {tables}=load('src/components/talabot/native/domain');
const dict=require('../src/components/talabot/native/dictionary.json').en;
const t=k=>dict[k]||k;
function render(section,id='',filter='all'){storage.clear();storage.setItem('ux02-native:filter:'+section,filter);return wrap(React.createElement(ThemeProvider,null,React.createElement(Entity,{section,id,query:'',t,navigate(){}})));}
let passed=0;function test(n,f){f();passed++;console.log('PASS '+n)}
test('support/banner/promo columns describe actual fields, not phone/address',()=>{for(const section of ['support','banners','promotions']){const h=render(section),table=h.match(/<table[\s\S]*?<\/table>/)[0];assert(!table.includes('>Phone<'),section);assert(!table.includes('>address<'),section);}assert(render('support').includes('ord1'));assert(render('promotions').includes('10%'));assert(render('banners').includes(t('aBTop')));});
test('rating list retains comment and displays both actual star fields',()=>{const h=render('ratings');assert(h.includes(t('aStoreRate2')));assert(h.includes(t('aCourierRate')));assert(h.includes('★'));assert(h.includes('Comment'));});
test('driver filter has all/on/off, status and inclusive cash warning',()=>{const h=render('drivers');assert(render('drivers','','on').includes(t('fOn')));assert(render('drivers','','off').includes(t('fOff')));assert(h.includes(t('aOfflineL')));assert(h.includes(t('aOver')));assert(h.includes('data-color="warning"')||h.includes('bg-amber-50'));});
test('canonical activation badge is shown on list and detail',()=>{for(const section of ['banners','promotions']){const h=render(section);assert(h.includes(t('aBNow')));const id=section==='banners'?'bn1':'p1';assert(render(section,id).includes(t('aBNow')));}});
test('real image reaches identity markup, missing image uses existing fallback',()=>{const old=tables.stores[0].logo_url;try{tables.stores[0].logo_url='/synthetic-identity.png';assert(render('restaurants').includes('src="/synthetic-identity.png"'));tables.stores[0].logo_url='';assert(render('restaurants').includes('data-fallback="true"'));}finally{tables.stores[0].logo_url=old;}});
test('texts and loyalty show supplied summaries with details closed',()=>{const h=render('texts');assert(h.includes('Talabot is a food'));assert(!h.includes('role="dialog"'));const y=render('loyalty');assert(y.includes(t('yFd')));assert(y.includes('150'));assert(!y.includes('role="dialog"'));});
test('pencil includes Edit and entity; nameless field groups do not create empty cards',()=>{const h=wrap(React.createElement(Form,{title:'Entity',fields:[],initial:{name:'No matching summary field'},t}));assert(h.includes('aria-label="Edit Entity"'));assert(!h.includes('data-slot="card"'));assert(!h.includes('role="dialog"'));});
console.log(`${passed} audit SSR checks passed (plus shared composition checks); no viewport claim`);

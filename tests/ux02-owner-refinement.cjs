const assert = require('node:assert/strict');
const {load, wrap, React, storage} = require('./ux02-composition-ssr.cjs');
const {filterDirectoryRows: filter, emptyDirectoryFilters: defaults, merchantCategories} = load('src/components/talabot/native/directory-filters');
const {activeMerchantBanner} = load('src/components/talabot/native/entity-data');
const {homeRankings} = load('src/components/talabot/native/home/data');
const {snapshotTime} = load('src/components/talabot/native/order-operations');
const {tables} = load('src/components/talabot/native/domain');
const ids = rows => Array.from(rows, r => r.id);
let count = 0;
function test(name, fn) { fn(); count++; console.log('PASS '+name); }
const stores = [{id:'r',name:'Restaurant',category:'rest',is_open:true,is_active:true},{id:'p',name:'Pharmacy',category:'pharmacy',is_open:false,is_active:true},{id:'g',name:'Grocery',category:'grocery',is_open:true,is_active:false}];
test('merchant category, account, availability, name and selection intersect without mutating directory',()=>{
 const original=JSON.stringify(stores);
 assert.deepEqual(ids(filter('restaurants',stores,'pharm','closed',{...defaults,category:'pharmacy',merchant:'p',account:'active'},stores)),['p']);
 assert.deepEqual(ids(filter('restaurants',stores,'','all',{...defaults,account:'disabled'},stores)),['g']);
 assert.equal(JSON.stringify(stores),original);
 assert.equal(merchantCategories.length,8);
});
test('driver phone search, heartbeat presence, approval and paused filters intersect',()=>{
 const drivers=[{id:'x1',name:'Same',phone:'+992123',driver_status:'approved',online:true,last_seen:new Date(snapshotTime-1000).toISOString(),accept_blocked:true},{id:'x2',name:'Same',phone:'+992456',driver_status:'approved',online:true,last_seen:new Date(snapshotTime-120000).toISOString()}];
 assert.deepEqual(ids(filter('drivers',drivers,'123','on',{...defaults,account:'approved',availability:'paused'})),['x1']);
 assert.deepEqual(ids(filter('drivers',drivers,'456','off',defaults)),['x2']);
 assert.equal(filter('drivers',drivers,'123','off',defaults).length,0);
});
test('customer OTP identity searches phone, not email; account and Dushanbe dates apply',()=>{
 const rows=[{id:'c1',name:'One',phone:'123',email:'secret@example.test',created_at:'2026-11-09T19:00:00Z'},{id:'c2',name:'Two',phone:'456',banned_at:'2026-11-09',created_at:'2026-11-10T19:00:00Z'}];
 assert.deepEqual(ids(filter('customers',rows,'123','all',{...defaults,account:'active',start:'2026-11-10',end:'2026-11-10'})),['c1']);
 assert.equal(filter('customers',rows,'secret','all',defaults).length,0);
 assert.deepEqual(ids(filter('customers',rows,'','all',{...defaults,account:'blocked'})),['c2']);
});
test('ratings distinguish store and driver stars and retain merchant/category boundaries',()=>{
 const rows=[{id:'rt1',store_id:'r',driver_stars:5,store_stars:2},{id:'rt2',store_id:'p',driver_stars:2,store_stars:5}];
 assert.deepEqual(ids(filter('ratings',rows,'','all',{...defaults,stars:'2',target:'store',category:'rest'},stores)),['rt1']);
 assert.deepEqual(ids(filter('ratings',rows,'','all',{...defaults,stars:'2',target:'driver'},stores)),['rt2']);
});
test('banner image action resolves a current linked banner, excludes inactive and expired',()=>{
 const rows=[{id:'expired',link_type:'store',link_value:'r',active:true,ends_at:new Date(snapshotTime).toISOString()},{id:'future',link_type:'store',link_value:'r',active:true,starts_at:new Date(snapshotTime+1).toISOString()},{id:'valid',link_type:'store',link_value:'r',active:true}];
 assert.equal(activeMerchantBanner('r',rows,snapshotTime).id,'valid');
 assert.equal(activeMerchantBanner('p',rows,snapshotTime),undefined);
});
test('merchant and category scope applies to both sales and item quantity rankings',()=>{
 const source={...tables,stores,orders:[{id:'o1',store_id:'r',status:'delivered',total:70,created_at:'2026-11-10T10:00:00Z'},{id:'o2',store_id:'p',status:'delivered',total:120,created_at:'2026-11-10T10:00:00Z'}],menu_items:[{id:'i1',store_id:'r'},{id:'i2',store_id:'p'}],order_items:[{order_id:'o1',item_id:'i1',qty:4},{order_id:'o2',item_id:'i2',qty:9}]};
 const scoped=homeRankings('2026-11-10','2026-11-10',source,{category:'pharmacy',merchant:'p',query:'Pharm'});
 assert.equal(scoped.completed,1);assert.equal(scoped.restaurants[0].sales,120);assert.equal(scoped.items[0].quantity,9);assert.equal(scoped.items.length,1);
 assert.equal(homeRankings('2026-11-10','2026-11-10',source,{category:'rest',merchant:'p',query:''}).completed,0);
});
test('merchant directory supports a selected entry beyond 1000 in the existing B combobox',()=>{
 const Picker=load('src/components/talabot/native/b-shell/merchant-picker').default;
 const many=Array.from({length:1201},(_,i)=>({id:'m'+i,name:'Merchant '+i}));
 const html=wrap(React.createElement(Picker,{stores:many,value:'m1200',onChange(){},label:'Select merchant',emptyLabel:'No match'}));
 assert(html.includes('Merchant 1200') && html.includes('role="combobox"'));
});
console.log(count+' owner refinement checks passed; synthetic/local, not server or Safari evidence.');

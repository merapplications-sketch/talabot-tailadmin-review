// Real React SSR route composition; no viewport or pointer claims.
const assert=require('node:assert/strict'),fs=require('node:fs');
const {load,wrap,React,browserLocation}=require('./ux02-composition-ssr.cjs');
const {ThemeProvider}=load('src/context/theme-context');
const Admin=load('src/components/talabot/native').default;
const render=search=>{browserLocation.search=search;return wrap(React.createElement(ThemeProvider,null,React.createElement(Admin)))};
const home=render(''),orders=render('?section=orders'),reports=render('?section=reports');
let n=0;function test(name,fn){fn();n++;console.log('PASS '+name)}
test('default Home contains exactly four A indicators, both rankings and no full Orders list or B analytics',()=>{assert.equal((home.match(/data-summary-info/g)||[]).length,4);for(const token of ['home-attention','home-restaurants','home-items','home-ranking-period'])assert(home.includes(token));assert(!home.includes('data-testid="orders-list"'));assert(!home.includes('data-testid="analytics"'));assert(home.indexOf('data-summary-info')<home.indexOf('home-attention'));});
test('Orders contains full management with search and filters, no Home cards or B analytics',()=>{assert(orders.includes('data-testid="orders-list"'));assert(orders.includes('type="search"'));assert(orders.includes('tp-secondary-filters'));assert(!orders.includes('data-summary-info'));assert(!orders.includes('data-testid="analytics"'));});
test('Reports retains all original B analytics sections and B metrics without duplicating Orders',()=>{for(const token of ['analytics','performance-summary','finance-summary','weekday-orders','monthly-target','b-summary-scope'])assert(reports.includes(token),token);assert(reports.includes('2026-11-09'));assert.equal((reports.match(/data-summary-info/g)||[]).length,4);assert(!reports.includes('data-testid="orders-list"'));});
test('all twelve protected sections remain alongside Home and Reports',()=>{for(const s of ['home','orders','restaurants','drivers','customers','support','texts','ratings','banners','promotions','loyalty','log','staff','reports'])assert(home.includes('section='+s),s)});
test('Home distinguishes completed count, saved totals and units, with explicit demo and snapshot labels',()=>{for(const token of ['Completed orders','Sales · recorded totals (TJS)','Quantity','not live operations','2026-11-10','7 loaded orders · 1 delivered'])assert(home.includes(token),token)});
fs.writeFileSync('docs/ux02/home-orders/rendered-home.html',home);
fs.writeFileSync('docs/ux02/home-orders/rendered-reports.html',reports);
console.log(n+' route composition checks passed; SSR only.');

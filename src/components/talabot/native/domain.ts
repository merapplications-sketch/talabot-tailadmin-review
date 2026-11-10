import fixture from './fixture.json';
export type Row = Record<string, unknown>;
export type Tables = Record<string, Row[]>;
export const tables: Tables = fixture as unknown as Tables;
export const text = (row: Row, key: string) => row[key] == null ? '' : String(row[key]);
export const number = (row: Row, key: string) => Number(row[key] || 0);
export const statuses = ['pending','preparing','ready','pickedup','delivered','rejected','cancelled'];
export function metrics(orders = tables.orders) {
 const latest = orders.filter(o=>!o._hist).slice(0,300), delivered=latest.filter(o=>o.status==='delivered');
 return {orders:latest.length,revenue:delivered.reduce((sum,o)=>sum+number(o,'total'),0),commission:delivered.reduce((sum,o)=>sum+number(o,'commission'),0),active:latest.filter(o=>['pending','preparing','ready','pickedup'].includes(text(o,'status'))).length};
}
export function searchOrders(query:string,status='all',source=tables.orders) {
 const q=query.trim().toLowerCase().replace(/^#/,''), digits=q.replace(/\D/g,'');
 return source.filter(o=>(status==='all'||o.status===status)&&(!q||text(o,'id').toLowerCase()===q||(q.length>=2&&text(o,'customer_name').toLowerCase().includes(q))||(digits.length>=4&&'992900000000'.includes(digits))));
}
export type ReadResult<T> = {data:T;error:null}|{data:null;error:'not_allowed'|'unavailable'};
export async function readOrders(query:string,status:string,mode='normal'):Promise<ReadResult<Row[]>> {
 if(mode==='denied')return {data:null,error:'not_allowed'};
 if(mode==='error')return {data:null,error:'unavailable'};
 return {data:mode==='empty'?[]:searchOrders(query,status),error:null};
}
export function findOrder(id:string) {return tables.orders.find(o=>o.id===id);}
export function finance(order:Row) {
 const delivered=order.status==='delivered',dead=['cancelled','rejected'].includes(text(order,'status')),cash=order.payment==='cash',wallet=order.payment==='wallet';
 return {delivered,dead,cash,wallet,online:!cash&&!wallet,collected:order.cash_collected??null,settled:!!order.cash_settled,walletUsed:number(order,'wallet_used'),walletReturned:order.wallet_returned_at??null,commission:number(order,'commission'),commissionRecognized:delivered};
}
export function parseLocation(message:string) {const match=/^LOC:(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/.exec(message);if(!match)return null;const lat=Number(match[1]),lng=Number(match[2]);return Math.abs(lat)<=90&&Math.abs(lng)<=180?{lat,lng}:null;}
export function listState(search:string) {const p=new URLSearchParams(search);return {section:p.get('section')||'orders',query:p.get('q')||'',status:p.get('status')||'all',id:p.get('id')||''};}
export function previewWrite() {return {data:null,error:{code:'PREVIEW',message:'preview_readonly'}} as const;}

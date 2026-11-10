import {tables,text,number,type Row} from './domain';
/** Clock is fixed to the preserved synthetic snapshot, never presented as live. */
export const snapshotTime=Date.parse('2026-11-10T12:00:00Z');
export function isLive(driver:Row,now=snapshotTime){return driver.driver_status==='approved'&&!!driver.online&&!!driver.last_seen&&now-Date.parse(text(driver,'last_seen'))<120000}
export function isBusy(driver:Row,orders=tables.orders){return orders.some(o=>o.driver_id===driver.id&&['preparing','ready','pickedup'].includes(text(o,'status')))}
export function locationFresh(driver:Row,now=snapshotTime){return driver.lat!=null&&driver.lng!=null&&!!driver.loc_updated&&now-Date.parse(text(driver,'loc_updated'))<180000}
export function distanceKm(a:number,b:number,c:number,d:number){const rad=Math.PI/180,x=Math.sin((c-a)*rad/2)**2+Math.cos(a*rad)*Math.cos(c*rad)*Math.sin((d-b)*rad/2)**2;return 12742*Math.asin(Math.sqrt(x))}
export function assignmentCandidates(order:Row,drivers=tables.profiles,orders=tables.orders,now=snapshotTime){const store=tables.stores.find(s=>s.id===order.store_id)||{};return drivers.filter(d=>isLive(d,now)&&!isBusy(d,orders)).map(driver=>({driver,distance:store.lat!=null&&locationFresh(driver,now)?distanceKm(number(store,'lat'),number(store,'lng'),number(driver,'lat'),number(driver,'lng')):null})).sort((a,b)=>Number(a.distance==null)-Number(b.distance==null)||(a.distance||0)-(b.distance||0))}
export function canAssign(order:Row){return !order.driver_id&&['preparing','ready'].includes(text(order,'status'))}
export function needsReply(ticket:Row){return ['open','in_progress'].includes(text(ticket,'status'))&&(!ticket.last_staff_at||Date.parse(text(ticket,'last_customer_at'))>Date.parse(text(ticket,'last_staff_at')))}
export function lowRating(rating:Row,threshold=3){return !rating.handled_at&&((rating.store_stars!=null&&number(rating,'store_stars')<=threshold)||(rating.driver_stars!=null&&number(rating,'driver_stars')<=threshold))}
export function operationalAlerts(orders=tables.orders,ratings=tables.ratings,tickets=tables.support_tickets,now=snapshotTime){return {unassigned:orders.filter(o=>canAssign(o)&&now-Date.parse(text(o,'created_at'))>90000),ratings:ratings.filter(r=>lowRating(r,2)),tickets:tickets.filter(needsReply)}}
export type AssignmentRequest={method:'admin_assign_driver';args:{p_order:unknown;p_driver:unknown}};
export function assignmentRequest(order:Row,driver:Row):AssignmentRequest{return {method:'admin_assign_driver',args:{p_order:order.id,p_driver:driver.id}}}
export async function assignInPreview(request:AssignmentRequest){return {request,error:'preview_readonly' as const};}

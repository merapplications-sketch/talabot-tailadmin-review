// Client mutation bodies copied from frozen A, with an explicitly offline transport.
// This module contains no legacy DOM/runtime, credentials or server connection.
import {cleanStore,validStore,validBanner,validPromo,normPhone,num} from './contract-validators';
export function createPreviewMutations(onRequest=()=>{}){
 const ALL_PERMS=['orders','support','finance','stores','content'];
 const denied=()=>({data:null,error:{code:'PREVIEW',message:'preview_readonly'}});
 const errKey=error=>error?.message||'generic';
 const done=result=>({error:errKey(result.error),code:result.error?.code});
 const rpc=async(name,args)=>{onRequest({kind:'rpc',name,args});return {error:'preview_readonly',code:'PREVIEW'}};
 const sb={rpc:async(name,args)=>{onRequest({kind:'rpc',name,args});return denied()},from(table){let request={kind:'table',table};const chain={insert(row){request={...request,action:'insert',row};return chain},update(row){request={...request,action:'update',row};return chain},delete(){request={...request,action:'delete'};return chain},eq(key,value){request={...request,filter:{key,value}};return chain},then(ok){onRequest(request);return Promise.resolve(denied()).then(ok)}};return chain}};
 const badStore=()=>Promise.resolve({error:'bad_value'}),badBanner=()=>Promise.resolve({error:'bad_banner'}),badPromo=()=>Promise.resolve({error:'bad_promo'});
 // Success continuations are unreachable with this transport; retained to keep source bodies intact.
 const refresh=async()=>{},toast=()=>{},t=k=>k,extraLoaded={},TLBref={loadPages:refresh,loadTicket:refresh};let sigs={};
 return {
assignDriver: function (orderId, driverId) { return rpc('admin_assign_driver', { p_order: orderId, p_driver: driverId }, true); },
resolveRating: function (orderId, note) { return rpc('resolve_rating', { p_order: orderId, p_note: String(note || '').slice(0, 300) }, true); },
reopenRating: function (orderId) { return rpc('reopen_rating', { p_order: orderId }, true); },
setPage: function (slug, lang, body) {
      var b = String(body == null ? '' : body);
      if (['about', 'privacy'].indexOf(slug) < 0 || ['ru', 'en'].indexOf(lang) < 0 || b.length > 20000) return Promise.resolve({ error: 'bad_value' });
      return rpc('set_page', { p_slug: slug, p_lang: lang, p_body: b }, true).then(function (r) { return r && r.error ? r : TLBref.loadPages(true).then(function () { return { ok: true }; }); });
    },
setCustomerPhone: function (userId, phone, reason) {
      var ph = normPhone(phone), why = String(reason || '').trim();
      if (!ph) return Promise.resolve({ error: 'bad_phone' });
      if (why.length < 3 || why.length > 200) return Promise.resolve({ error: 'note_required' });
      return rpc('admin_set_customer_phone', { p_user: userId, p_phone: ph, p_reason: why }, true).then(function (r) { return r && r.error ? r : { ok: true, phone: ph }; });
    },
setSetting: function (key, value) { return rpc('set_setting', { p_key: key, p_value: +value }, true).then(function (r) { return r && r.error ? r : refresh(['misc']).then(function () { return { ok: true }; }); }); },
ticketStaffReply: function (id, body) {
      var m = String(body || '').trim(); if (!m || m.length > 500) return Promise.resolve({ error: 'bad_value' });
      return sb.rpc('ticket_staff_reply', { p_ticket: id, p_body: m }).then(function (r) {
        if (r.error) { console.error(r.error); return { error: errKey(r.error) }; }
        extraLoaded['t' + id] = 0; return Promise.all([refresh(['misc']), TLBref.loadTicket(id, true)]).then(function () { return { ok: true }; });
      }, function () { return { error: 'generic' }; });
    },
ticketSetStatus: function (id, status, note, refund) {
      var rf = refund === '' || refund == null ? null : num(refund);
      if (['open', 'in_progress', 'resolved', 'rejected'].indexOf(status) < 0 || (rf !== null && (isNaN(rf) || rf < 0))) return Promise.resolve({ error: 'bad_value' });
      if (status === 'rejected' && String(note || '').trim().length < 3) return Promise.resolve({ error: 'note_required' });
      return sb.rpc('ticket_set_status', { p_ticket: id, p_status: status, p_note: String(note || '').slice(0, 300), p_refund: rf }).then(function (r) {
        if (r.error) { console.error(r.error); return { error: errKey(r.error) }; }
        return refresh(['misc']).then(function () { return { ok: true }; });
      }, function () { return { error: 'generic' }; });
    },
setText: function (key, value) { return rpc('set_text_setting', { p_key: key, p_value: String(value || '').slice(0, 60) }, true).then(function (r) { return r && r.error ? r : refresh(['misc']).then(function () { return { ok: true }; }); }); },
decideStoreRequest: function (id, approve, note) {
      if (!approve && String(note || '').trim().length < 3) return Promise.resolve({ error: 'note_required' });
      return sb.rpc('decide_store_request', { p_id: id, p_approve: !!approve, p_note: String(note || '').slice(0, 300) }).then(function (r) {
        if (r.error) { console.error(r.error); return { error: errKey(r.error) }; }
        sigs = {}; return refresh().then(function () { return { ok: true, store: r.data }; });
      }, function () { return { error: 'generic' }; });
    },
setBan: function (id, banned, reason) {
      if (banned && String(reason || '').trim().length < 3) return Promise.resolve({ error: 'note_required' });
      return rpc('set_customer_ban', { p_id: id, p_banned: !!banned, p_reason: String(reason || '').slice(0, 200) }, true);
    },
setStoreEarn: function (storeId, v) { var e = String(v == null ? '' : v).trim() === '' ? null : +v; if (e !== null && (!isFinite(e) || e < 0 || e > 1000 || e !== Math.floor(e))) return Promise.resolve({ error: 'bad_value' }); return rpc('set_store_earn', { p_store: storeId, p_earn: e }, true); },
setStoreFreeDelivery: function (storeId, min) { return rpc('set_store_free_delivery', { p_store: storeId, p_min: +min || 0 }, true); },
setStoreLoyalty: function (storeId, minOrder, cashback) { return rpc('set_store_loyalty', { p_store: storeId, p_min_order: minOrder === '' || minOrder == null ? null : +minOrder, p_cashback: cashback === '' || cashback == null ? null : +cashback }, true); },
saveHH: function (f) {
      var days = (f.days || []).map(Number).filter(function (d) { return d >= 1 && d <= 7; }), pct = Math.floor(+f.pct), title = String(f.title || '').trim();
      if (!title || title.length > 60 || !days.length || !(pct >= 1 && pct <= 90) || !/^\d{2}:\d{2}$/.test(f.start || '') || !/^\d{2}:\d{2}$/.test(f.end || '') || f.start === f.end) return badStore();
      var row = { title: title, store_id: f.store || null, days: days, start_time: f.start, end_time: f.end, discount_pct: pct, active: f.active !== false };
      var q = f.id ? sb.from('happy_hours').update(row).eq('id', f.id) : sb.from('happy_hours').insert(row);
      return q.then(function (r) { return r.error ? done(r) : refresh(['misc']).then(function () { toast(t('saved')); return { ok: true }; }); });
    },
setHHActive: function (id, on) { return sb.from('happy_hours').update({ active: !!on }).eq('id', id).then(function (r) { return r.error ? done(r) : refresh(['misc']).then(function () { return { ok: true }; }); }); },
deleteHH: function (id) { return sb.from('happy_hours').delete().eq('id', id).then(function (r) { return r.error ? done(r) : refresh(['misc']).then(function () { return { ok: true }; }); }); },
walletAdjust: function (userId, amount, note) {
      var a = num(amount), n = String(note || '').trim();
      if (isNaN(a) || a === 0 || Math.abs(a) > 100000 || n.length < 3 || n.length > 200) return Promise.resolve({ error: 'bad_value' });
      return rpc('wallet_adjust', { p_user: userId, p_amount: Math.round(a * 100) / 100, p_note: n }, true);
    },
approveItem: function (id) { return sb.from('menu_items').update({ approved: true }).eq('id', id).then(done); },
addStore: function (f) { var c = cleanStore(f); if (!validStore(c)) return badStore(); return sb.from('stores').insert(c).then(done); },
updateStore: function (id, f) { var c = cleanStore(f); if (!validStore(c)) return badStore(); return sb.from('stores').update(c).eq('id', id).then(done); },
staffSet: function (email, perms, active) {
      email = String(email || '').trim().toLowerCase();
      var ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && email.length <= 120 && Array.isArray(perms) && perms.every(function (x) { return ALL_PERMS.indexOf(x) >= 0; }) && (perms.length > 0 || active === false);
      if (!ok) return Promise.resolve({ error: 'bad_value' });
      return rpc('staff_set', { p_email: email, p_perms: perms, p_active: active !== false }, true);
    },
brandCreate: function (name, ownerEmail) { name = String(name || '').trim(); if (name.length < 2 || name.length > 60) return Promise.resolve({ error: 'bad_value' }); return rpc('brand_create', { p_name: name, p_owner_email: ownerEmail || null }, true); },
brandAttach: function (storeId, brandId, branch) { if (!/^[0-9a-f-]{36}$/i.test(String(brandId))) return Promise.resolve({ error: 'bad_value' }); return rpc('brand_attach', { p_store: storeId, p_brand: brandId, p_branch: String(branch || '').trim().slice(0, 60) }, true); },
brandDetach: function (storeId) { return rpc('brand_detach', { p_store: storeId }, true); },
staffRemove: function (id) { if (!/^[0-9a-f-]{36}$/i.test(String(id))) return Promise.resolve({ error: 'bad_value' }); return rpc('staff_remove', { p_user: id }, true); },
assignOwner: function (id, email) { return rpc('assign_owner', { p_store: id, p_email: email }, true); },
setDriverStatus: function (id, st) { return sb.from('profiles').update({ driver_status: st }).eq('id', id).then(done); },
setDriverBlocked: function (id, v) { return sb.from('profiles').update({ accept_blocked: !!v }).eq('id', id).then(done); },
setDriverLimit: function (id, v) { v = +v; if (!isFinite(v) || v <= 0 || v > 1000000) return badStore(); return sb.from('profiles').update({ cash_limit: v }).eq('id', id).then(done); },
settleCash: function (driverId) {
      return sb.rpc('settle_driver_cash', { p_driver: driverId }).then(function (r) {
        if (r.error) { console.error(r.error); return { error: errKey(r.error) }; }
        toast(t('saved') + ' (' + (+r.data || 0) + ' TJS)'); return refresh().then(function () { return { ok: true }; });
      });
    },
addBanner: function (f) { if (!validBanner(f)) return badBanner(); return sb.from('banners').insert(f).then(done); },
updateBanner: function (id, f) { if (!validBanner(f)) return badBanner(); return sb.from('banners').update(f).eq('id', id).then(done); },
deleteBanner: function (id) { return sb.from('banners').delete().eq('id', id).then(done); },
addPromo: function (f) { if (!validPromo(f)) return badPromo(); return sb.from('promo_codes').insert(f).then(done); },
updatePromo: function (id, f) { if (!validPromo(f)) return badPromo(); return sb.from('promo_codes').update(f).eq('id', id).then(done); },
deletePromo: function (id) { return sb.from('promo_codes').delete().eq('id', id).then(done); }
};
}
export const mutations=createPreviewMutations();

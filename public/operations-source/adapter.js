/* global TLB, tab, D, E, DE, BE, TK, CU, OQ, f, render, esc, t */
(() => {
  const params = new URLSearchParams(location.search);
  const valid = 'osduhgrbcylf';
  const key = 'filters:' + (params.get('tab') || 'o');
  let filters = {};
  try { filters = JSON.parse(sessionStorage.getItem(key) || '{}'); } catch { filters = {}; }
  const en = () => TLB.lang() === 'en';
  window.uxInit = () => {
    const selected = params.get('tab') || 'o';
    if (valid.includes(selected) && tab !== selected) { tab = selected; D = E = DE = BE = null; TK.sel = CU.sel = null; }
    if (tab === 'u' && !CU.loaded) window.cuLoad(true);
    if (tab === 'g') TLB.loadPages(true);
    const q = sessionStorage.getItem('order-query');
    if (q !== null) OQ = q;
  };
  window.uxFilter = rows => {
    let out = rows.filter(o => (!filters.store || o.store === filters.store) && (!filters.payment || o.payment === filters.payment));
    if (filters.start) out = out.filter(o => o.createdAt >= new Date(filters.start + 'T00:00:00+05:00').getTime());
    if (filters.end) out = out.filter(o => o.createdAt < new Date(filters.end + 'T00:00:00+05:00').getTime() + 86400000);
    if (filters.sort) out = [...out].sort((a,b) => filters.sort === 'oldest' ? a.createdAt-b.createdAt : b.createdAt-a.createdAt);
    return out;
  };
  const send = data => parent.postMessage({ source:'ux02-operations', ...data }, location.origin);
  let lastHeight = 0;
  const sync = () => {
    const app = document.getElementById('app');
    if (!app || !window.TLB) return;
    if (tab === 'o' && !D && !document.getElementById('ux-filters')) {
      const el = document.createElement('details'); el.id='ux-filters'; el.className='card';
      const label = en() ? ['Additional preview filters','Merchant','Payment','From','To','Sort','Source order','Newest','Oldest','Clear','Pickup/delivery zone: unavailable in A fixture; see B filter sample.'] : ['Дополнительные фильтры · демо','Заведение','Оплата','С','По','Порядок','Исходный','Новые','Старые','Сброс','Зоны получения/доставки отсутствуют в выборке A; доступны в примере B.'];
      const options = (items,value) => '<option value="">—</option>'+items.map(x=>`<option value="${esc(x)}" ${value===x?'selected':''}>${esc(x)}</option>`).join('');
      el.innerHTML=`<summary>${label[0]}</summary><p class="ux-note">${en()?'Local sample filters; no server requests.':'Локальная выборка; без запросов на сервер.'}</p><div class="ux-filter-grid"><label>${label[1]}<select data-filter="store">${options([...new Set(TLB.orders().map(o=>o.store))],filters.store)}</select></label><label>${label[2]}<select data-filter="payment">${options([...new Set(TLB.orders().map(o=>o.payment))],filters.payment)}</select></label><label>${label[3]}<input type="date" data-filter="start" value="${filters.start||''}"></label><label>${label[4]}<input type="date" data-filter="end" value="${filters.end||''}"></label><label>${label[5]}<select data-filter="sort"><option value="">${label[6]}</option><option value="newest" ${filters.sort==='newest'?'selected':''}>${label[7]}</option><option value="oldest" ${filters.sort==='oldest'?'selected':''}>${label[8]}</option></select></label></div><p role="alert" id="ux-filter-error"></p><p>${label[10]}</p><button type="button" class="b g">${label[9]}</button>`;
      const search=app.querySelector('.osr'); (search||app.querySelector('.chips')||app.lastChild).before(el);
      el.addEventListener('change', event => {
        const field=event.target.dataset.filter;if(!field)return;
        const next={...filters,[field]:event.target.value};
        if(next.start&&next.end&&next.start>next.end){el.querySelector('[role="alert"]').textContent=en()?'Start must not exceed end.':'Начало не может быть позже конца.';return;}
        filters=next;sessionStorage.setItem(key,JSON.stringify(filters));render();
      });
      el.querySelector('button').onclick=()=>{filters={};sessionStorage.removeItem(key);render();};
    }
    sessionStorage.setItem('order-query',OQ);
    // Present existing state and action availability without inventing transitions.
    if(D && !document.getElementById('ux-context')){
      const order=TLB.order(D);if(order){const context=document.createElement('div');context.id='ux-context';context.className='card';context.setAttribute('role','status');context.innerHTML=`<b>${en()?'Operation context':'Контекст операции'}</b><p>#${esc(order.id)} · ${t(order.status)} · ${esc(order.store)}</p><p>${en()?'Next: review parties, items, timeline and available controls below. Financial writes are disabled in this preview.':'Далее: проверьте участников, состав, историю и доступные действия ниже. Финансовая запись отключена.'}</p>`;app.prepend(context);}
    }
    document.querySelectorAll('button').forEach(button=>{if(!button.getAttribute('aria-label')&&!button.textContent.trim())button.setAttribute('aria-label',en()?'Open control':'Открыть');});
    const height=Math.ceil(app.getBoundingClientRect().bottom+32);
    if(height!==lastHeight){lastHeight=height;send({height});}
    send({tab,detail:!!D,status:f,query:OQ});
  };
  let frame=0;
  new MutationObserver(()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(sync);}).observe(document.getElementById('app'),{childList:true,subtree:true});
  new ResizeObserver(()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(sync);}).observe(document.body);
  addEventListener('message',event=>{if(event.origin!==location.origin||event.source!==parent||event.data.source!=='ux02-shell')return;document.documentElement.classList.toggle('dark',event.data.dark);});
  window.addEventListener('pagehide',()=>sessionStorage.setItem('order-query',OQ));
  sync();
})();

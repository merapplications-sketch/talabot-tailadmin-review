// Pure client validators extracted verbatim from frozen A; no DOM, auth or transport.
export function cleanStore(f) { var c = Object.assign({}, f); if (typeof c.phone === 'string') c.phone = c.phone.trim() === '' ? null : (normPhone(c.phone) || c.phone.trim()); return c; }
export function validStore(f) {
    var n = function (k, lo, hi) { if (f[k] == null || f[k] === '') return true; var v = +f[k]; return isFinite(v) && v >= lo && v <= hi; };
    if (!(n('commission_pct', 0, 100) && n('discount_pct', 0, 100) && n('max_discount_pct', 0, 100) && n('fee_base', 0, 100000) && n('fee_per_km', 0, 100000) && n('lat', -90, 90) && n('lng', -180, 180) && n('rating', 0, 5) && n('rating_count', 0, 100000000))) return false;
    if (f.google_place_id != null && f.google_place_id !== '' && !/^[A-Za-z0-9_-]{10,200}$/.test(String(f.google_place_id))) return false;
    if ((f.lat == null) !== (f.lng == null) && ('lat' in f || 'lng' in f)) return false;
    if (f.name != null && (String(f.name).trim().length < 1 || String(f.name).length > 80)) return false;
    if (f.description != null && String(f.description).length > 500) return false;
    if (f.address != null && String(f.address).length > 200) return false;
    if (f.phone != null && f.phone !== '' && !normPhone(f.phone)) return false;
    return true;
  }
export function validBanner(f) {
    if (f.placement != null && f.placement !== 'top' && f.placement !== 'bottom') return false;
    var d = function (v) { return v == null || (typeof v === 'string' && isFinite(Date.parse(v))); };
    if (!d(f.starts_at) || !d(f.ends_at)) return false;
    if (f.starts_at && f.ends_at && Date.parse(f.ends_at) <= Date.parse(f.starts_at)) return false;
    if (f.title != null && (String(f.title).trim().length < 1 || String(f.title).length > 80)) return false;
    return true;
  }
export function validPromo(f) {
    if (f.code != null && !/^[A-Za-z0-9_-]{3,20}$/.test(String(f.code))) return false;
    if (f.kind != null && f.kind !== 'percent' && f.kind !== 'fixed') return false;
    if (f.value != null) { var v = +f.value; if (!isFinite(v) || v <= 0 || (f.kind === 'percent' && v > 100) || v > 100000) return false; }
    if (f.min_order != null && (!isFinite(+f.min_order) || +f.min_order < 0)) return false;
    if (f.max_uses != null && (!isFinite(+f.max_uses) || +f.max_uses < 1 || +f.max_uses > 1000000)) return false;
    var d = function (x) { return x == null || (typeof x === 'string' && isFinite(Date.parse(x))); };
    if (!d(f.starts_at) || !d(f.ends_at)) return false;
    if (f.starts_at && f.ends_at && Date.parse(f.ends_at) <= Date.parse(f.starts_at)) return false;
    return true;
  }
export function normPhone(v) {
    var d = String(v == null ? '' : v).replace(/\D/g, '');
    if (/^992[0-9]{9}$/.test(d)) return '+' + d;
    if (/^[0-9]{9}$/.test(d)) return '+992' + d;
    if (/^0[0-9]{9}$/.test(d)) return '+992' + d.slice(1);
    return null;
  }
export function num(v) { if (v === null || v === undefined || v === '' || typeof v === 'boolean') return NaN; var n = +v; return isFinite(n) ? n : NaN; }
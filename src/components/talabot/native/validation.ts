import {text,number,type Row} from './domain';
import {normPhone,num,validStore,cleanStore,validPromo,validBanner} from './contract-validators';
export const permissions=['orders','support','finance','stores','content'];
export function validateWallet(r:Row){const a=num(r.amount),n=text(r,'note').trim();return isNaN(a)||a===0||Math.abs(a)>100000||n.length<3||n.length>200?'err_bad_value':null}
export function validatePhone(r:Row){return !normPhone(r.phone)?'err_bad_phone':text(r,'reason').trim().length<3||text(r,'reason').trim().length>200?'err_note_required':null}
export function validateStaff(r:Row){return !permissions.some(k=>r[k])?'aStfPick':!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(text(r,'email').trim())?'err_bad_value':null}
export function validateMerchant(r:Row){return !normPhone(r.phone)?'aPhReq':!text(r,'name').trim()?'aFill':number(r,'discount_pct')>number(r,'max_discount_pct')?'err_discount_over_max':!validStore(cleanStore(r))?'err_bad_value':null}
export function datesToContract(r:Row){return {...r,starts_at:r.starts_at?text(r,'starts_at').slice(0,10)+'T00:00:00+05:00':null,ends_at:r.ends_at?text(r,'ends_at').slice(0,10)+'T23:59:59+05:00':null}}
export function validatePromo(r:Row){return validPromo({...datesToContract(r),max_uses:r.max_uses===''?null:r.max_uses})?null:'err_bad_promo'}
export function validateBanner(r:Row){return validBanner(datesToContract(r))?null:'err_bad_banner'}
export function validateHappy(r:Row){const days=String(r.days||'').split(',').map(Number).filter(d=>d>=1&&d<=7),pct=Math.floor(number(r,'discount_pct')),title=text(r,'title').trim();return !title||title.length>60||!days.length||!(pct>=1&&pct<=90)||!/^\d{2}:\d{2}$/.test(text(r,'start_time'))||!/^\d{2}:\d{2}$/.test(text(r,'end_time'))||r.start_time===r.end_time?'yHeNeed':null}

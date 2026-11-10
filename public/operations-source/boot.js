/* Independent preview namespace: never read or write production UI preferences. */
(() => {
  const nativeGet = Storage.prototype.getItem;
  const nativeSet = Storage.prototype.setItem;
  const nativeRemove = Storage.prototype.removeItem;
  const prefix = 'talabot-ux02:';
  Storage.prototype.getItem = function (key) { return nativeGet.call(this, prefix + key); };
  Storage.prototype.setItem = function (key, value) { nativeSet.call(this, prefix + key, value); };
  Storage.prototype.removeItem = function (key) { nativeRemove.call(this, prefix + key); };
  const params = new URLSearchParams(location.search);
  localStorage.setItem('tlb_lang', params.get('lang') === 'en' ? 'en' : 'ru');
  window.uxFilter = rows => rows;
})();

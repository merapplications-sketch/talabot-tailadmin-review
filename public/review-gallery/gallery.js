const form = document.querySelector('#filters');
const viewer = document.querySelector('#viewer');
const picture = document.querySelector('#viewer-image');
let current = 0, visible = [], opener;
function update() {
  let count = 0;
  document.querySelectorAll('.set').forEach(set => {
    set.hidden = ['group','device','theme'].some(key => form.elements[key].value !== 'all' && form.elements[key].value !== set.dataset[key]);
    if (!set.hidden) count += set.querySelectorAll('img').length;
  });
  document.querySelectorAll('[data-section]').forEach(section => section.hidden = ![...section.querySelectorAll('.set')].some(set => !set.hidden));
  document.querySelector('#count').textContent = count + ' صورة';
  const query = new URLSearchParams(location.search);
  for (const key of ['group','device','theme']) {
    if (form.elements[key].value === 'all') query.delete(key);
    else query.set(key, form.elements[key].value);
  }
  history.replaceState(null, '', location.pathname + (query.size ? '?' + query : ''));
}
for (const key of ['group','device','theme']) {
  const value = new URLSearchParams(location.search).get(key);
  if ([...form.elements[key].options].some(option => option.value === value)) form.elements[key].value = value;
}
form.addEventListener('change', update);
form.addEventListener('reset', () => setTimeout(update, 0));
update();
function show(index) {
  current = (index + visible.length) % visible.length;
  const source = visible[current];
  picture.src = source.src; picture.alt = source.alt;
  picture.classList.remove('zoomed');
  document.querySelector('#viewer-caption').textContent = `${current + 1} / ${visible.length} · ${source.closest('figure').querySelector('small').textContent}`;
  document.querySelector('#viewer-original').href = source.src;
  document.querySelector('#viewer-scroll').scrollTo(0, 0);
}
document.querySelectorAll('figure a:has(img)').forEach(link => link.addEventListener('click', event => {
  if (!viewer.showModal || event.metaKey || event.ctrlKey) return;
  event.preventDefault(); opener = link;
  visible = [...document.querySelectorAll('.set:not([hidden]) figure img')];
  show(visible.indexOf(link.querySelector('img'))); viewer.showModal();
}));
document.querySelector('#viewer-close').onclick = () => viewer.close();
document.querySelector('#viewer-prev').onclick = () => show(current - 1);
document.querySelector('#viewer-next').onclick = () => show(current + 1);
document.querySelector('#viewer-zoom').onclick = () => picture.classList.toggle('zoomed');
viewer.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
});
viewer.addEventListener('close', () => opener?.focus());
let dark = matchMedia('(prefers-color-scheme: dark)').matches;
try { const saved = localStorage.getItem('talabot-gallery-theme'); if (saved) dark = saved === 'dark'; } catch {}
document.documentElement.classList.toggle('dark', dark);
document.querySelector('#appearance').onclick = () => {
  const enabled = document.documentElement.classList.toggle('dark');
  try { localStorage.setItem('talabot-gallery-theme', enabled ? 'dark' : 'light'); } catch {}
};

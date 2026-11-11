const assert = require('node:assert/strict');
const { load, wrap, React, storage } = require('./ux02-composition-ssr.cjs');
const EntitySections = load('src/components/talabot/native/entity-sections').default;
const Identity = load('src/components/talabot/native/b-shell/identity').default;
const dict = require('../src/components/talabot/native/dictionary.json').en;
const t = k => dict[k] || k;
for (const section of ['drivers', 'restaurants', 'customers', 'ratings', 'support', 'banners', 'promotions']) {
  storage.clear();
  const html = wrap(React.createElement(EntitySections, { section, query: '', id: '', t, navigate() {} }));
  assert.equal((html.match(/type="search"/g) || []).length, 1, section);
  assert(html.includes('data-slot="input-group"'), section);
  // Filters belong to the dialog, not permanent tall rows above the results.
  assert(!html.includes('role="combobox"'), section);
  if (['drivers', 'restaurants', 'ratings', 'support'].includes(section)) {
    assert(html.includes('aria-haspopup="dialog"'), section);
    assert(html.includes('aria-expanded="false"'), section);
  }
}
for (const presence of [true, false, undefined]) {
  const html = wrap(React.createElement(Identity, { name: 'Driver', person: true, presence, presenceLabel: presence ? 'Online' : 'Offline' }));
  assert.equal(html.includes('data-slot="avatar-badge"'), presence !== undefined);
  if (presence !== undefined) assert(html.includes(`data-variant="${presence ? 'online' : 'offline'}"`));
  assert(!html.includes('>Online<') && !html.includes('>Offline<'));
}
console.log('PASS 7 list search compositions, closed page filters, known presence states and absent presence; SSR only, not a mobile visual test.');

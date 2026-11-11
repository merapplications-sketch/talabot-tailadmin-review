const assert = require('node:assert/strict');
const { load, wrap, React } = require('./ux02-composition-ssr.cjs');
const { identityCues } = load('src/components/talabot/native/entity-data');
const Identity = load('src/components/talabot/native/b-shell/identity').default;
const now = Date.parse('2026-11-10T12:00:00Z');
const store = { id: 's-test', is_open: true, is_active: true };
const banner = { id: 'b-test', link_type: 'store', link_value: 's-test', active: true };
for (const [name, change, expected] of [
  ['linked active', {}, true],
  ['inactive', { active: false }, false],
  ['different store', { link_value: 'another' }, false],
  ['unlinked', { link_type: 'none' }, false],
  ['future', { starts_at: '2026-11-11T00:00:00Z' }, false],
  ['expired boundary', { ends_at: '2026-11-10T12:00:00Z' }, false],
  ['current period', { starts_at: '2026-11-09T00:00:00Z', ends_at: '2026-11-11T00:00:00Z' }, true],
]) assert.equal(identityCues('restaurants', store, [{ ...banner, ...change }], now).promoted, expected, name);
assert.equal(identityCues('restaurants', store, [], now).closed, false);
assert.equal(identityCues('restaurants', { ...store, is_open: false }, [], now).closed, true);
assert.equal(identityCues('restaurants', { ...store, is_active: false }, [], now).closed, true);
assert.equal(identityCues('restaurants', { id: 'unknown' }, [], now).closed, false);
assert.equal(identityCues('customers', { id: 'c' }, [], now).closed, false);
assert.equal(identityCues('customers', { id: 'c', banned_at: '2026-11-09' }, [], now).closed, true);
assert.equal(identityCues('drivers', { id: 'd', online: false }, [], now).closed, false);
const html = wrap(React.createElement(Identity, { name: 'Closed merchant', src: '/saved-avatar.png', closed: true, closedLabel: 'Closed', promoted: true, promotedLabel: 'Active banner' }));
assert(html.includes('grayscale') && html.includes('>Closed<') && html.includes('ring-green-500'));
assert(html.includes('/saved-avatar.png'));
console.log('PASS banner link/schedule (7), closure states (7), saved-image grayscale/overlay/outline. Read-only source contracts unchanged.');

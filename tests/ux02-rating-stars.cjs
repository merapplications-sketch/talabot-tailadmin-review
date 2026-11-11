// Check the five visible positions against saved individual scores, not averages.
const assert = require('node:assert/strict');
const { load, wrap, React } = require('./ux02-composition-ssr.cjs');
const RatingStars = load('src/components/talabot/native/b-shell/rating-stars').default;
for (let score = 0; score <= 5; score++) {
  const html = wrap(React.createElement(RatingStars, { value: score }));
  assert.equal((html.match(/<svg\b/g) || []).length, 5);
  assert.equal((html.match(/text-yellow-500/g) || []).length, score);
  assert.equal((html.match(/text-gray-300/g) || []).length, 5 - score);
  assert(html.includes(`aria-label="${score} / 5"`));
}
for (const value of [null, undefined, '', 'invalid']) {
  const html = wrap(React.createElement(RatingStars, { value }));
  assert(!html.includes('<svg'));
  assert(html.includes('—'));
}
console.log('PASS five stars for each saved integer score 0–5; missing scores remain missing. Icons stubbed: nonvisual SSR evidence.');

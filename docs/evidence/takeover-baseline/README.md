# Takeover independent verification — 2026-11-09

Baseline recovered HEAD: 07a6c041f3d3b12878d43df6d094a627c3e6a08a. Product files were not modified by this verification task. New operations-review and gallery changes proceeded concurrently and are outside the initial baseline assertions.

- `npm run build:vinext`: PASS (build-vinext.log).
- `tsc --noEmit` on fresh clone, before generated Next/vinext artifacts: PASS (empty typecheck.log; exit 0).
- Default `npm run build`: blocked by Turbopack external node_modules symlink restriction (build-next.log).
- `next build --webpack`: compiled, then generated types collision: Next validator imports routes.js named exports while vinext's routes.d.ts has a different shape (build-next-webpack.log). Independent clean-generated run PASSED (`build-next-clean.log`); stopping Vite and separating generated artifacts resolves the verification collision.
- `npm run lint`: baseline FAIL. Excluding generated output/vendor maplibre and allowing CommonJS test imports is legitimate scope configuration; no source hook rules suppressed. Existing product errors are synchronous effect setState in visual-review/index.tsx:57, theme-context.tsx:33 and :57, use-mobile.ts:16.
- Six data suites PASS (data-suites.log): date validation, auth form schemas (not backend auth), pluralization EN/RU/TG, order totals/filtering, directory references, historical analytics.
- Full existing isolated visual-review suite PASS: 52 checks + 32 comparison screenshots. Matrix includes EN/RU/TG, phone/landscape/desktop, image failures, input geometry, filtering/details/back restoration, notification focus/resize. JSON evidence copied alongside. Screenshots were generated separately under qa/visual-review, never overwrite original gallery evidence.
- Existing pages-focused suite PASS: merchant filters, customer list scroll restoration, contextual order return, saved locale, notification read/detail/all navigation, light/dark captures.

Browser: Chromium 134 headless; these are not real Safari/iPhone results. No backend or authorization assurance follows from these UI tests.

Runtime notes: default Vite inspector discovery fails uv_interface_addresses in this sandbox. External temporary config sets inspectorPort:false. Explicit IPv4 host and browser tests launched in the same exec session work; separate tool executions cannot reach the session's localhost. No project runtime config was changed for this workaround.

## Test maintenance

The all-suite run exposed two obsolete expectations, corrected without changing product behavior:
- `talabot-orders.cjs`: singular result is `1 order`, already approved by the existing pluralization tests.
- `talabot-design.cjs`: summary cards, mobile navigation and sidebar now open implemented pages. Tests now assert each destination and selected mobile state, then restore Home; obsolete placeholder-dialog expectations removed.

`tests/full-regression.cjs` runs all 20 existing suites with bounded per-suite execution and individual logs; it continues after failures so coverage is visible. It requires an explicit synthetic BASE_URL.
- Three legacy window/Safari-named scripts referenced old accessible names `Toggle notifications` / `Close notifications`. Current translations and component expose `Notifications` / `Close`; newer clipping tests already used them. Exact selectors updated, all geometry/visibility/date assertions retained. These scripts still run Chromium, despite historical filenames.

## Final all-suite result

All 20 existing admin suites PASS after correcting obsolete test expectations and rerunning only failed suites. Original run: 15 pass, 5 stale-test failures. Full evidence: `full-regression/initial-results.json`, per-suite logs, `rerun/`, `final-results.json`. Window suite final: 9 checks, zero errors. Initial and rerun outcomes remain separate. New gallery/operations suites are separate task evidence, not counted in these 20.

The window test also now identifies the header dropdown trigger specifically (desktop sidebar has the same accessible label), and asserts the implemented View All Notifications destination `/notifications` instead of old `/`. All touch-scroll/geometry/focus/rotation checks retained.

A preliminary full run against Next start encountered redirect loops at initial navigation; all browser suites then ran against the actual vinext target and passed. This is not evidence of Next server runtime parity. Deployment target remains vinext/Workers.

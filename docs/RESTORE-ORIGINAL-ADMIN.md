# TALABOT Admin — original entry restoration

D-03 is paused. Operations Review is rejected as a replacement for the admin application. This correction awaits owner visual approval.

## Finding and visual reference

The original dashboard was never overwritten. The previous handoff incorrectly promoted `/operations-review` as the application entry. All 463 original `src/` files plus the logo selected from 828a0d2006e2e39d5777b9b0969c244081ce0773 match the corresponding blobs in ed5e33af0f4f1d9b5d4a54c25444a2e8b5916395, 07a6c041f3d3b12878d43df6d094a627c3e6a08a and local 86236b6e850836bef91812bed59765a53763fcb3. GitHub takeover 9767295cde095ef9f899e1acc0063eabb5eff729 has the same source tree as local 86236b6e850836bef91812bed59765a53763fcb3.

The independent check uses the actually published original root https://talabot-tailadmin-review.yaarobalwari.workers.dev/ — not an assumption that the oldest commit is final. Its 390×844 EN/light screenshot is pixel-identical to the corrected root. Cloudflare deployment metadata does not establish the source commit; visual match and file match are separate evidence.

## Correction

- Main review entry: https://talabot-admin-takeover-review.alwarikahtan.chatgpt.site/
- Previously delivered `/operations-review` redirects to the original locale-aware root; stale experimental query is discarded.
- Prototypes remain at `/review/operations`, with their language switching and internal review links updated.
- Original sidebar, header, cards, layout, pages, mobile navigation, business behavior, translations and logo remain byte-identical.
- `/visual-review` and all 43 original evidence images remain available; no model is generalized.
- Comparison: `/restoration-review/index.html`. Three unmodified screenshots: rejected entry, corrected root, original published reference. Screenshots are newly captured Chromium 134 evidence, not physical iPhone Safari verification.

## Boundaries

No changes to main, the original Cloudflare Worker, production, operational data, server contracts, permissions, financial rules or shared application contracts. No git reset or blanket revert. All actions use synthetic fixtures. Sites publication updates only the previously isolated review site. Original sources and prototypes are retained.

## Evidence

`docs/evidence/restoration/source-identity.json` records every compared file and blob. `screenshots.json` records capture provenance and SHA256. `tests/restoration-entry.cjs` checks locale-aware recovery and separation. Full regression and build/lint/typecheck results are recorded alongside them.

## Build and environment checks

- Deployment build `npm run build:vinext`: PASS (built in isolated Site checkout from corrected application source). Initial attempt there lacked node_modules; reused existing installed dependencies, then build passed. No dependency versions changed.
- `tsc -p tsconfig.source.json --noEmit`: PASS.
- Full `npm run lint`: FAIL with the same 4 pre-existing errors and 10 warnings (effect-state rules in theme context, mobile hook and existing visual-review image fallback).
- Changed route, operations component and focused tests ESLint: PASS.
- WebKit launch blocked by missing host libraries (GStreamer, GTK4 and others). Chromium touch emulation is not Safari certification. Physical iPhone review remains required.

## Full regression result

20/20 suites pass in aggregate. Initial full run: 18 passed and two calendar/Safari-named Chromium scripts timed out because their local bypass recognizes `http://localhost` but the runner supplied `http://127.0.0.1`, selecting an external proxy. Both passed unchanged with localhost. Initial logs and final aggregate remain separate. New entry recovery checks also passed EN/RU/TG. No failed assertion was removed. The legacy Safari-named tests run Chromium with mobile emulation and do not establish Safari compatibility.

## Published verification

Isolated Site version 2, source a5beb108cbcf9916c60fe3d902486c18f1d1edf8, deployment appgdep_6af21abde3d48191bb0bca638bd33346 succeeded. Public root and legacy entry redirect verified in Chrome UI without sign-in. Published EN/RU/TG recovery tests pass. The published 390×844 root also matches the original Cloudflare reference pixel for pixel. Public comparison resolves to https://talabot-admin-takeover-review.alwarikahtan.chatgpt.site/restoration-review/. Site source differs from final repository only in hosting metadata and later verification artifacts, not application behavior.

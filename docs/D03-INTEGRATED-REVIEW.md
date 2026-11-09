# TALABOT Admin — D-03 Revised, integrated review

Owner authorization: isolated integrated preview only. No main or production publication. The restored preview and original Cloudflare worker must remain unchanged. Visual acceptance remains pending.

## Sources and retrieval limit

- Repository baseline on GitHub: 28176ba43661335ef2ebbaa0e209940f29905325, tree-identical local dedb14599058aca4225dc8ea24a79e62d1e4a5b6.
- Visual models: ed5e33af0f4f1d9b5d4a54c25444a2e8b5916395.
- Exact old owner prompt could not be retrieved: first Personal Context call errored; second reported insufficient original text. The task's explicit conditions plus the model source and `docs/visual-review.md` are used. Do not claim full original-prompt verification. Unseen requirements remain for owner reconciliation.
- No prior Home B/customer-app or Smile Up styling is imported.

## Integrated changes

| Files | Change |
|---|---|
| `src/app/[locale]/(admin)/layout.tsx` | Adds isolated shared style scope; original layout/navigation tree retained. |
| `src/components/talabot/integrated-review/polish.css` | Model typography, neutral light/dark palette, #F36831, semantic states, 16px cards, 12px controls, 48px fields, 44px touch targets; shorter summary cards and header spacing. |
| `src/components/talabot/integrated-review/identity.tsx` | Reusable 48/80px merchant/person images with stable square/circle crop, missing/error initials, pre-hydration failure handling and translated demo-image provenance. |
| `src/components/talabot/orders.tsx` | Quick statuses, compact expandable filters, compact cards, merchant/driver images, icons and semantic status colors. Existing queries, sort, pagination, detail links and scroll restoration retained. |
| `src/components/talabot/workspace.tsx` | Directory images, unified entity headers and notification event cards/read marker/order-updated label; existing table/mobile-card split and interactions retained. |
| `src/components/talabot/analytics.tsx`, existing bar/line charts and three ecommerce chart components; four AI glyph icons | Neutral chart grid/secondary colors and orange series; legacy navy glyph colors become neutral. Calculations, labels, series and icon paths unchanged. |
| `src/components/talabot/visual-review/index.tsx` | Fixes existing image lifecycle lint error and deterministic numeric Tajik dates. Original models and styles remain available. |
| `src/context/theme-context.tsx`, `src/hooks/use-mobile.ts` | Replace effect-driven derived state with browser subscriptions; preserve storage keys, legacy fallback, automatic OS theme and 1280px breakpoint. Necessary to resolve existing lint errors; separately regression-tested. |
| `src/app/[locale]/review/image-cases/page.tsx` | Isolated test fixture for long names, absent/failed/wide images; not a replacement admin page. |
| `tests/d03-integrated.cjs` and two order suites | New visual/interaction matrix and existing filter tests adapted to open the newly collapsed controls; no checks removed. |
| `public/d03-comparison/`, `docs/evidence/d03/` | Real-page paired captures and test evidence. |

## Boundaries and differences from the standalone models

- Original home, sidebar, bottom navigation, route destinations and card order are retained. No Operations Review landing page.
- Original ten-order pagination is retained (standalone model used six). Complete order details remain separate original pages.
- Header bell remains the original implementation; standalone review bell/dialog is not transplanted.
- Original tables remain on desktop, cards on phones. No conversion of the full application into isolated model markup.
- Date/time, totals and data definitions unchanged. Tajik order date rendering uses stable numeric day/month because server and Chromium ICU returned different month names; translations and Dushanbe timezone retained.
- Same existing local demo photos as the model. They do not claim to depict fictional entities. No upload/storage feature, remote image host, dependency or lockfile change.
- Existing four visual models and original 43 images are preserved. No new financial, permission or backend contracts.
- Tajik human translation review and physical Safari acceptance remain pending.

## Test environment

The managed Sites preview launcher failed (`next: not found` with its injected arguments). Existing repository regression scripts use the established isolated vinext test server and installed dependencies. This is separate from managed preview UI verification; final public Site verification will be performed after publication.

Initial layout review runs were stopped to correct excessive filter height and duplicated padding. A subsequent matrix exposed Tajik date hydration mismatch (server `Nov`, client `M11`); its log is retained. Final tests must run against the corrected source, with the complete existing 20-suite regression and the added D-03 matrix. Historical Safari-named scripts use Chromium; they are not actual Safari evidence.

Final palette audit found hard-coded template blue/navy in the legacy bar/line charts, ecommerce chart decorations and four glyph icons. Values only were corrected; final 20-suite regression is rerun in full with the expanded 180-case matrix including both chart routes.

Final generated-type check initially encountered stale `.next/types`; `next typegen` regenerated the route declarations and TypeScript then passed. No source contract changed. The sequential final regression process stopped after 14 passing suites without a terminal result; it is preserved as interrupted evidence, not acceptance. The entire same suite list was restarted with three independent browser workers (`tests/d03-full-regression.cjs`) alongside the 180-case matrix.

## Review URLs and hosting isolation

- Integrated review: https://talabot-admin-d03-integrated-review.alwarikahtan.chatgpt.site/
- Preserved original: https://talabot-admin-takeover-review.alwarikahtan.chatgpt.site/
- Real-page paired screenshots (36 images): https://talabot-admin-d03-integrated-review.alwarikahtan.chatgpt.site/d03-comparison/
- Existing models: https://talabot-tailadmin-review.yaarobalwari.workers.dev/visual-review
- Dedicated Site project: appgprj_6af2206e948881919d784d63ff3b9b04, source d559d7c44629799c19e1107ed3a7b2a7a1612a8d, version 3. Original Site and Cloudflare Worker were not redeployed. Application source parity is recorded separately from later evidence-only additions.

## Acceptance boundary

Owner visual approval is still required before any generalization. Physical iPhone Safari is unproven; local WebKit cannot launch because runtime libraries are missing. Chromium emulation is not Safari. Exact historical owner prompt remains unavailable; only current explicit instructions and versioned visual model documentation have been verified. No backend, security or real financial functionality is certified by these UI tests.

## Final results

- vinext production build: PASS.
- TypeScript: PASS after generated route type refresh.
- ESLint: PASS, 0 errors / 10 warnings; runner lint also PASS.
- Full Regression: 20/20 suites PASS in a complete final run.
- D-03: 180/180 route/locale/theme/viewport cases PASS; 0 browser exceptions; image contrast/crop/missing/failed/wide cases, search/filter/detail/back and OS/manual theme persistence PASS.
- Protected source inputs: 11/11 unchanged; dependency lock, demo data, original navigation, bell and logo retained.
- Dedicated Site deployment succeeded: appgdep_6af22c7274fc81919c1ceab8a20a40fe.

- Anonymous deployed smoke: 7/7 routes HTTP 200, no page exceptions. Cloud browser visually verified original root dashboard/sidebar, marked deliverable. Public deployment does not require ChatGPT login.

# UX-02 final delta — isolated candidate v2

Status: READY FOR OWNER VISUAL REVIEW, then independent delta QA. No final color approval, merge, production publication, policy or permission change.

Baseline remote HEAD checked: b331c489996b91706bd4567bb0ed01e3fc336c84.
Previous executable: 12ca480e4b1078d5fa1c2e7faadd86e3b274cefc.
Branch: review/ux02-v01-v05-candidate-20261112.
Isolated URL: https://talabot-ux02-v01-v05-review.alwarikahtan.chatgpt.site/
Access: PRIVATE. Anonymous browser shows “Log in to access”; no login performed. Existing audience preserved. This is not a public anonymous link.

## Results
| Finding | Delta and evidence |
|---|---|
| V01 | Existing B table, identities, status badge and detail button recomposed into six bounded columns. Status, total and timestamps grouped under Order; customer/merchant/route/driver retained. No font-size reduction. Full customer, merchant and driver names remain in details and title text. Existing compact mobile cards unchanged. |
| V02 | Add store only uses B brand-700 background / brand-800 hover in both themes, matching the existing notification mark-read trial. Notification links remain brand-700 Light / brand-400 Dark. White text contrast improves 3.07:1 → 5.00:1. No shared button, logo, base orange or stylesheet changes. Trial awaits owner approval. |
| V03 | Bell close button uses existing B icon-lg: 32×32 → 44×44px. Header 56px, shrink-0, same aria-label Close and handler. Click closes menu; aria-expanded false verified. |
| V04 | ACCEPTED, untouched. order-details.tsx byte-identical to prior candidate. Date tests deliberately not rerun. |
| V05 | Actual EN/RU/TG table headers captured for notifications and couriers. Distinct headings in each table; no data/read-permission changes. Source translations unchanged. |

## DOM measurements
Chrome viewport 1363×936, EN, same seven saved sample orders, sidebar open:
- Before: table 1228.08px in 1008px container, scrollWidth 1228; detail right edge 1527.08px (offscreen).
- After: table/container/scrollWidth all 1008px; detail right edge 1298.48px (onscreen).
- Before row heights: 116.5–133px. After: 168.5–169px. This deliberately trades some previous density for visible essential information/actions; remains below original ~305px rows.
- No horizontal scrolling needed in measured desktop viewport. Below xl the existing card presentation contains an inline detail action. Narrow viewport behavior was source-reviewed only, not browser-certified.
- Full names visible after opening ord0; dialog Back returns to orders. No data mutation performed.

## Verification
- Native build PASS (existing >500kB chunk warning).
- TypeScript --noEmit PASS.
- Affected UI checks: table geometry / details / Back, bell close and 44px target, Add store computed colors, notification link colors and 44px height, actual translated headers.
- 320 / 390 / 1440: NOT TESTED — supported browser offered no viewport resizing capability. Actual Safari/iPhone: NOT TESTED.
- No rerun of accepted format tests or unrelated 37-function tests. No claim of all 37 functions tested. Their implementation/contracts unchanged by this delta.

## Evidence correction
All final-delta evidence is newly captured against preserved before source and final candidate. Filename theme is backed by DOM theme/background checks and separate post-action captures.
- orders-after-dark.jpg is the actual dark Orders table.
- notifications-before-light.jpg was recaptured from the preserved previous source in confirmed Light.
- notifications-after-light.jpg was recaptured from the final source in confirmed Light.
- Old v1 evidence is retained historically, not treated as proof of the final candidate.
- Same-data/viewport store-before/after-light/dark.jpg document V02; notifications before/after Light/Dark document consistency. EN notification screenshot is notifications-after-light.jpg; driver EN and both RU/TG pairs are separately named.
- before.json / after.json contain DOM observations. Browser screenshot files are unedited JPEGs.

## Three implementation files
- src/components/talabot/native/b-shell/list-patterns.tsx
- src/components/talabot/native/entity-sections.tsx
- src/layout/header/notification-dropdown/index.tsx

## Resume
Owner reviews candidate v2 and brand-700 experiment. Then independent delta QA on V01/V02/V03/V05 evidence only. V04 stays closed. No FP16, no main merge, no operational Admin or customer-app change.

# UX-02 — compact owner review delivery

Date: 2026-11-11. Status: published isolated preview, awaiting owner visual acceptance.

## Preview and exact source

- [Independent HTTPS preview](https://talabot-ux02-compact-review.alwarikahtan.chatgpt.site/)
- [Verified Stores page](https://talabot-ux02-compact-review.alwarikahtan.chatgpt.site/?section=restaurants)
- Repository: merapplications-sketch/talabot-tailadmin-review
- Branch: review/ux02-mobile-consistency-20261111
- Executable source: **0323787a6daea766455d84bf02652c6f12c3174c**
- Source tree: 47ccc83b91f3b8e1f2b1c8c05a71dd575fc233cd
- Site: appgprj_6af4855ec6f0819181650887dfd786b0
- Version: **1**, appgprj_6af4855ec6f0819181650887dfd786b0~appgver_d60e8e02a4a881919dadc746f5ef4a3b
- Deployment: appgdep_6af4861aca448191ba1291bec6c9d915, succeeded.
- Artifact commit: e93741eb59d129619ce59c98c56b198b4d2babdd
- Archive SHA-256: 96b19bf416a2dfd444d015830fe96b8a2c67b2620402b714855daa59b5569325

The published SOURCE.json was opened and matched the executable source above. The rendered page loaded assets/index-KKh3yd72.js, matching the build. The new public synthetic preview opened directly in the available browser without ChatGPT sign-in. Actual Safari sign-in behavior remains NOT TESTED. No old preview, production, main, or application permission was changed.

## Changes in this delivery

1. Compact mobile order/entity cards show essentials; complete records open in B detail windows. Long settings summaries show two fields and open their full content on click. Information remains accessible, including pickup/delivery addresses and all saved settings.
2. Small uniform orange Back arrow sits beside page/dialog titles. It returns to the originating page, preserving list search/filter/scroll context. Closing record details restores the list. Direct links have a list/Home fallback.
3. Active linked merchant banner gets a green square photo outline, using the existing banner activation and date rules. Closed merchant/customer photos are grayscale with a localized Closed overlay, using existing record states only.
4. Actual saved driver avatar is used when supplied. Green/red online/offline indicator sits on its edge, without a separate visible status word. Missing sample avatars retain initials; no stock portrait was substituted.
5. Shared search uses the same B input group and orange in-field filter action wherever applicable. Detail arrows are orange, calls green and edit pencils light purple, never blue.
6. Removed technical React-migration paragraphs and repetitive development footers. Brief sample-data identification and relevant calculation context remain, so fictional analytics are not presented as live figures.

Home, Orders and Reports remain separate. Existing charts, invoice, orange order journey, filters, assignment and edit actions remain. Customer email was already removed from the primary presentation in the preceding saved baseline; registration/backend contracts are unchanged.

## Verification and honest limits

| Check | Result |
| --- | --- |
| TypeScript / native Vite build | PASS; existing chunk-size/config warnings |
| List journeys | 15 PASS, including two new navigation regressions that failed before the fix |
| Existing SSR composition | 7 PASS |
| Invoice, call translation, saved-wallet / collected-cash distinctions | PASS |
| Shared search / applicable filters / presence states | PASS |
| Banner linkage and schedule | 7 cases PASS |
| Closed and unknown identity states | 7 cases PASS |
| Saved image, grayscale, overlay, square outline attributes | PASS |
| Actual browser viewport | Chromium 1363 × 936 only |
| 320 / 390 / 1440 | **NOT TESTED** |
| Actual iPhone Safari | **NOT TESTED** |
| Actual driver photo upload roundtrip | **NOT TESTED** |
| Hosted financial writes / live backend operations | **NOT TESTED** |

The browser explicitly blocked DevTools/device mode. No alternate protocol or permissions were used to bypass that restriction. Owner iPhone screenshots are before/reference evidence, not an after-test. No mobile screenshot or mobile PASS is claimed.

Observed browser journeys: Orders search → detail → Close preserves q=ord0; invoice expands with 120 − 10 + 10 + 5 = 125 TJS; Reports driver metric → Couriers → Back returns to Reports; merchant detail → nested edit → scroll to final Close/Save → top X → parent → Back to list; Loyalty summary → full details → Close. Published Stores details were opened and closed after deployment as well.

Outfit: computed family on the published main content is `Outfit, sans-serif`; existing local assets `outfit-f37fa50e-BMnJGVZj.woff2` and `outfit-c8e7a734-D6ftewdU.woff2` remain bundled. No font-source replacement.

## Before / after evidence

All screenshots below are real captures at **1363 × 936**, not mobile emulation.

First Loyalty card: **262 px → 146 px**, a **44.3%** height reduction, same 1010 px card width. Before is the protected prior public source 260e400c9ef3973592a62ecbad8fc6ac40906916; after is the current executable source. This is a desktop settings-card measurement, not U08 acceptance or a mobile order-card measurement.

| Evidence | Capture |
| --- | --- |
| Loyalty before | [Before](evidence/desktop-loyalty-before.png) |
| Loyalty after | [After](evidence/desktop-loyalty-after.png) |
| All saved Loyalty values in detail window | [Details](evidence/desktop-loyalty-details.png) |
| Driver presence and compact Back | [Couriers](evidence/desktop-drivers.png) |
| Nested edit window, final actions reachable | [Dialog end](evidence/desktop-edit-dialog-end.png) |
| Published banner / closed identity cues | [Published Stores](evidence/published-store-cues.png) |
| Published detail window | [Published details](evidence/published-detail-modal.png) |

## Function matrix and continuation

The existing 37-function evidence classification is carried forward, not upgraded to 37/37. This round changes presentation and navigation. FP07/FP09/FP27, financial rules, merchant publication policy, pharmacy guards, roles and logo are unchanged. No FP16.

Resume from source 0323787a6daea766455d84bf02652c6f12c3174c and this delivery report; do not rebuild an old baseline. Next step: owner review of this new URL on actual iPhone Safari, especially compact cards, detail scrolling/closing and return context. No merge or production publication is authorized by this delivery.

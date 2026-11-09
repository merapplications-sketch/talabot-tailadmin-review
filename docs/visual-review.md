# TALABOT — isolated visual review models

Base: `828a0d2006e2e39d5777b9b0969c244081ce0773`.
Route: `/visual-review` (also `/ru/visual-review`, `/tg/visual-review`).
Scope: review-only page outside the existing admin layout. No existing page, fixture, dependency, lockfile, account, permission, operational integration, chart or business rule changed.

## Models

- Orders: existing `filterOrders` and 36-order fixtures; search, quick states, all seven source states in More filters, period/custom dates, merchant/driver/pickup/delivery filters, removable chips, original sort/plural translations, six-card pagination. Details link to existing complete pages. Browser Back restores review query and stored scroll. Existing original detail-page Back continues to its original list.
- Identity: merchant/person cards and 80px detail-header models. Linked sample-order counts/areas are derived from existing fixtures, not registered addresses or live availability. Long-name, missing-image and deliberately invalid-image examples are separate display fixtures.
- Notifications: existing manually selected notice fixtures, translated existing event heading, merchant/order, actual order status and *order updated* time (not an invented notification creation time). Existing session-local read state reused. Detail links go to existing pages. Review bell has non-shrinking header/footer and a min-height:0 scroll region, focus trap, Escape and focus return. Existing production bell component untouched.
- Indicators: unchanged four summary values; existing November 1–9 historical calculations and incomplete expenses. Profit unavailable, delay explicitly overlapping, remaining orders have no invented detailed state. No new chart.
- Bottom navigation and menu link to the existing destinations, in their original order. Review mobile bottom navigation is hidden during input focus and dialogs; safe-area bottom space reserved. Existing application's navigation and keyboard fixes untouched.

## Shared visual values

| Token | Value |
|---|---|
| Brand | #F36831 |
| Light background / surface / text | #F7F7F7 / #FFFFFF / #262626 |
| Dark background / surface / text | #171717 / #222222 / #F5F5F5 |
| Secondary light / dark | #666666 / #B5B5B5 |
| Border light / dark | #E5E5E5 / #404040 |
| Spacing | 4, 8, 12, 16, 24, 32 px |
| Inputs / buttons | 48px / minimum 44px |
| Body / secondary | 16px / 14px; existing Outfit font |
| H1 / H2 / H3 | 28/22/18px; mobile 24/20/18px |
| Card padding / radius | 16px / 16px |
| Control radius | 12px |
| Shadow | 0 2px 8px #00000006 |
| Identity images | 48×48 list; 80×80 detail header |
| Icons | Existing line icons, 1.5 stroke; 20px, 16px status |

Status text + existing appropriate icon always retained. Delivered green; cancelled/rejected red; pending amber; preparing light orange; other states neutral. No blue/navy UI colors in review styles. Original logo's original colors remain unchanged.

## Asset provenance

All assets pre-existed at base commit:
- `public/images/logo/talabot-original.png`: original approved TALABOT file, unchanged, object-fit:contain. Neutral white backing in dark mode for legibility; no recoloring.
- `public/images/cards/card-01.png`: TailAdmin sample interior photo, square crop. Used only as explicitly labeled demo imagery, not a claim about a real merchant.
- `public/images/user/user-01.jpg`: TailAdmin sample portrait, circular crop, likewise demo imagery only.
- No external image URL, asset download, generated person, upload feature or storage change.
- Missing and failed images retain dimensions and show initials. The failure case uses an intentionally malformed data URL, not an external request. Both an error listener and a completed-image check handle failure before/after hydration.

## Validation and limits

Local Chromium 134.0.6998.35:
- 48 combinations (en/ru/tg × 320×640, 390×844, 932×320, 1440×1000 × four models) reached completion in the first matrix run after fixing pre-hydration image fallback. A subsequent test harness step failed because it retained Tajik while looking for English button text. Harness now explicitly requests English; no application locale behavior changed.
- Focused continuation passed: DEMO-1104 + Delivered -> one order; existing detail opens; browser Back restores query and selected state.
- Four notification resize checks: 390×844, 932×320, 320×480, 1440×1000. Scroll reaches last notice, its descendants do not overlap footer, header/footer stay inside viewport, Escape closes and focus returns. Numerical evidence in `docs/evidence/visual-review/local-results.json`.
- 32 viewport screenshots: four models × phone390×844 / desktop1440×1000 × light/dark × before/after. Same underlying fixtures. Before images are unchanged original routes; after images are isolated models. These are Chromium, not Safari.
- No runtime console errors or failed HTTP requests in focused continuation and screenshots.
- Source-only TypeScript check and local `npm run build:vinext` passed. Whole-project generated `.next/types` TypeScript issue remains OPEN; generated files not edited.
- Human Tajik review and deferred owner Safari notification checks remain OPEN. Review model checks do not close older bell/Safari issues or calendar issues.

Visual approval is required before any generalization to existing pages. No existing flows were globally restyled.

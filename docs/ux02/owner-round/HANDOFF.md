# Owner corrections round — 2026-11-11

Baseline canonical source: 197fa24ab0f65a901d26008910a3c3f6e8d9a522.
Baseline evidence/parent: 700b9e460df8069a8658f32d93aa41cadbc62b19.
New branch: review/ux02-owner-round-20261111.
New isolated Site: appgprj_6af45e7e838881918e250b99c5dab9e1.

## Changes
- Home retains four A cards, existing rankings and intervention alerts. Adds six B icon shortcuts and existing B performance, finance, driver coverage and operational quality sections with original period/data/formulas and demo labels.
- Reports retains full original analytics. Orders remains separate, no full table on Home.
- Original B cards/tokens: clearer gaps, header boundary, card shadow and brand accents.
- Orders: search + icon buttons in compact row. Original quick statuses and secondary controls inside B Dialog; active chips remain visible. Invalid date alert remains visible even after closing. Semantic side borders and row shading. Ghost chevron keeps 44px touch control.
- Details: recorded timeline always visible, orange line/nodes. Missing events explicitly stated, no fabricated stages. Invoice separates saved labels/values and emphasizes total. Green inline tel icons, inline map icon; original targets retained.
- EN/RU/TG new copy translated. No new packages or stylesheets.

## Evidence and limits
- Chromium actual viewport 1363x936. Home/chart rendering, filter dialog, delivered filter, ord4 search, details and Back preserving both query and status verified through browser.
- Filtered ord4 row top393 bottom637 height244, complete within viewport. Not a claim of a matched before/after measurement; old y973.6/899.6 belong to previous revisions.
- Body computed font Outfit, sans-serif. Original bundled WOFF2 remains in build; no font changes.
- ord4 saved amounts observed: items440, promo25, customerdelivery0, restaurantdelivery22, base10, extra12, tip0,total415, commission44. Calculation/domain files unchanged.
- Screenshots: /workspace/shared/owner-round/{home,orders,details}.png. Details screenshot precedes removal of redundant quantity from item name; quantity remains beside unit price.
- 320/390/1440, Safari/iPhone, dark-mode visual, reduced motion, physical touch, tel/maps external execution: NOT TESTED. Browser has no supported viewport-changing capability; no bypass attempted.
- Search/filter return browser verified; nonzero scroll restoration remains covered by existing navigation test, not newly exercised in browser.
- All data synthetic. No operational writes or production claims.

## Protected scope / matrix37
No domain, navigation, permissions, mutation contracts, analytics-data or ranking calculations changed. FP07/FP09 affected presentation + existing return contracts checked; FP27 unchanged. Previous matrix37 evidence levels retained (4 verified on sample,32 partial,1 not complete); this round is not full37 certification. FP16 not started. Merchant/pharmacy publication rules unchanged.
Old v11 and Home/Orders Sites, A/B/C/D2, production and main untouched.

Resume: owner visual review of NEW isolated Site only; do not merge. Mobile/Safari acceptance remains open.

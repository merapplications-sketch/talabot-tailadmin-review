# UX-02 owner refinement — 11 November 2026

Status: isolated preview version 1 published and observed. Source 02f9815be9970172b71d509688a286c3c914da02. Visual acceptance remains with the owner.
Branch: review/ux02-owner-refinement-20261111.
Canonical starting HEAD: 3f6fd4a6b322e267c3bba6c7a6730079119b20ba; previous executable source: 0323787a6daea766455d84bf02652c6f12c3174c.
Previous compact preview version 1 is protected and unchanged. The former local checkout was unavailable; recovery was from canonical GitHub files, not unpushed historical work.

## Exact changes

- Merchant banner border follows the image's own rounded edges at inset 0. A current linked active banner is resolved using existing link_type/link_value, activation and schedule logic. Clicking the image opens that banner's details, including its supplied image; absent image data is stated rather than fabricated.
- Closed merchant/customer grayscale and Closed image overlay retained. The separate merchant open/closed badge beside Active is removed. Account Active/Disabled remains distinct from open/closed; account rules are unchanged.
- Driver presence now uses a circular red/green border on the actual saved avatar or existing initials, replacing the dot. Unknown presence is not fabricated. Current saved fixture has no driver photo; uploaded-photo roundtrip is not tested.
- All edit pencils and map/detail icons use existing TALABOT orange; calls remain green. Rating stars use yellow. Add store is a primary orange B button.
- Home's four A metrics now navigate to Orders or Reports. Reports' four B metrics remain at the top of Reports and navigate to their existing sections. Existing compact Back, route/search/filter/scroll restoration and page separation remain.
- Mobile order cards show ID, state, merchant, timestamp, total and payment summary. Parties, addresses, items, fees and actions remain in the full detail window. Order journey duration is a separate line below the timestamp. Invoice, orange journey, assignment and protected actions remain accessible.
- Shared B search input and its orange in-field filter remain. Input and group both use 48px height; search focus no longer draws the oversized orange outline.
- Merchant filters: category, searchable merchant, account state, open/closed, current banner and sort. Driver filters: name/phone, current connection, approval state, free/busy/paused and cash-limit warning. Customer filters: phone/name, account state, registration dates and sort. Ratings filters: follow-up state, category, merchant, rated party, stars and dates. Existing states/rules are reused, with Dushanbe date boundaries.
- Ranking filters apply merchant/category/name and the existing period to completed orders. All eight existing categories are offered. Sales still sum saved delivered-order totals; completed count is separate; item ranking still sums saved item quantity. This is not cash receipt, restaurant net revenue or settlement. Original B analytics formulas and sample datasets are unchanged.
- Add banner opens the actual form immediately. Searchable B combobox is the first field, with the full loaded merchant directory searched and at most 50 matches rendered. Store details open the same form with that merchant preselected.
- Store details include Add promo code, opening the existing form immediately. Existing promo contract is PLATFORM-WIDE and has no merchant restriction. A clear scope notice is shown; no merchant-specific financial rule was invented.
- Location on the map groups address/coordinates and existing actions; map icon is orange. Delivery tariffs remains the existing delivery-pricing configuration: base distance, distance step, price per step, maximum distance and road factor. No tariff calculation was changed.

Only existing B primitives/compositions were used. No new stylesheet, dependencies, logo, permissions, live transport, restaurant item preapproval, pharmacy-policy change or FP16 work.

## Verification

- TypeScript source noEmit: PASS.
- Native Vite build: PASS, 835 modules; existing chunk-size/config-loader warnings remain.
- New owner refinement cases: 7 PASS (filters, phone/OTP identity, ratings targets, banner schedule/linkage, ranking scope, selected merchant beyond 1000 entries).
- List journeys: 15 PASS, including exact route/query/filter/scroll restoration and cross-section Back.
- Shared SSR composition: 7 PASS; audit SSR: 7 PASS; shared-search/identity checks PASS.
- Existing native operations: 17 PASS; home saved-data calculations: 7 PASS; banner linkage: 7 PASS; closure/unknown states: 7 PASS; invoice/contact/translation and saved-wallet versus received-cash assertions PASS. These are local/synthetic checks, not hosted operational certification.
- Browser: Chromium 1363x936 only. Observed Home Orders/Revenue links and all four Reports links with Back, store image -> linked banner -> Close, store -> Add banner preselected -> searchable choice -> X -> store details, store -> immediate global promo form -> X -> store details, order search ord0 -> details -> Close preserving q=ord0, merchant category selection, driver phone/filter/reset and presence border, customer/rating filter fields and yellow stars.
- Border measured at 48x48, matching parent image at zero x/y offset and 12px rounded merchant corners. Driver border is circular red on current offline sample. Search input and container measured 48px, focus outline style none.
- Browser automation sometimes returned before Select state settled and unhighlighted semantic clicks did not select reliably. This was not established as an application pointer defect. Category selection was verified by keyboard; merchant search-result selection was subsequently verified by click with selected ID s3. No B primitive was changed to accommodate automation. Actual touch/Safari remains NOT TESTED. Final hosted verification is recorded in DELIVERY.md.
- 320 / 390 / 1440 / real iPhone Safari: NOT TESTED. Available browser has no supported viewport emulation; previous DevTools restriction was not bypassed. Owner iPhone screenshots are BEFORE/reference evidence only.
- No actual financial writes or operational backend tests. Missing driver-photo/banner-image sample data was not replaced with stock imagery.
- Original local Outfit WOFF2 files retained; browser computed Outfit, sans-serif. No font replacement.

## Function matrix and stop point

The prior 37-function evidence classification is carried forward without claiming 37/37. Presentation/navigation changed around orders, merchant/driver/customer/rating directories, banners and promo entry. Existing financial/permission contracts and FP07/FP09/FP27 remain unchanged. References: ../mobile-consistency/HANDOFF.md and ../source-conformance/coverage-37.md.

Resume from this branch and DELIVERY.md after deployment. Next step is owner visual approval on actual iPhone Safari, with any remaining issue tied to a screenshot and the published version. No main merge, old-preview update, production publication or FP16 is authorized.

## Latest focused correction handoff — v2

The five subsequent owner corrections are saved at `64e4f1178c341ab475a46245b8537993cb3cf4e3` and deployed as isolated refined-review version 2. Read [FOCUSED-FIXES.md](FOCUSED-FIXES.md) and [DELIVERY-FOCUSED.md](DELIVERY-FOCUSED.md) for the exact source scope, verified behavior, screenshots and test limitations. Earlier sections above describe the earlier round and do not override this resume point. Await owner visual review; real Safari and 320/390/1440 remain NOT TESTED.

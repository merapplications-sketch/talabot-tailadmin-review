# UX-02 compact cards and return navigation

Date: 2026-11-11. Branch: review/ux02-mobile-consistency-20261111.
Verified canonical starting HEAD: 32c7e96b7b907d71bcfbefbe6654980026e54c17.
Previous published source 260e400c9ef3973592a62ecbad8fc6ac40906916 remains unchanged.

## Owner decision implemented
The owner clarified compact static cards showing essential information, with full details opening in a window. This replaces the earlier unanswered accordion/card interpretation. Detail glyphs remain orange, calls green, edit light purple (not blue). Home / Orders / Reports remain separate.

- Mobile order cards retain ID, semantic state, merchant, time, driver/customer, total and payment; full addresses/items/fees stay in the detail window. Added explicit saved pickup-address row there so compacting does not remove its only access.
- Entity cards use the same compact B grid; long names are limited to two lines on cards and remain complete in the dialog. Long settings summaries show two values with full read-only details on click; original edit actions remain separate.
- Record details use B Dialog and ScrollArea with visible compact back/close controls. Original route IDs/deep links, assignment, invoice, orange journey, protected actions and edit forms remain accessible. Nested edit dialogs retain their existing draft and write protections.
- Green square outline uses a banner linked by link_type=store and link_value=store.id, with the existing active/schedule status. No inference from having an image alone.
- Closed store: is_open=false OR is_active=false. Closed customer: existing banned_at account state. Image is grayscale with localized Closed overlay. Unknown state is not inferred. These are read-only cues; no lifecycle rule changed.
- Driver actual avatar_url is retained; online/offline is only a green/red B badge at the photo edge (accessible name retained). Missing sample photos use existing initials; actual driver-upload roundtrip NOT TESTED.
- Compact back arrow appears inline after navigation; history now tracks section/detail transitions, while search updates replace their entry. Cross-section transitions do not leak queries. Return restores the original route and saved list scroll. Deep links fall back to the correct list/Home.
- Previous checkpoint: unified input-group search with orange filter within the field and existing applicable filter dialogs; removed React migration text and repetitive technical footers. One short demo indicator and relevant data methodology remain; synthetic numbers are not represented as live.

## Validation performed
- TypeScript noEmit: PASS. Native Vite build: PASS (770 modules). Existing chunk-size/config warnings remain.
- 15 list journey tests PASS, including the two new regressions: Reports -> drivers -> Back and multi-section back without query leakage. Both new cases failed before the navigation fix.
- Existing 7 SSR composition checks PASS; invoice/call/missing translation/wallet saved amount/cash collected assertions PASS.
- Shared search composition for 7 entity lists / existing applicable closed filters / presence states PASS.
- New identity tests: 7 banner linkage/schedule cases, 7 closure/unknown cases and saved-photo visual attributes PASS.
- Actual Chromium viewport: 1363 x 936. Observed order dialog open/close preserving q=ord0; expanded invoice retains 120 - 10 + 10 + 5 = 125 TJS and pickup/delivery information. Observed Reports metric -> drivers -> Back to Reports. Observed restaurant detail, nested edit dialog scroll to final Close/Save, top X close returning to parent, parent Back returning to list. Observed compact Loyalty -> full read-only details -> Close.
- 320 / 390 / 1440 / real Safari: NOT TESTED. Browser explicitly blocked DevTools/device mode; no alternate protocol, permissions, or browser used to bypass this restriction.
- Desktop density comparison only: first Loyalty card 262px -> 146px (44.3% reduction), same 1363x936 viewport and 1010px card width. This is not a mobile card-height measurement or acceptance of U08.
- Outfit computed family is Outfit, sans-serif; bundled original local WOFF2 assets remain. No new font source.

## Function matrix impact
No business function removed or newly declared operational. Affected presentation/navigation: orders/details/assignment access, driver/store/customer lists and profiles, ratings/support linked details, notifications, settings summaries and return flow. Existing 37-function evidence classification is carried forward; this round is not a new 37/37 operational certification. Financial mutations and hosted backend behavior were not exercised. FP07/FP09/FP27 source contracts and existing guards are unchanged. No FP16, pharmacy/publishing-policy, permissions, logo or analytics formula/dataset changes.

## Publication and resume
NEW candidate Site: appgprj_6af4855ec6f0819181650887dfd786b0.
Expected URL (not proof of deployment): https://talabot-ux02-compact-review.alwarikahtan.chatgpt.site
Artifact checkout: /workspace/sites/talabot-ux02-compact-review.
Only this new synthetic preview is public, per the owner's previously authorized direct Safari link without ChatGPT sign-in. Old previews and production unchanged.
Final source SHA, actual deployed version and screenshot index will be recorded in DELIVERY.md after successful publication.
Stop: owner visual review on iPhone Safari. Do not merge main, change old previews or begin FP16. Any remaining mobile differences must be tied to the owner's real-device evidence; do not claim restored old unpushed files.

# TALABOT remaining admin pages — synthetic preview

## Scope and source
Base: 496b19524a0c28618d430cf7d85bc78346029a3a, review/cloudflare-vinext.
Review Worker only: talabot-tailadmin-review. No production data, operational calls, permissions changes, dependencies or lockfile changes.

## Implemented
- Restaurants/stores, drivers and customers: URL search/area filters, merchant type filter, name sorting, eight items per page, desktop tables, mobile cards, empty/unknown-ID recovery, independent details and linked order histories with search/status/pagination.
- Entity identities and associations derive from the existing 36-order fixture. Missing phone/address/live availability is explicitly unavailable, not invented. Detail order links return to their originating entity.
- Finance/reports: today/seven-day/month/custom date ranges anchored to the existing 2026-11-09 sample; daily paginated lists and independent daily detail with historical merchant breakdowns. Merchant sales, platform revenue and incomplete recorded expenses are separate. Profit remains unavailable. Delay is an overlapping flag; residual status is not inferred.
- Historical analytics remains the original separate fixture, clearly labelled; it is not presented as the totals of the 36 interactive orders.
- Notifications: searchable paginated list, read/unread filter, independent details, linked orders, mark-read in session storage; bell and footer navigate to these pages. Fictional examples are not operational escalation rules. Original scroll viewport clipping/header/footer structure preserved.
- Settings: existing EN/RU/TG locale preference and light/dark/system theme; operational settings explicitly unavailable. No new preference semantics.
- Sidebar and bottom navigation route to implemented pages and show the active section. Attention examples now link to valid existing demo orders.
- Fixed an affected navigation interaction: a focused field losing focus could reinsert the bottom bar between pointer-down and click, covering a detail link. Defer that transition until the pointer interaction completes.

## Verification and limitations
- Fixture associations: passed.
- Browser journeys: directory search/empty/detail/order/back, query and page preservation; finance/report detail and invalid date range; notification local read filtering; theme persistence passed.
- 117 Chromium route/locale/viewport checks: 13 routes, EN/RU/TG, 320x640, 932x320 and 1440x1000. No horizontal overflow, unresolved workspace translation keys or captured runtime/HTTP errors.
- Additional focused tests cover area/type/sort, return scroll, language cookie, bell detail/full-list navigation and notification clipping regression. See evidence JSON for final results.
- Production vinext build and changed-source ESLint passed. Source-only TypeScript passed. Full tsc still encounters pre-existing generated .next validator type references; generated files were not edited.
- Screenshots and automated phone checks are Chromium, not real Safari. Owner's earlier sort-arrow and English singular count acceptance remains closed only for the supplied views. Notification Safari acceptance and new-page owner tests are deferred; Tajik linguistic review remains open.

## Deferred owner batch (real iPhone Safari)
1. Open the top-left menu. Choose Restaurants & stores; search, open View details, open a linked order, then Back and Back to list. Confirm filter/page/browsing position remain. Repeat one Driver or Customer sample.
2. Open Finance from the bottom bar and Reports from the sidebar. Choose Date > Custom, select a valid range, open a daily detail and return. Figures are synthetic; profit must stay unavailable.
3. Open the top-right application menu (…) then the bell (Notifications). Rotate to landscape, scroll to the final notification. Confirm its complete text is reachable without overlapping View All Notifications and Close remains usable. Close, reopen and select View All Notifications.
4. Open one notification, choose Mark as read and return; verify the Read filter. In Settings, change Language and Appearance and refresh. Return to portrait and check the bottom bar does not cover final controls.

No repeated successful order search/count/save journeys requested. No real transactions, assignments, cancellations, refunds, contacts or tracking implemented.

Final focused result: filters, scroll restoration (Chromium within 3px), language persistence, bell navigation passed. Notification regression passed five rotation/short-height cases, last item fully visible, overlap negative-control detected, zero captured page errors. This is not closure of real iPhone Safari notification testing.

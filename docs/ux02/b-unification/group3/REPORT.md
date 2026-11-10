# UX-02 — B lists, filters, metrics and operation details

Status: PARTIAL IMPLEMENTATION, not accepted or published.
Parent remote checkpoint bf93ecfe8b44b2a91de568466b9d73273fb173cf.

## Actual reuse
- A metrics: original ecommerce MetricCard with original B Box/Dollar/PieChart/MovingBox icons. Same A metrics function and scope; B metrics remain separate.
- Order and entity lists: B Table/Header/Body/Row/Cell with class strings copied from TableOne/TableOneRow. Existing row content and handlers retained; no separate navigation.
- All remaining native raw search/date/number inputs and ticket textarea: B Input/Textarea. Filters, scenario, language/theme: B Select/Trigger/Value/Content/Item with value-label items.
- Pair now composes B Field/FieldTitle/FieldContent. Manual button/input CSS strings removed.
- Status: existing B integrated-review/OrderStatusBadge imported without changing its source or semantic colors.
- Order Timeline/Chat: B Accordion, closed by default; original content remains on explicit open. Timeline list pattern from B orders.tsx, orange border uses existing brand token per explicit owner decision. No invented stage or duration.
- Location action now uses original MapIcon. Wallet has explicit text and B Button because B has no matching wallet icon; no hand-drawn substitute. Original manual-icon file retained as reference but no longer imported by native UI.

## Observed interaction checks
Shared Chromium1363px only, synthetic data:
- All12 navigation links render their section without app-load fatal screen (sections.json). This is navigation smoke, not12 complete journeys.
- A four metrics 7/415/44/4 render above orders; one root, one nav, zero iframe, no document overflow; five B chart canvases rendered.
- Search ord1 → details → Back retains ord1.
- Delivered filter returns ord4; All restores status scope.
- Read failure displays error/Retry and retains ord1; Normal restores ord1.
- ord1 + Wallet filter returns zero details; All + empty query restores7 rows.
- Timeline and Chat closed on detail entry; explicit open exposes five events, unchanged durations and two messages. Orange border computed rgb(243,104,49).
- Language selects EN/RU/TG change document lang. TG operations still use disclosed RU fallback. Not full translation acceptance.
- Light observed on initial load, Dark changes root dark class, Auto selectable. Not full9-combination theme/language acceptance.
- Direct fresh-tab load succeeds. home.png and analytics.png are actual1363px screenshots, not phone evidence.

## Contract clarification
Original A admin.html cuWal at line548 directly calls walletAdjust without confirm. Current native correction matches that absence; a new financial confirmation policy must not be silently invented. The owner requires clear sensitive actions; retaining this gap is not financial acceptance.

## Remaining gaps
320/390/1440 and physical Safari NOT TESTED. Shared browser has no viewport resize capability; prior headless launch failed OS socket restriction. Header theme label can appear cramped at1363; no arbitrary width/placement change introduced.
Maps/place selection, image upload/preview, B notifications/settings and full37/124/179/50 parity remain incomplete. A vector map or FileInput alone does not implement these operations.
The new tables preserve content but final density/responsiveness needs owner review and size checks. Some reference-based detail/link layouts remain, and generic next-action wording is not full Transcom task context.
All prior reference sources, analytics data/code, original methods, contracts and permission definitions remain unchanged.

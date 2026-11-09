# TALABOT Orders preview

Owner-approved independent synthetic preview. Routes: `/orders` and `/orders/DEMO-1100` (also `/ru`, `/tg`). No database, operational calls, financial actions or new dependencies.

## Status evidence
Source read only: `merapplications-sketch/Talabat-v3` at `148cfae50000e983af2221a96057c507edac6d69`.
- `talabat-core.js` lines 14–18: EN/RU status labels.
- `talabat-core.js` line 225: active vocabulary.
- `sql/test_patch34.sql` line 36: enum includes pending, preparing, ready, pickedup, delivered, rejected, cancelled.
This is source vocabulary evidence, not verification of the live backend or its current permissions. No business transition logic is introduced.

## Sample boundaries
36 deterministic synthetic orders, DEMO-1100–1135, November 1–9 2026, Dushanbe UTC+5. Separate interaction fixture, explicitly not a reconstruction of the home totals or 48 unclassified orders. Amounts in integer hundredths of TJS. Item subtotal + illustrative delivery − illustrative discount = order total. No platform revenue, profit or settlement inference. Payment/preparation/assignment times and notes not supplied are shown as not provided, never invented. Timeline contains only the authored entries and explicitly notes gaps, not an assumed required workflow. EN/RU supported; TG requires language review.

## UI and state
Desktop table, responsive phone cards, independent detail route. Ten orders per page. Search matches order ID/customer/merchant; filter period/status/merchant/driver/pickup/delivery, newest/oldest sort. URL parameters preserve list state across detail links/reload. Session storage records return scroll only; details remain reloadable without a prior list visit. Unknown IDs show a recovery link. Native disclosure expands amounts; clipboard failure explains manual copying. No edit/assignment/cancel/refund/contact buttons.

## Preserved
Home statistics source, fixture, layout, logo and palette, calendar/date/window/notification fixes and lockfile unchanged. Only existing Orders entry routing/selected navigation state changed. Previous unconfirmed Safari notification acceptance remains open.

## Verification
`tests/talabot-orders-data.cjs`: source vocabulary, cent totals, dates, search and sorting.
`tests/talabot-orders.cjs`: search, status/custom period, pagination state, clipboard, detail return scroll, 20 viewport/theme/route combinations, EN/RU/TG, browser runtime/network/write request capture, screenshots.
`tests/talabot-orders-filters.cjs`: combined filters, pagination controls, browser back/forward/reload, unknown ID and home route integration.
Desktop/browser screenshots are Chromium. Phone sizes simulate touch/viewport; they are not real Safari acceptance.

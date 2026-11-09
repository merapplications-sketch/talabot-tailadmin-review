# Orders preview implementation plan

Goal: Implement the owner-approved desktop table, phone cards and standalone order detail using synthetic data only.
Architecture: Local deterministic fixtures, URL list state, session scroll restoration; existing next-intl routes and TailAdmin styles. No backend or dependencies.
Spec: Owner-approved list/detail proposal and implementation instruction in this conversation.

- [x] Add isolated order fixtures and source-backed enum. Source: merapplications-sketch/Talabat-v3 at 148cfae50000e983af2221a96057c507edac6d69, talabat-core.js lines 14–18 and 225; sql/test_patch34.sql line 36. This proves vocabulary, not live deployment or permissions. Do not copy business rules.
- [x] Implement /orders with search, date/status/merchant/driver/pickup/delivery filters, chronological sorting, 10-row pagination; preserve URL parameters and scroll.
- [x] Implement /orders/[id] with separate customer, merchant, items/amounts, route, driver, recorded event sections; copy ID and expand amounts only.
- [x] Translate EN/RU/TG and route existing Orders entry points; do not change home statistics or financial access.
- [x] Test filtering, empty results, invalid dates/ID/query, pagination, back/scroll, totals, copying, direct loads, responsive light/dark and locale rendering. Check no operational requests.
- [ ] Build, save review branch, deploy only review Worker, verify deployed affected journeys and capture evidence.

Review focus: long Russian labels; 320px width; repeated back/forward; invalid route/query; local fixture totals do not pretend to reconcile to aggregate home statistics.

Deployment verification and final acceptance evidence are recorded in the separate delivery package. Real Safari remains owner verification.

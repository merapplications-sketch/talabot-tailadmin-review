# Sources and ranking definitions

This isolated preview has **no live operational data connection**. No backend accounting, publication, approval or permission rule was changed.

| Display | Source and scope | Calculation / ordering |
|---|---|---|
| Four A indicators | `native/domain.ts::metrics`; saved `native/fixture.json`, first 300 nonhistorical rows, all statuses | Unchanged: count; sum of saved `total` and `commission` only for delivered orders; active statuses pending/preparing/ready/pickedup. Not controlled by Home ranking period. |
| Orders needing intervention | Unchanged `order-operations.ts::operationalAlerts`, fixed snapshot `2026-11-10T12:00:00Z` | Preparing/ready without courier, created over 90 seconds before snapshot. Total count; at most five details/assignment rows in Home. Existing ticket/rating/cash alerts and guards retained. |
| Best-selling restaurants | `home/data.ts::homeRankings`; same latest-loaded nonhistorical scope; only delivered orders created in selected Dushanbe (UTC+5) date range; store category `rest` | Group by `store_id` (individual establishment, no brand/branch consolidation). Completed order count separate from `sum(order.total)` in TJS. Rank by saved total descending, then completed count descending, then ID. Top five displayed. Unknown totals remain `—` and sort after known totals. No inferred net revenue or settlement. |
| Most ordered items | Same delivered-order/date scope joined to saved `order_items`; stable `item_id` and matching store/catalog identity required | Sum positive finite `qty`, group by `(store_id,item_id)`, descending quantity, then store/item ID for ties. First selected recorded order-item name; catalog name only as fallback, never current catalog price. Top five, across stores. Invalid identities/quantities are omitted and counted visibly. |
| Home period | Original B period UI (`AnalyticsPeriod`) reused | Today / last 7 days / month refer to native sample snapshot 10 Nov 2026, not wall-clock date. Custom period is confined to 1–10 Nov, current sample month; inclusive local dates. Period affects rankings only. |
| Full B Reports | Original `analytics-data.ts`, unchanged bytes | Original independent synthetic snapshot 9 Nov 2026; original period limits, previous-period comparisons, chart/ranking choices, expenses/quality/coverage/target definitions. Not joined to A or presented as live. |

Default Home sample result: 7 loaded current orders; 1 delivered; restaurant s1 count 1 and saved totals 415 TJS; item `(s1,i1)` quantity 2. This tiny sample does not establish real business rankings. Historical orders remain available in the original customer-history flow and are not silently added to A's current-order scope.

No full Orders table on Home. `?section=orders` owns the unchanged list/detail components. `?section=reports` owns full B analytics and B's four synthetic summary values. Root / `?section=home` owns Home. The twelve original operational sections remain.

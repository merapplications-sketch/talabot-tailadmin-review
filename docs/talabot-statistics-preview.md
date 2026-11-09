# TALABOT statistics design preview — 2026-11-09

Scope: independent review only. Preserves the approved logo, #F36831 brand, summary cards, Needs attention, mobile navigation and earlier calendar/notification fixes. No dependencies/lockfile, authentication, operational rules, data services or real records changed.

## Data contract
- Fixed synthetic snapshot: 9 November 2026, date/hour keys already in Asia/Dushanbe. Fixture horizon September–November allows equal-length preceding periods. Default November 1–9. Today November 9; last seven days November 3–9. Custom range validation rejects reversed dates and unavailable comparison windows.
- All counts/merchant sales/platform revenue derive from one fictional order collection. Money stored as integer minor units. Merchant sales and platform revenue are independently supplied fixture fields, not an invented commission rule.
- Performance and merchant rankings use completed orders. Region, flow, peak and quality totals explicitly use all orders.
- Weekday value = order count / calendar occurrences of that weekday in selected period, including zero-order dates. Absent weekday = no observation. Hourly chart shows totals, not averages, for selected weekday or all days. Bar clicks and keyboard-accessible weekday buttons select the same state.
- Monthly target is an explicitly labeled November 2026 example: 2,400 completed orders. Its progress is independent of the period filter; no real target is set.
- Expenses are partial fictional records. Profit is null/unavailable; no missing expenses treated as zero.
- Zones are explicitly fictional North/South/East/West, not official Dushanbe boundaries. Pickup→delivery pairs are displayed; driver allocation is not inferred from customer addresses.
- Driver availability is mean of four independent snapshots per day per pickup zone, never a sum of drivers across time. Waiting times are arithmetic means for non-cancelled observations. Delay flags and cancellation reasons are fixture observations, not new policy thresholds.
- Existing top cards remain point-in-time illustrative summaries, distinct from historical period aggregates. No backend or persistent edits.

## Presentation
Uses the existing TailAdmin card, table, progress, radial, bar and area visual patterns. Bar charts remain 200px; finance area 310px; monthly radial 330px within its existing half-circle viewport. Wide charts/tables scroll inside cards on narrow phones; the page itself must not overflow. Four summary cards and bottom navigation remain unchanged.

English/Russian/Tajik labels included. Tajik requires native-language review. No detail pages added. Existing demo destination notices retained.

## Verification
Pure data tests: unequal weekday repetitions, zero dates/absent weekdays, hourly filtering, equal comparison interval, range validation, consistent sales/count totals, incomplete profit and empty means.
Browser tests: period selections, invalid/valid custom dates, target independence, weekday/hour interaction, incomplete profit, viewport overflow at 430×932, 320×640, 932×430, 844×300, 1440×1000 in light/dark, RU/TG rendering, JavaScript errors and HTTP errors. Chromium mobile emulation is not real Safari.

Real Safari acceptance remains owner-operated. Earlier notification acceptance is still open, not closed by these unrelated statistics tests.

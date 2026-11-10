# UX-02 continuation from f692cf4c294a5e9f63904605f0fb97aa45fd5d60

In progress; no completed-stage or publication claim.

- Stage2: native assignment dialog with original eligibility, heartbeat/freshness/busy checks and distance ranking. Operational availability, support-needs-reply and low-rating/unassigned alerts. Financial alert scenarios use explicitly authored synthetic balances; no live balances are queried.
- Extracted37 client mutation bodies from frozen A into a DOM-free module. Transport is offline and rejects writes with PREVIEW; it records exact intended RPC/table payloads for reproducible tests. No production connection or authorization success claimed.
- Replaced generic support decision form with native ticket component, closed-state restrictions, rejection reason and refund confirmation. Refund-room and wallet response scenarios are explicitly synthetic and are not evidence of server behavior.
- Native forms now invoke the appropriate original client method for covered operations, preserve errors/drafts and guard pending submissions.
- Explicit payload allowlists prevent read-only/identity fields from leaking from editor initial rows into store/banner/promo writes. Original server names and transformations retained.
-17 new focused tests: eligibility thresholds, busy driver, alerts, request args, wallet normalization, phone normalization, permissions validation, limit/refund/happy-hour constraints, offline boundary.

Remaining: finish all order and admin behavior, source-field/handler parity, browser interaction evidence and responsive QA before stage acceptance. Existing48 successful tests are not rerun when unaffected. No A/B/C/D2 edits, no deployment.

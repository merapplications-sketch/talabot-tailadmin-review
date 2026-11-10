# Native migration — checkpoint, NOT acceptance

Stage 0 remote 5205085f9bb624ab6c9b0b11280d975910a52d2b. Stage 1 remote 94f1ccdb2ca35e8d3500bf414d93c7d5e9000c10.

This checkpoint preserves stage 2 work and draft components for stages 3–5. They are not complete stages and must not be deployed as a completed candidate.

- Native React reads: twelve sections, orders/details/items/finance/timeline/chat; preserved original synthetic fixtures plus 62 historical orders.
- Cross-section order return observed in Chrome: Support → ticket → ord1 → Back → same ticket.
- Domain parity corrections: source contact phone shaping, cash aliases, discount signs, merchant-covered delivery, seconds-floor event differences, unknown event labels.
- B analytics imported unchanged. Four B summary values separate from A. New native build excludes legacy public applications; originals preserved in repository.
- Client validation helpers extracted verbatim into ordinary JS module, no execution of legacy core/HTML/render functions.
- React native forms are draft work, writes intentionally return PREVIEW. A displayed form is NOT complete parity.

Open acceptance blockers:
1. Full 179 handler / 50 field classification and parity tests incomplete.
2. Order assignment, all operational alerts, paging fallback/error/direct-history and scroll recovery need full interaction evidence.
3. Merchant brands, item approvals, image processing/map selection; driver map/cash actions; full customer paging and exact aggregate reads need transfer/parity.
4. Staff edit/remove, ratings filters/reopen, banner scheduling/link choices/conflict notices, loyalty draft conflicts and happy-hour controls incomplete.
5. Ticket status/reply/refund confirmations and closed-state restrictions need complete parity; current generic forms are not accepted.
6. B notification/settings functions not yet transferred. B analytics interactions have not all been retested.
7. TG operation translation fallback RU explicitly disclosed. 320/390/1440 and full locale/theme matrix pending. Physical Safari NOT TESTED.
8. Financial fixture balances/refund-room and server RBAC cannot be inferred from client guards. No production connection will be made. Synthetic result envelopes must be specified separately from real authorization claims.

D2, A/B/C, production, permissions, server contracts and databases unchanged. No public migration preview or deployment made.

# UX-02 mobile consistency — in-progress checkpoint

Date: 2026-11-11. Branch: review/ux02-mobile-consistency-20261111.
Verified canonical parent: cc2d45930b3102186b48a7f37d96ac90c4191098.
Previous published source remains 260e400c9ef3973592a62ecbad8fc6ac40906916.
No new publication in this checkpoint. Old previews, production, main and permissions untouched.

## Owner decisions
- Latest correction: pencil/edit must be light purple, NOT blue.
- Details orange, phone green, same action palette throughout the native candidate.
- All existing list search fields must use the same B input group; applicable filters inside the field open a dialog.
- Driver online/offline is a green/red B avatar badge on the photo edge; no separate visible online/offline label. Busy, approval and cash states remain separate because they are different facts.
- Remove development migration messages and repetitive technical footers. Keep a single short demo-data indication to avoid presenting synthetic financial/analytics data as live.
- Card request says “fold cards like the customer card”. Clarification is still unanswered: compact static cards with detail navigation vs expandable/collapsible cards. Do not assume either interpretation. The optional question was aborted when owner clarified purple; that was not a card decision.

## Source changes prepared
- Shared B SearchField for Orders and seven native entity list searches.
- Existing driver/store/rating/support filters moved to B dialogs without changing filter rules or storage keys. No invented filter for lists lacking one.
- Notification search uses the same field/dialog while preserving its existing read/unread and query handlers. Original B page consumers retain their presentation through optional adapter props.
- NativeIdentity composes existing IdentityImage with B AvatarBadge. Actual avatar_url and missing-image fallback preserved. No sample photo fabricated.
- Central action palette applied to native detail, call and edit glyphs; edit uses purple-400 / dark purple-300.
- Removed native migration paragraph, redundant list notice and native Shell technical footers. Original Shell defaults preserved for other consumers. Removed duplicate static write-block paragraphs from native forms/order detail. Failure outcomes and blocked writes retained, with plain language copy.
- No financial calculations, authorization, restaurant/pharmacy policy, FP16, logo, chart datasets or routes changed.

## Validation
- TypeScript noEmit: PASS.
- Native Vite build: PASS including final notification adapter (768 modules); existing large-chunk/config warnings only.
- Existing composition SSR: 7 PASS; mobile-round saved invoice/call/wallet/cash assertions PASS.
- Existing list journeys: 13 PASS (including search/filter/back-state logic).
- New consistency SSR: 7 entity list input-group compositions and closed applicable filters PASS; presence true/false/undefined and no visible online/offline text PASS.
- These are source/SSR checks, NOT browser or phone acceptance.
- This candidate: 320 / 390 / 1440 / real Safari / rendered screenshots: NOT TESTED.
- Owner screenshots remain before/reference evidence, not proof of this candidate.

## Resume
1. Clarify compact vs collapsible card behavior, then implement only the selected presentation using B components, preserving invoice/journey and all details/actions.
2. Finish app-wide technical-copy and icon audit; verify notification adapter and responsive rendering in the supported browser.
3. Run final build and affected checks; test supported viewport(s) honestly. Keep unsupported sizes and Safari NOT TESTED.
4. Save canonical final source, publish a NEW isolated HTTPS candidate, preserve all previous Sites. Owner authorization for public synthetic preview without ChatGPT login persists from previous round.
5. Record actual version/source, screenshots and function-matrix impact. No final visual acceptance yet.

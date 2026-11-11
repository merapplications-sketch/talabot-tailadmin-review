# UX-02 — version8 / ratings parity and existing list journeys

Status: **SCOPED IMPLEMENTATION SAVED AND PUBLISHED FOR REVIEW — UX-02 STILL PARTIAL / NOT ACCEPTED**.

- Repository: https://github.com/merapplications-sketch/talabot-tailadmin-review
- Branch: `review/ux02-final-b-integration-20261110`
- Canonical source: `604b4df7a947b5bff9664b9c6b99d13110b4f77e`
- Previous evidence: `05bf318a67117669d5ad29dc525ba9e1b9aaed1c`; previous published source: `adf0d32c688eebf00e8e376bab7913def02aae76`.
- Published review: https://talabot-ux02-native-b-review.alwarikahtan.chatgpt.site — **version8**.
- Only project `appgprj_6af33addc50481918ebbc6ca01125d15` used. Hosting artifact commit `bdea82ac52ed3939e057789a1fbaf9c38a20d968`; exact version/deployment in [publication.json](publication.json).

## What this batch closes

**FP27 source and scoped interaction gaps:** Phone no longer labels a comment; existing desktop/mobile field positions are Order/Status/Comment/Store. No fake phone/call was added. Existing B SummaryCards show driver/store averages with one decimal and included counts, follow-up count, and total over the source before display filtering. Missing values are excluded, and the empty average is `—`. Existing B Select provides need/all/done, defaults to need as A does. Need is unhandled with an existing store or driver value≤3; independent operational alert≤2 is unchanged. Existing detail components preserve date, actual stars, full comment/tags, handling note/state and order link. Handled ratings expose Reopen only; unhandled ratings expose Resolve only.

Two proven continuation defects were corrected: ratings Back now calls the existing state/scroll restoration handler; rating resolution opts into draft reset and dialog closure only on explicit `ok === true`. Refusal/error keeps the draft. This success path is injected in tests only; preview writes remain blocked. No old A runtime, iframe, new UI component, CSS or new action placement.

**FP07/FP09 testing gaps:** existing date endpoints, Dushanbe boundaries, store/payment, newest/oldest, supported intersections, invalid/corrected dates, empty results, clear-one/all, detail/back/reload were tested. No filter rule/layout changed. Rating→linked order→reload→rating→list retains search/filter; settled scroll538 equals saved538. An immediate read0 preceded existing double-RAF restoration and is not the final result.

**V7 protection:** ticket-details.tsx is unchanged.12 support handler checks pass. Published browser refusal preserves decision/reply through close/reload/explicit reopen, dialogs stay closed on reload, and Back returns with query t1. No real refund or successful server closure was performed. The public support evidence replaces two inconclusive local getter values; they are not counted as successful proof by themselves.

## New execution evidence

- **105 distinct checks PASS:**28 new (ratings12, rating-action handlers6, list journeys10),77 affected regression (ratings4, support12, operations17, validation14, domain22, shared B composition8 counted once).
- Test-only synthetic oracle: driver average3.0 from5 values; store3.2 from5; follow-up3 of8; handled2. Tests include store-only/driver-only/both/missing, low handled/unhandled, high unhandled, empty, long comment, tags and one-decimal display. Actual B SSR checks desktop/mobile markup semantics; SSR is not responsive rendering.
- NativeForm success tests use injected response envelopes and test-only hook scheduling, not React browser reconciliation or actual rating HTTP success. Error, refusal, thrown response, missing ok, cancel/reopen are distinct assertions.
- Build PASS; TypeScript source check PASS; affected ESLint0 errors/0 warnings. Existing full47-warning result is prior evidence only. Existing Vite config-extension/chunk-size and npm environment warnings remain.
- Connected Chromium, actual1363×936: local existing-filter and rating journeys plus published version8 checks. [browser-local.json](browser-local.json), [browser-published.json](browser-published.json), [support-published.json](support-published.json).
- Local console contained extension metadata errors and2 opaque Vite-client Object errors. Published screenshot-pass log sample returned extension errors only, no application-domain entries. Full network/HAR is unavailable; no blanket zero-failed-request claim.
- Public SOURCE.json identifies604b;4 built assets plus the root HTML match SHA256. `/index.html` responds307→`/`; a preliminary no-follow hash check of its empty redirect body failed and was resolved by inspecting the redirect and hashing the root. This was a verifier issue, not an app code change.

## Responsive / visual limits

[SCREENSHOTS.md](SCREENSHOTS.md) contains public screenshots of home/orders, ratings, order/rating details and edit dialogs on the same source. **They are1363×936 only.** Initial-loading and pre-modal-transition captures are preserved and clearly labelled; final captures are separate.

**320×844 /390×844 /1440×1000: NOT TESTED / BLOCKED_CAPABILITY.** The connected browser exposes no viewport setter. An authorized alternate TinyFish capability check also reports no supported viewport-resize API. Existing CI was read: one workflow builds/checks only, another changes dependencies/config and pushes a different branch. Neither provides an isolated browser runner; neither was triggered. No forbidden socket/DevTools retries, new dependency, lock change, browser zoom or CSS substitute.

Missing capability: an authorized page/context viewport-resize operation with screenshot output, or an existing isolated CI browser runner supplying those three dimensions without production publishing/secrets/real data. Real iPhone Safari remains **NOT TESTED**. No owner visual acceptance is asserted.

## Matrix37 and remaining work

[coverage-37.md](coverage-37.md) and [coverage-37.json](coverage-37.json): **4 inherited VERIFIED SAMPLE /32 PARTIAL /1 NOT COMPLETE**, unchanged overall counts. Every row separates source, interaction, visual, responsive and backend evidence. FP27/07/09 sub-gaps improved; their overall PARTIAL status is retained. FP25/26 regression is refreshed. Unchanged earlier successful suites were not rerun solely for this report.

Outstanding: requested responsive evidence and final visual review; actual backend/RBAC/success is not connected in this isolated preview; all-screen language/theme/analytics interaction matrix not complete. TG operations retain the documented RU fallback. FP16 branch/item approval placement remains unresolved; maps/images/ownership, cash receipt, full customer totals/ledger, staff edit/delete and other row-specific gaps remain in matrix37. No complete branch/menu/hours management was invented.

## Exact resume point

Resume from the remote commit containing this HANDOFF; executable/published source is604b above. Review this directory and the current remote branch head before changing anything. Do not restore old source, repeat successful unchanged checks, or redeploy merely to resend this report. The dependency lock, B originals, A reference, fixture, analytics, contracts and permissions are unchanged; hashes in [protected-files.json](protected-files.json).

New tests are `tests/ux02-ratings-parity.cjs`, `tests/ux02-rating-actions.cjs`, `tests/ux02-list-journeys.cjs`; run through Node with `UX02_EVIDENCE_DIR` pointing to a new evidence directory when a future affected change warrants it. They use installed dependencies and synthetic data only.

Never publish the inherited D2 manifest. No A/B/C/D2/production/Talabat-v3 changes, no main merge, no force push. Local checkout history is a mirror, not the canonical remote ancestry; use the remote branch commit as recovery authority.

# UX-02 — support and rating continuation / version 7

Status: PARTIAL IMPLEMENTATION / NOT ACCEPTED. No redesign or new UI placement.

- Repository: https://github.com/merapplications-sketch/talabot-tailadmin-review
- Branch: review/ux02-final-b-integration-20261110
- Resume baseline: 0ccdd955d1b4408fd547838d2e9d8c2622f168ca; previous published code: 4297dee6ae2948db720d24f604f31e0214264e51.
- Support checkpoint: 6fd5aaf307b6311c8132a518a00bf616b4dd30db (version6).
- Current published code: adf0d32c688eebf00e8e376bab7913def02aae76.
- Review: https://talabot-ux02-native-b-review.alwarikahtan.chatgpt.site — version 7.
- Artifact commit: 8a41da25145b7be405ee2b24b0ff6cea049ff559. Deployment succeeded; publication.json records the exact version/deployment.

## This continuation

The prior local checkout was absent in this executor. Recovered the saved runtime source using the GitHub tree and matching original B files; verified Git blob hashes before editing. 1,195 files matched locally and 103 further source/evidence files were recovered exactly. Other historical evidence remains on GitHub; no remote files were deleted. Dependencies restored from the unchanged package-lock with npm ci. This is recovery, not rebuilding the design.

Source A: public/operations-source/admin.html tkSendA / tkStatus (533–542), and talabat-core.js ticketStaffReply / ticketSetStatus (1061–1078).

The closed-ticket guard already existed in native TicketDetails. It was tested rather than rewritten. A real missing success continuation was found: a confirmed successful reply/decision did not clear its draft or return after closure. NativeForm now has an opt-in resetAfterSuccess used only by the support reply; TicketDetails clears note/refund only on explicit ok:true and returns to the existing list for resolved/rejected. Errors keep all drafts and stay on the current ticket. No new UI, CSS, fields, routes, business calculations, permissions, transport or fixtures.

The follow-up source comparison found that A ratingBlock chooses Reopen OR Resolve based on handled_at, while D showed both for handled rows. Kept both original B components and the same action location; corrected the existing conditional only. Handled notes, stars and order links stay visible. Source A admin.html478–486.

## Tests actually executed

- New handler tests: 12 PASS. Four failing cases reproduced before the fix (before.log), then passed (handlers.log). Tests execute production handlers with test-only hook scheduling and injected response envelopes; they are not DOM reconciliation or backend success proof.
- Affected regression: operations 17, validation 14, B/D SSR composition 8 PASS. Ratings follow-up:4 original B SSR state/field checks PASS (one failed before fix);8 shared SSR checks rerun for the affected entity component. Total this batch:55 distinct checks. Unaffected prior suites retained; no rerun merely for reporting. The three edited source files are the only changed existing runtime files against the pinned remote tree.
- Build PASS; TypeScript PASS after narrowing the explicit success result; affected ESLint 0 errors / 0 warnings. Prior full lint 47 warnings retained, not rerun or recounted as fresh proof. Build retains existing Vite configuration/chunk warnings.
- Connected browser: original public V5, managed local preview, then public V6. Actual viewport 1363×936. Public V6 loaded assets/index-R8HSBvQ2.js; root1, iframe0, one order search, dialogs0 on entry.
- Local support: search t1 → detail → refusal without note; refund107 rejected against explicit synthetic room106; refund10 confirmation; cancel leaves draft; confirm produces preview refusal; back retains t1; reload retains note/refund and dialogs stay closed. Reply draft survives refusal, close and reload.
- Published V6: reply opens explicitly, refused send retains the typed body through reload and reopen. Customer phone form regression: explicit edit, refused save, reload/reopen retains reason. No real write occurred.
- Browser automation initially raced the dialog's close animation (duplicate selector / one deadline). Fresh state and waiting for the dialog to hide resolved it; these attempts are not counted as passing steps. Captured console errors were extension metadata messages. Full network/HAR coverage is unavailable; no blanket zero-request-failure claim.

Published V7 loaded assets/index-DraiSfhG.js. The same handled ord5 rating now shows Reopen only; its action gives the explicit preview refusal. Unhandled ord4 shows Resolve only, opens its existing B dialog explicitly, keeps its note after refused save/reload, and stays closed until reopened. Before/after and draft screenshots saved. No real resolution or reopening success claimed.

## Responsive and visual boundary

The connected browser API still has no viewport setter. The previous DevTools policy block is retained without repeating it or launching blocked Chromium. 320 / 390 / 1440: NOT TESTED. Real iPhone Safari: NOT TESTED. The managed preview route is now available for desktop testing only. Twelve screenshots and their manifest are saved; V5/V6 support before/after use the same blank decision state. No visual acceptance or mobile suitability claim.

## Matrix and resume

[coverage-37.md](coverage-37.md) and JSON carry all37 rows: 4 inherited VERIFIED SAMPLE / 32 PARTIAL / 1 NOT COMPLETE. This is not a completion percentage. FP25 now separates proven closed-state/handler behavior from missing live/backend proof. FP26 corrects a stale earlier gap: a synthetic refundRoom for t1 already exists (126 total /20 refunded /106 room), but no real server allowance is available.

Resume from the remote branch head containing this report; executable source is adf0d32c. Use this directory as latest evidence, retain ../continuation as historical evidence. The next independent source-parity work is FP27 ratings list filters/averages and the existing generic Phone heading that currently displays the comment, plus remaining field/form contracts; confirm approved column mappings before changing composition. Reopen/resolve state exclusivity is now corrected; backend success and all responsive cases remain unverified. FP16 placement remains blocked; do not invent branch/menu/hours management. Upload/map, cash receipt, staff edit/delete/RBAC, complete TG, full analytics interaction and mobile coverage remain open per matrix. No new owner design decision was introduced by this patch.

Do not deploy the inherited native checkout hosting manifest (D2). Only isolated project appgprj_6af33addc50481918ebbc6ca01125d15 is authorized. A/B/C/D2/production/main unchanged. Local recovery history is not the canonical GitHub history; never force-push it.

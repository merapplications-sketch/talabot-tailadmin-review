# QA — isolated native continuation

## Scope / provenance
V4 source ebc4782c398f0f2cf6d3df1e8bfc543edef12640: B notification routing/read state and A log display. V5 source4297dee6ae2948db720d24f604f31e0214264e51: display metadata correction only. Hosting commit410a7cfe0b4e761d8514a7ded7649905ed66825a, version5. Public site deployment succeeded; connected browser loaded assets/index-C4x3ovNP.js.
No A/B/C/D2 or production data/permissions/main changes.

## Automated checks
70 existing logic/data regression checks PASS; 8 SSR composition checks PASS; 12 new source/route/local-read/log checks PASS; 6 preserved narrow branch/item contract checks PASS. Total96 distinct checks. The20 affected composition/continuation checks were rerun after fixing the displayed date/asset/sample copy. The70 unaffected checks were not rerun. Build and TypeScript PASS at both checkpoints. Full lint0 errors/47 pre-existing warnings; final affected lint0/0. checks.json, followup-checks.json and logs contain executed commands/results. SSR icons are test stubs; those tests are not pixel or browser evidence.

## Connected browser results
Actual Chromium viewport1363×936, not Safari and not mobile. 40 observation records in browser-evidence.json; this is not a claim of40 independent passing tests.
- Root1, iframe0, one order search, closed secondary/details on initial render. Twelve operational destinations opened. No dialogs opened automatically in the checked sections.
- Search ord1 -> one result -> details -> back -> reload kept search and result.
- Wallet + ord1 -> empty; reset restored the list. All7 status selections each returned expected ord0..ord6. Full date/store/sort combinations not exhaustively exercised.
- Order parties/items/payment were visible; Timeline and Chat opened explicitly. Phone/map launch and assignment were not executed.
- Customer edit opened explicitly. Reason/phone draft survived close/reopen and reload; closed edit remained closed after reload. Save returned an explicit isolated-preview refusal and retained inputs; no persisted server write is claimed.
- B bell opened, View All navigated within same root, search/read filtering worked. Mark-read persisted through reload, removed the record from unread results, and B notice -> exact A sample order -> notice returned correctly. Final V5 route regression passed. Unknown order update time shows —; absent entity image uses original B fallback with no card-image source requested.
- Audit and error tabs show their correct empty messages; Retry keeps data honest; selected error tab survived reload. Populated audit/error data was tested only at source/render level.
- EN/RU/TG selectors worked. TG operations visibly fall back to RU and are not fully translated. Dark class applied; controlled Light remained through RU/TG changes. Auto and TG survived reload. One rapid sequence yielded an ambiguous dark snapshot; controlled follow-up did not reproduce a persistent preference loss. No complete language×theme×screen matrix claim.
- Analytics: Today changed completed orders740 ->102; sales toggle10494; Monday changed hourly heading; quality grouping changed to delivery areas. All original B sources/groups remained present. Not every chart hover/drilldown tested.
- Width probes on checked desktop sections showed page scrollWidth no greater than viewport. No broad overlap/clipping acceptance: long names/status labels wrap densely in the order table screenshot. Mobile remains unverified.
- Scroll: initial numeric comparison2050 ->1682 did not establish exact retention because the target/geometry was not controlled. A subsequent fully visible target retained scrollY1682 and button top445.59375 exactly after detail/back. Therefore only that controlled case passes; broad scroll invariance remains partial.
- Captured console output contained extension metadata errors, no app-origin error in the returned records. Full network request interception/HAR is not exposed by this browser API; no claim that every request succeeded.

## Viewport blocker — recorded once
320/390/1440 could not be set: connected browser API exposes no resize method; opening DevTools returned “Your organization has blocked the use of DevTools on this page.” Screenshot viewport-blocked.png. No zoom substitute, blocked local Chromium retry, policy change or indirect bypass. Existing CI at45ed6a3 reviewed: original-build workflow has no browser/viewport job; vinext workflow writes another reference branch. Neither was run. Missing capability: authorized viewport resizing or an existing isolated browser-test job. Real iPhone Safari NOT TESTED.

## Functional and visual limits
Matrix37:4 inherited VERIFIED SAMPLE /32 PARTIAL /1 NOT COMPLETE, not37/37. FP16 narrow brand/create/attach/detach and item-approval contracts tested without a UI acceptance claim. Original brCard placement and a pending-item action surface are not established in the approved D composition, so no new UI placement was invented. No full branch/menu/hours administration contract inferred.
Remaining: uploads/maps, complete driver cash/settlement, support/refund allowance, ratings/reopen, banner conflicts, loyalty interactions, staff edit/delete/RBAC, full translation and responsive QA. Existing sensitive actions stay in their current approved locations. The dense desktop wrapping/large operational alert area are documented, not redesigned in this batch.

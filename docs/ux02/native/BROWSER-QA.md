# Browser evidence — native migration checkpoint

2026-11-10; local managed Chrome; synthetic data only. Browser viewport observed: 1363×936 CSS pixels. Screenshot checkpoint.png. This is not 1440 verification and not Safari.

Observed in the actual React app:
- One #root, zero iframe elements. No horizontal document overflow at the observed desktop viewport. Five ApexCharts canvases rendered.
- Search ord4, detail, Back, reload: retained query/result (stage 1 evidence).
- Support → ticket → ord1 → Back: returned to the same ticket.
- Customer pv-cust62: showing 50/62; Show more → 62/62; open h938 → Back → 62/62.
- Wallet correction 0 with reason: rejected with source bad-value message. Correction 20: PREVIEW/write-disabled error; value retained, no success claim.
- Draft amount20 + reason retained after customer → old order → Back with the new draft persistence.
- Analytics Today changed period to 2026-11-09; merchant sales10,494 and previous8,903; Monday hourly heading updated; delivery-area quality grouping selected. Month restored. Five charts rendered.
- Custom start2026-11-10 was refused by native date validity (max2026-11-09), displayed browser validation message; applied period stayed2026-11-09. This is not a test of every custom date error.
- RU labels observed. TG selected with explicit RU operation fallback notice; B analytical text changed to TG with its own incompleteness notice.
- Dark applied root class; Light observed; Auto selected. OS theme-change reaction not tested.
- A cards at top:7 /415.00TJS /44.00TJS /4; B summary cards separate in analytics.

Unverified/open:
- 320/390/1440: NOT TESTED. Tried Chrome device toolbar; browser displayed “DevTools not allowed on this page — Your organization has blocked the use of DevTools on this page”. No policy override attempted. This blocks that test mechanism, not a claim the application cannot be resized elsewhere.
- Physical Safari/iPhone: NOT TESTED.
- Complete 37-family journeys, all errors/confirmations, roles, upload/map, all analytics interaction combinations, keyboard/dialog focus and exact scroll return: NOT VERIFIED.
- Not a network interception test. Isolation evidence is no production transport in native code, CSP connect-src self, and build excludes the preserved legacy apps. No production data or service requests intentionally made.

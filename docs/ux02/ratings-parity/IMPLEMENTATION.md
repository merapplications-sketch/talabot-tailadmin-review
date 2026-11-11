# UX-02 v8 scoped implementation

Base: 05bf318a67117669d5ad29dc525ba9e1b9aaed1c (published v7 adf0d32c688eebf00e8e376bab7913def02aae76). Remote head unchanged before work. No source restoration.

## FP27
A admin.html lines463,474–492: avg / lowOf / needR / cmtParts / ratingBlock / vRatings / resModal / saveRes. Pure data functions in native/ratings-data.ts; no legacy runtime execution in React. Existing NativeGrid fields now labelled Order/Status/Comment/Store in their existing positions; no fabricated phone. Existing updated field carries readable creation date. Secondary details use existing Card/Pair/Badge, retain actual stars only, full comment/tags/date/handling note and linked order.

Existing B SummaryCards informational adaptation supplies averages (one decimal), included counts, follow-up and total over all source rows before display query/filter. Missing average is em dash. Existing B Select inside current search card supplies need/all/done; default need matches A. Need means unhandled and at least one existing value<=3; low-alert threshold2 untouched. No new UI/CSS.

Rating detail Back now invokes existing navigation restoration; only ratings use the new callback. NativeForm opt-in close/reset after explicit ok===true matches resolution success continuation; errors/refusal retain note. No success path is connected to a real service. Support v7 behavior retained and regression-tested.

## FP07/FP09
Existing filter rules and presentation unchanged. Logic tests cover date edges in Dushanbe, each endpoint, store/payment, oldest/newest, intersections with status/search, invalid/corrected ranges, empty result and nonmutation. Browser covered inputs, clear-one/all, linked detail/reload/back and rating query/filter/draft/scroll restoration. Dates were entered through native segmented keyboard input: ISO fill did not fill native browser date segments; not counted as successful. Immediate scroll read0 preceded existing double-RAF restoration; settled observation538 matches saved position.

## Fresh checks
105 distinct logic/handler/SSR checks passed (shared8 SSR counted once): new ratings12, rating-action handlers6, list journeys10; retained rating-state4, support12, operations17, validation14, domain22, composition8. Build/TS/affected ESLint exit0. Full47-warning lint result is retained prior evidence, not a fresh run. Build chunk-size and config-extension warnings retained.

No production HTTP/RBAC/financial writes tested. Success injected only into test handlers; browser real preview refuses writes. Local console includes extension metadata errors and2 opaque Vite-client Object errors; no full network pass asserted. Static published verification follows.

## Scope protection
No CSS/template/icon library/homepage layout, fixture, analytics source, original A, contracts, permissions, dependency or lockfile changes. Homepage file only passes existing Back handler to EntitySections. D2/A/B/C/production untouched; no main merge.

## Responsive
See responsive-capability.json. Requested320x844/390x844/1440x1000 remain NOT TESTED. Connected browser is1363x936. Alternate authorized browser lacks resize too; existing CI does not provide viewport testing. No retries of forbidden sockets/DevTools, no installs. Real Safari NOT TESTED.

# Five owner corrections — 2026-11-11

Base: canonical `91ac107c125998dcd1998147b845ec511a1f6b46`, executable source `02f9815be9970172b71d509688a286c3c914da02`.

Scope is limited to the latest five corrections; older Home, finance, banner, permissions and production work is not reopened.

1. Support details: wrap phone/call and linked-order controls with separate gaps; retain their existing handlers.
2. Edit pencils: existing B ghost buttons retain the orange icon and 44 px target, without outline border or shadow.
3. Ratings summaries: courier/store/attention/total cards select the matching rating scope; target selection excludes missing scores independently of the star filter. Summary averages and follow-up rules are unchanged.
4. Individual rating rows and details: five B star icons, saved integer score yellow and remaining positions neutral. Missing values remain missing.
5. Shared list search, merchant search and the pictured language/theme selects: remove extra colored focus outlines/rings; retain the normal neutral field boundary and existing filters.

Local validation: TypeScript and Vite native build PASS; 17 list/navigation/filter checks PASS; 7 composition SSR checks PASS; 7 existing owner-refinement checks PASS; individual-score SSR checks cover 0–5 and missing/invalid values. SSR icons are stubbed and are not pixel evidence. Build retains existing large-chunk/import-extension warnings.

Source recovery verification: recovered text files with one extra trailing newline were normalized against the canonical Git blob hashes. No semantic changes from that normalization are submitted. Canonical save uses the exact base tree and an expected-HEAD lease, not the recovery mirror history.

Publication and browser evidence are recorded in DELIVERY-FOCUSED.md after verification. Actual iPhone Safari and 320/390/1440 viewport testing are NOT TESTED unless explicitly documented there.

# TALABOT UX-02 — U01–U15 / Version 10

**ISOLATED CORRECTIONS PUBLISHED — PARTIAL VERIFICATION — OWNER VISUAL ACCEPTANCE PENDING**

Published review: https://talabot-ux02-native-b-review.alwarikahtan.chatgpt.site

- Repository: `merapplications-sketch/talabot-tailadmin-review`
- Branch: `review/ux02-final-b-integration-20261110`
- Final published source: `5a30d82d18b3c74726360e901711c14f8e3bed51`
- Main correction source: `e29297889fa7758815f7a07812842b29da26b893`
- Preserved v8 source: `604b4df7a947b5bff9664b9c6b99d13110b4f77e`
- Preserved v8 evidence: `7021a2fd9c817443a719ea43e8b205c2a6dc08e0`
- Project: `appgprj_6af33addc50481918ebbc6ca01125d15`
- Published version: **10**, `appgprj_6af33addc50481918ebbc6ca01125d15~appgver_b9280807e3e4819180c66a6a3736af5d`
- Sites artifact commit: `df66fffb0a6b31bbb343877b311c10f61993af00` (not the GitHub application source SHA).
- Deployment: `appgdep_6af41f620aa88191aa45ee9798c88108`, succeeded `2026-11-11T07:55:27.669131+00:00`.
- Public `/SOURCE.json` independently read after publication and matched the final GitHub source. Saved as [published-source.json](published-source.json).

## What changed

Original B Outfit assets now load in the isolated entry. Entity-specific Grid columns replace the generic Phone/Address mapping. Banner/promo activation aliases are normalized only in the read adapter; the fixture is unchanged. Order list/detail identity, actual phone and image use the same profile identifier. Missing phones do not invent a contact action. The search hint describes the existing A matcher and actual customer-phone lookup.

A's driver All/Online/Offline filter, freshness/status, last seen, cash/limit and inclusive cash-limit warning are rendered with existing B Grid, Select and Badge. Existing B Shell/panel wraps entity pages. Texts and loyalty expose actual supplied summaries through existing InfoField; secondary forms remain closed. Status colors are entity-specific; unknown states remain neutral. Pencil accessible names include Edit and the entity.

Existing B large button variants are used for the affected native actions and dialog controls. Save uses the existing outline variant; the orange brand and logo were not edited. The final source commit adds visible labels around the existing support/rating/store status Selects, using B's existing field-label pattern after screenshot review exposed alignment differences.

See [U01–U15 matrix](U01-U15.md), [machine-readable matrix](U01-U15.json), [before/after gallery](gallery.md), [tests](results.json), and [37-function matrix](coverage-37.md).

## U08 is still partial

Measured on the same connected browser, viewport **1363×936**, scrollY=0, same synthetic orders:

| Measurement | Before v8 | Final v10 |
|---|---:|---:|
| First order top | 973.59375 px | 899.59375 px |
| Fully visible records | 0 | 0 |
| Partially visible records | 0 | 1 |
| First row height | 180.5 px | 180.5 px |

The existing B Alert replaces the oversized cash warning Card without removing its information/action. The first record moves **74 px** earlier. This is **not sufficient to close U08**. A's four metrics, operational alerts, all B analytics and the search/filter sequence remain intact. No arbitrary spacing reduction, hiding or relocation was used to manufacture an acceptance result. Further density work must stay within approved B compositions; this checkpoint does not authorize a new layout.

## Tests and their limits

- Build: PASS (`npm run build:native`); existing chunk-size warning remains.
- TypeScript: PASS (`tsc --noEmit --incremental false`).
- Lint: **0 errors / 47 existing warnings**; no rule relaxation.
- **120 distinct assertions/checks passed**: domain22, operations17, validation14, support12, rating action6, rating state4, ratings parity12, list journeys10, shared SSR8, audit data8, audit SSR7. Shared SSR checks run by multiple scripts are counted once.
- Final label-only delta reran the affected SSR and ratings-parity checks, Build, TypeScript and Lint. Other successful checks are retained because their implementation did not change.
- Handler successes use explicit isolated simulated responses. They are not HTTP, server persistence, permissions or RBAC tests. SSR checks do not prove layout or interaction.
- Test harness imports were updated to load the real new data adapters, and accessible-name expectations were updated for the required Edit verb. Existing behavior assertions were not weakened.

Desktop interaction observations: driver All/Online/Offline, empty result and name search; detail/back/reload retention; edit rejection retaining draft1100 through close/reopen/reload; financial confirmation open/cancel; no automatic dialog on reload; EN/RU/TG and Light/Dark/Auto switching; TG+Auto persistence with documented RU fallback; order search/Delivered filter/details/back/reload/reset; actual linked identities. Final screenshots cover home, ten entity lists, order details and an edit dialog. Full analytics interactions were not rerun: protected analytics source and prior evidence are retained, not reclassified as a fresh blanket PASS.

Affected edit-dialog controls measured 44 px after animation; Save normal-state contrast measured **10.37:1 Light / 10.21:1 Dark**, from rendered foreground/background colors. This is not an audit of every control or every hover/focus state.

## Responsive and browser capability

**320×844, 390×844, 1440×1000: NOT TESTED / BLOCKED_CAPABILITY. Real iPhone Safari: NOT TESTED.**

The available connected CDP browser exposes no authorized viewport-setting operation. Its actual viewport is1363×936. The prior TinyFish capability session `c4ed6540-7cef-4dc8-9708-f7a8ab5351e6` did not supply a viewport setter, verified dimensions or responsive screenshots; Task completed was not treated as test success and the task was not rerun. `verify-tailadmin-original.yml` has a build-only job, no browser runner. The other inspected `verify-vinext-build.yml` mutates dependencies/configuration and pushes a different branch; it was not run. No new dependencies, lock changes, socket, DevTools, zoom or policy bypass was attempted.

A sanctioned browser runner exposing real viewport width/height is the missing capability. Existing screenshots are desktop evidence only. Page overflow was checked only at the actual desktop size. No complete network request log was available; absence of observed app console errors is not a claim that every request succeeded.

## Function protection and remaining gaps

Overall 37-function statuses remain **4 VERIFIED SAMPLE / 32 PARTIAL / 1 NOT COMPLETE**. Dimensions are separated per row in [coverage-37.json](coverage-37.json): source parity, interaction, visual, responsive and backend. Opening a section is not completion of its functions.

- FP07/FP09 filters, intersections, invalid periods, clearing and return state retain v8 evidence and passed affected regression.
- FP27 ratings calculations, missing-value handling, follow-up threshold, filters, exclusive Resolve/Reopen and drafts retain v8 behavior and passed regression.
- FP16 branches/item approvals and unresolved map/photo placements remain blocked; no new location or workflow was invented.
- U08 density is still partial. Requested widths and real Safari are unverified; full mobile touch/overflow and all button hover/focus states are unverified.
- TG operations still use the previously documented RU fallback where translations are missing.
- Backend/RBAC/real financial writes remain outside this synthetic preview; no success claim.
- Wider function-migration gaps remain recorded row by row. This release does not complete UX-02 or grant visual acceptance.

Fixture, protected contracts/mutations/validation/navigation/ratings calculations, original styles, SummaryCards and analytics are byte-unchanged; see [protected-files.json](protected-files.json). No stylesheet, dependency/lock, permission or calculation changes; one React root, no iframe. A/B/C/D2, production and main were not modified. Only the explicitly authorized isolated project was published; inherited D2 hosting settings were not used.

## Recovery point

Resume from the **GitHub evidence commit containing this file**, whose parent is final application source `5a30d82d18b3c74726360e901711c14f8e3bed51`; inspect remote HEAD and any new work first. The local git history is a workspace mirror with different commit IDs: never push that mirror over the canonical branch. Both source commits and this evidence tree were saved with a guarded fast-forward only, no force push.

The next work is limited to remaining proven gaps, U08 density within the approved B contract, responsive evidence when an authorized viewport runner exists, and owner visual review. Do not repeat completed checks solely because a report is resent. Do not rebuild or republish an unchanged source. Do not merge main or touch the security/finance track in Talabat-v3.

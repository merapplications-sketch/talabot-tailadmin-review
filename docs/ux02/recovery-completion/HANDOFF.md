# TALABOT ADMIN — UX-02 / Recovery & completion — v11

**PUBLISHED TO ISOLATED D. U01–U15 READY FOR OWNER VISUAL REVIEW WITH EXPLICIT VERIFICATION LIMITS. NO FP16 WORK STARTED.**

- Preview: https://talabot-ux02-native-b-review.alwarikahtan.chatgpt.site
- Repository: merapplications-sketch/talabot-tailadmin-review
- Branch: review/ux02-final-b-integration-20261110
- Final application source: `48592032e774a965c33e0e7c00dce4c9ecb3f94f`
- Recovery composition source: `6826d4eb7edd150bd2994a48a4405409a0ef987a`
- Entry remote source: `5a30d82d18b3c74726360e901711c14f8e3bed51`
- Preserved v8 source: `604b4df7a947b5bff9664b9c6b99d13110b4f77e`
- Actual published version: **11**
- Site: `appgprj_6af33addc50481918ebbc6ca01125d15`
- Version: `appgprj_6af33addc50481918ebbc6ca01125d15~appgver_92a713635f508191b6dde8289bbe1b93`
- Artifact source commit: `b226dd42d20bc50cb3a58aba6a887d91b09afc55` (Sites artifact history; distinct from GitHub application source).
- Deployment: `appgdep_6af439934a348191bd4a4a8cbbd5da73`, succeeded. Existing public audience retained.
- Published SOURCE.json was read through the browser and matched the final application source. [Deployment](deployment.json), [published source](published-source.json), [published measurements](published-metrics.json).

## Recovery facts

The old workspace was available. Its local git history was a mirror with different commit IDs; it was not pushed over the canonical branch. All1393 available tracked blobs matched remote HEAD, with zero mismatches.189 older remote documentation/evidence files were absent locally; remote API base trees preserved them. No unuploaded application-code change was found. Untracked v10 evidence, screenshots and handoff drafts were recovered and saved with provenance. We cannot claim recovery of files beyond what was found.

The recovered draft incorrectly said its own evidence was already saved remotely; HEAD was still5a30d82d. That statement is explicitly corrected in the historical handoff pointer. The original draft remains preserved. No running branch workflow was found (Actions response total_count0); no relevant local build/push process was observed, and Sites preview was stopped before this session. Version10 was independently confirmed deployed before editing. [Recovery inventory](recovery.json).

## Remaining correction completed

The current source already contained U01–U07 and U09–U15 implementation. Those changes were retained. Only the remaining U08 presentation changed:

1. Use B basic-tables/table-three header composition to place the existing title/result count beside the existing search form when space permits; keep the existing small-screen stack.
2. Place closed secondary filters and Reset in B's responsive flex composition. All filters, active-filter chips, handlers and ordering remain.
3. Keep the existing B Alert title/description together beside its existing action, with wrapping.
4. Use B table-three `px-4 py-3` cell rhythm, preserving font sizes, complete text and44×44 details actions.

No new stylesheet, arbitrary pixel values, information truncation, new template or removed field. Original reference files: `src/components/main/tables/basic-tables/table-three/card-header.tsx`, `index.tsx`, `transaction-row.tsx`, existing native OrdersList and `src/components/ui/alert.tsx`. Only two application files changed: `native/b-shell/list-patterns.tsx` and `native/operational-alerts.tsx`. The existing SSR assertion was adapted to class-token comparison after Prettier reordered classes; all behavior assertions remain.

## Actual density measurements

Same synthetic fixture,1363×936,scrollY0,expanded sidebar,closed secondary filters:

| Stage / language | First row top | First row bottom | Row height | Complete records |
|---|---:|---:|---:|---:|
| v8 EN, historical measured evidence |973.59375|1154.09375|180.5|0|
| v10 EN, freshly reproduced |899.59375|1080.09375|180.5|0|
| v11 EN Light, published |726.59375|891.09375|164.5|1|
| v11 RU Dark, local final source |726.59375|911.09375|184.5|1|
| v11 TG Dark, local final source |726.59375|931.09375|204.5|1|

First row starts173px earlier than v10,247px earlier than v8. EN row bottom improves189px versus v10. At least one complete row is actually visible in all three tested locales. No horizontal page overflow was observed at this viewport. A's four top metrics and B's four later metrics remain; analytics and operational warnings/actions remain. This is scoped desktop verification, not blanket responsive acceptance. [Gallery](gallery.md).

## U01–U15 and tests

[Full matrix](U01-U15.md) / [JSON](U01-U15.json): **12 FIXED /3 PARTIAL /0 BLOCKED implementation items**. FIXED denotes bounded correction with scoped evidence, not final owner acceptance or certification of every viewport. U08 remains PARTIAL overall because requested responsive coverage is absent although its desktop full-record criterion now passes. U13 remains PARTIAL for mobile/keyboard behavior; U14 for complete hover/focus contrast coverage.

Fresh: Build PASS (existing large-chunk warning); TypeScript PASS; affected-file ESLint0errors/0warnings;8 SSR composition checks and10 list-journey checks PASS. Search ord4 + Delivered returned1; Details/Back/reload kept query/status/result; Reset returned7; secondary status filtering worked; expanded controls remained usable. B rendering, fields, closed defaults and protected FP07/FP09 behavior retain assertions. [Validation](validation.json).

Prior v10 records contain120 distinct passing checks; those were recovered evidence, not rerun or presented as fresh. FP27 calculations/thresholds/missing values/Resolve-Reopen and drafts are byte-protected and retain prior evidence. No backend/RBAC/live-write claim.

## Outfit

Original two B font binaries and their variable100–900/normal/swap descriptors are byte-unchanged. They are packaged and loaded same-origin. Fresh final browser: body and h1 computed family Outfit; document.fonts.status=loaded; check('16px Outfit')=true; no Outfit error observed. Both asset hashes match the recovered source and published manifest. No full network/face enumeration was available; Cyrillic fallback is unchanged and computed family does not prove every glyph uses Outfit. [Font evidence](outfit.json).

## Browser limits and protected scope

**320×844 /390×844 /1440×1000 /actual iPhone Safari: NOT TESTED.** Connected browser has no documented viewport setter. No socket, DevTools, zoom, browser installation, permission or network-policy bypass. Screenshots are actual1363×936 evidence only. Mobile keyboard, safe areas, every touch target and complete hover/focus color states remain unverified. TG operations retain the existing disclosed RU fallback.

[37-function matrix](coverage-37.md) remains **4 VERIFIED SAMPLE /32 PARTIAL /1 NOT COMPLETE**. No inflated function acceptance. Protected fixture, navigation, mutation/validation contracts, FP27 calculations, SummaryCards, B analytics, original CSS and lockfile match their prior hashes: [protection](protected-files.json).

Restaurant policy is carried forward: restaurant items/prices are managed directly; admin intervenes for violations. No mandatory preapproval tab, no deletion of approved/publication guards, no pharmacy change, no backend or pending-item release, no new stop-item UI. Brand/branch placement inside B merchant details is approved and explicitly deferred outside this batch; it is no longer an unresolved placement question.

Only the authorized isolated D was published. A/B/C/D2/production/main and all permissions unchanged. The application repository retains an inherited D2 hosting manifest: it was not used. Publication used the independently opened artifact checkout whose project_id exactly matched isolated D.

## Resume point

Resume from the evidence commit containing this file; its parent is final application source48592032. Read remote HEAD and new work first. Source code is complete for this bounded recovery; stop at owner U01–U15 visual review. Do not start FP16. Next missing evidence requires a supported viewport-capable browser runner and actual Safari testing. Do not rerun unchanged completed tests or republish identical source merely to continue a conversation.

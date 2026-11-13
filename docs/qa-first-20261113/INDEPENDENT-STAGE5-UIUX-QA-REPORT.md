# TALABOT — STAGE 5 / Independent UI–UX QA Audit

**Date:** 2026-11-13 (Asia/Dushanbe)  
**Assignment:** [Independent UX Auditor #31](https://github.com/merapplications-sketch/Talabat-v3/issues/31) · [MASTER QA #26](https://github.com/merapplications-sketch/Talabat-v3/issues/26)  
**Judgment:** **PARTIAL (independent source/evidence audit completed) / BLOCKED (current-source executable visual acceptance) / PHASE2 NO-GO.**  
**Authority:** READ ONLY for application/source, documentation-only QA record on separate isolated branch. No fixes, product/UI changes, fixtures created, preview published, CI run, integration/DB/permission changes, or production access.

## 1. Immutable provenance and audit boundary

| Artifact | Independently rechecked identity | Caveat |
|---|---|---|
| Admin UX-02 candidate | `review/ux02-v01-v05-candidate-20261112` → **254757fab9d5fa80bffe22fa30de5e65aac2f153** | Exact remote HEAD at check. No local unpublished state can be known from GitHub. |
| Designer Stage 4 | [report at 5ff9e8c50886ac772b722c812c8144b058f2deed](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/5ff9e8c50886ac772b722c812c8144b058f2deed/docs/qa-first-20261113/DESIGNER-STAGE4-UIUX-QA-REPORT.md) | GitHub compare candidate→Stage4 = **one added Markdown report only**; zero code/assets changes. |
| Main project coordination source | `docs/phase1-operational-coordination-20261111` → **1cb85361d698d5da787d927a4c9ae7bd213c68c1** | Not asserted to equal the deployed version. |
| Customer / Driver / Merchant / legacy Admin `*.html` at that main SHA | Git blob IDs respectively `9bc335f52ad58d7feab12ad8a2214bde9ab32330`, `086929844b2080d7aa2afe1c2c57267cde245d40`, `5f09dd5cc3d5abc9d6b0d3afa031342b05f5212c`, `062a68cfa740f2733cad39b5c4c5b0c635f54e55` | Identity of source files only, not a test of approved customer/driver journeys. |
| Latest owner handoff | [HANDOFF.md](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/docs/ux02/owner-single-line-20261113/HANDOFF.md) · [CHECKPOINT.md](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/docs/ux02/CHECKPOINT.md) | Owner chose **small regular white single-line text on approved orange**; not permission to restyle. |

The Stage4 report's old pilot and private host observations are **designer-reported historical browser observations**, not independently replayed by Stage5. The old pilot did not provide an immutable source mapping and the UX candidate host displayed a ChatGPT sign-in barrier. No authorized, isolated, authenticated executable proven to match **254757fab9d5fa80bffe22fa30de5e65aac2f153** was supplied in this audit. The previous blocked access method was **not** repeated. GitHub tree/contents and historic evidence are not substitutes for DOM geometry.

## 2. Independent examination of Stage4's 10 source predicates

All 10 checks below were independently re-read from the pinned candidate, with the precise boundaries shown. **10/10 SOURCE-PRESENCE checks confirmed, 0/10 executable UI behaviors established.**

| ID | Independent outcome | Code evidence and limit |
|---|---|---|
| S-01 | **CONFIRMED SOURCE** | [workspace.tsx L806–813](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/src/components/talabot/workspace.tsx#L806-L813) renders `size="lg-single"`, `variant="brand-readable"`, read-dependent `disabled`, and `mark(id)`. Handler outcome **UNTESTED**. |
| S-02 | **CONFIRMED SOURCE** | [button.tsx](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/src/components/ui/button.tsx) declares `h-11` (44px), `w-full max-w-full whitespace-nowrap text-sm 2xsm:text-base font-normal` for `lg-single`; [cn.ts](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/src/utils/cn.ts) uses Tailwind merge. Computed text bounds **UNTESTED**. |
| S-03 | **CONFIRMED SOURCE** | [globals.css L49](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/src/app/globals.css#L49): `--color-brand-500: #f36831`. |
| S-04 | **CONFIRMED SOURCE** | [globals.css L12](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/src/app/globals.css#L12): `--breakpoint-2xsm: 375px`. |
| S-05 | **CONFIRMED SOURCE** | [notification dropdown L86–94](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/src/layout/header/notification-dropdown/index.tsx#L86-L94): `icon-lg` (44px), close aria label and `setIsOpen(false)`. Touch/focus/overlay effects **UNTESTED**. |
| S-06 | **CONFIRMED SOURCE** | [list-patterns.tsx](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/src/components/talabot/native/b-shell/list-patterns.tsx): `xl:block` bounded `table-fixed` with six columns plus `xl:hidden` mobile/tablet cards. Whether long content/controls fit at actual widths **UNTESTED**. |
| S-07 | **CONFIRMED SOURCE** | [native Home L108+](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/src/components/talabot/native/home/index.tsx#L108-L137) contains exactly four top summary-card entries: orders/revenue/commission/active, with destination handlers. This is not visual proof of their accepted position/appearance. |
| S-08 | **CONFIRMED SOURCE / APPROVAL LOCK** | [order-details.tsx](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/src/components/talabot/native/order-details.tsx) blob **66d3d199283d48b511517685866415be200b7126**, identical at historical accepted baseline **621038ec960746d217a87f594eb8342aaa8200e6**. V04 **ACCEPTED; not rerun**. |
| S-09 | **CONFIRMED SOURCE** | [preview.tsx](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/src/components/talabot/preview.tsx) labels `previewPersona.canViewFinance = true` **synthetic**, not actual RBAC. |
| S-10 | **CONFIRMED SOURCE** | [unified-review/index.tsx](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/src/components/talabot/unified-review/index.tsx) embeds `/operations-source/admin.html` in iframe. Sizing, scrolling and script messaging **UNTESTED**. |

The designer did not materially misstate these ten static properties. Their reported `10/10` must never be advertised as ten visual PASS cases.

## 3. Independently supported findings, discrepancies, and severity

### UX5-01 — P2 / CONFIRMED SOURCE-LEVEL accessibility shortfall (owner-approved styling; no automatic change)

**Route:** Admin `/[locale]/notifications/[id]` → Mark as Read (RU/EN/TG, Light/Dark source variant).  
**Source:** [workspace](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/src/components/talabot/workspace.tsx#L806-L813), [button](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/src/components/ui/button.tsx), [brand token](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/src/app/globals.css#L49).  
**Expected:** WCAG AA text contrast **≥4.5:1** for normal 14px/16px, weight 400.  
**Verified calculation:** relative luminance `L(#F36831)=0.291770666236`; white foreground `L=1`; ratio `(1.05)/(0.291770666236+0.05)=3.072235577:1` **<4.5:1**. The formerly used 20px-bold/large-text exception (3:1) does not cover the new regular small label. This is a **source-color/typography accessibility failure, not a newly reproduced screenshot defect**. Runtime computed style, disabled/hover/focus and browser font rendering remain **UNTESTED**.  
**Decision boundary:** preserve the owner's orange, white and single-line choice. PM must document the known tradeoff; any change requires the owner's separate approval. No inference that old clipped TG320 layout has reappeared.

### UX5-02 — P3 / CONFIRMED evidence-chain inconsistency missed in Stage4 report

[Latest owner HANDOFF](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/docs/ux02/owner-single-line-20261113/HANDOFF.md) states that **source blob hashes and screenshot SHA256** are in [metrics.json](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/docs/ux02/owner-single-line-20261113/metrics.json). Independently fetched `metrics.json` has only two source blob IDs plus **`"captures": []`**: **no image SHA-256, screenshot rectangles, run IDs or per-image viewport records**. The directory DOES contain four JPEGs named `tg-light/dark-320/390.jpg` (nonzero GitHub file sizes). Git blob SHA identifiers establish file identity within Git but are **not the claimed SHA-256 manifest**. Thus image presence is confirmed, while the handoff's specific machine-readable evidence claim is false. This is **a documentation/provenance defect, not proof of screen clipping**.  
**Closure:** designer/evidence owner supplies a truthful, source-pinned per-image manifest or corrects the handoff in a **separately authorized documentation task**. Stage5 did not edit the earlier handoff.

### UX5-03 — P3 / CONFIRMED denominator-label ambiguity; 37 routes actually exist

Read the pinned Git tree subtree `src/app/[locale]` (90 entries, **37 `page.tsx` paths**). Breakdown: **17 operational Admin route templates**, **4 QA/review routes** (`/operations-review`, `/review/operations`, `/review/image-cases`, `/visual-review`), **16 auth/demo/auxiliary templates**. Stage4's **21 = 17+4**, and total **37** are arithmetically correct; calling all 21 “business pages” is imprecise. Dynamic `/[id]` counts represent route *templates*, not records or individual page states.  
**Closure:** PM/QA label 0/17 operational, 0/4 review separately within 0/21 total; do not convert route inventory into functional acceptance.

### UX5-04 — P3 / CONFIRMED source-only localization incompleteness; visible impact UNTESTED

Independently parsed [EN](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/src/messages/en.json) and [TG](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/src/messages/tg.json): the six namespaces `talabot` (24), `talabotAnalytics` (71), `talabotOrders` (74), `workspace` (58), `nativeHome` (29), `ownerRound` (37) sum to **293 TG strings with zero values exactly equal to EN**. Designer's scoped arithmetic is **CORRECT**. However generic `common` TG contains **5/10 exact EN fallback labels**: `edit`, `saveChanges`, `delete`, `confirm`, `cancel`. Source localization debt is verified, but route-level display/use in TALABOT business UI is **not established**; **do not classify it as a confirmed on-screen V05 defect** without a screenshot/DOM path.

### Execution blocker — P1 QA gate / BLOCKED, not a UI or functional product failure

Current-source build + digest + authenticated isolated synthetic fixtures + trusted UI entry point were **not provided**. Historic pilot login pages lack source provenance; private candidate host requires authorization. A reported old browser run, developer screenshots, and a saved [native Vite build.log](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/docs/ux02/owner-single-line-20261113/build.log) do not establish accessible tested source parity. GitHub query returned **zero branch-scoped workflow runs** for the candidate and **zero associated PR-triggered runs** for its commit; do not infer every possible CI event was absent. `typecheck.log` is empty (zero-byte file) and does not alone independently prove TS PASS. This report did **not** clone, install dependencies, build, run a host, or probe production.

**New runtime-confirmed UI defects: NONE. New P0 defects: NONE CONFIRMED (not proven absent).**

## 4. Coverage and screenshot provenance

| Target | Independent Stage5 executable completed | Assessment |
|---|---:|---|
| Operational Admin routes | **0/17** | BLOCKED — SHA-matched executable and roles absent. |
| Admin QA/review routes | **0/4** | BLOCKED — same gate. |
| Combined Stage4/Admin requested route templates | **0/21** | BLOCKED, not FAIL. |
| Customer / Driver / Merchant / legacy Admin synthetic authenticated journeys | **0/4** | BLOCKED, not a product functional failure. |
| Per-route width × locale × theme (320,360,390,430,768,1440 × RU,EN,TG × Light,Dark) | **0/36** | UNTESTED; 36 is per-route, not project-wide total. |
| Long strings, keyboard/touch/focus/hover, 44px hit targets, modal/return/draft, empty/loading/error/offline/denied | **0 executable cases** | UNTESTED. |
| Independent static source checks | **10/10** | SOURCE CONFIRMED, not browser PASS. |
| Independent source math (default Mark-as-read) | **1/1** | FAIL WCAG AA normal-text threshold; not rendered test. |
| Real iPhone Safari | **0** | UNTESTED; simulated WebKit/Chromium never equals real device evidence. |

**Earlier materials available, NOT created or recaptured by Stage5:** four [owner TG button JPEGs](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/docs/ux02/owner-single-line-20261113/HANDOFF.md), [older PM geometry measurements](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/docs/ux02/pm-ux02-01-fix-20261112/evidence/measurements.json), [historical gallery](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/docs/ux02/pm-ux02-01-fix-20261112/gallery.md), [v2 final-delta handoff](https://github.com/merapplications-sketch/talabot-tailadmin-review/blob/254757fab9d5fa80bffe22fa30de5e65aac2f153/docs/ux02/v01-v05-final-delta/HANDOFF.md). In particular the old **352.203px** TG320 overflow measurement belongs to an **older 20px bold version**, not current 14px regular text. The current-stage JPEG pixels were not independently sampled and **NO NEW screenshot, DOM measurement, or controlled visual reproduction** exists in Stage5. Prior pilot landing-vs-child version labels remain a **reported provenance discrepancy only**, not a verified current UI bug.

## 5. Independent UX-02 gate judgment

| Scope | Independent classification | Closure condition / owner |
|---|---|---|
| **V01 Orders** | **CONFIRMED SOURCE; EXECUTABLE UNTESTED → PARTIAL**. B desktop six-column fixed table with separate mobile cards verified. Historic desktop clipping correction must not be reopened absent actual current-SHA geometry. | QA auditor: source-pinned 320/360/390/430/768/1440 screenshots + `scrollWidth/clientWidth`, status/amount/action visibility, long names, detail→back preservation. |
| **V02 Mark as Read** | **OWNER STYLE PRESENT; SOURCE ACCESSIBILITY FAIL P2; EXECUTABLE UNTESTED → PARTIAL**. Regular small white one-line on original orange, 44px declared; no current clipping reproof. | QA auditor: RU/EN/TG × 320/360/390/430 × Light/Dark, text box vs button, touch/focus/disabled/keyboard, computed contrast. PM/owner decides *separately* on documented accessibility tradeoff. |
| **V03 Notification close** | **CONFIRMED SOURCE; EXECUTABLE UNTESTED → PARTIAL**. `icon-lg`, `aria-label`, click close, Esc handler present. | QA auditor: open/close, keyboard Esc/Focus return, collision, scroll, 44px hit test on mobile/desktop/theme. |
| **V04 Dates** | **APPROVED / PRESERVED**. Exact blob identity with 621038ec baseline. No new invalidating delta. | Remains closed. Reopen only on actual source change or reproducible regression, with owner/PM scope. |
| **V05 RU/EN/TG headings** | **SOURCE LOCALIZATION PARTIAL; EXECUTABLE UNTESTED**. 293/293 six scoped TG keys not exact English; generic common debt is NOT proof of rendered business defect. | QA auditor: rendered notifications/drivers headers and long words in RU/EN/TG on bounded widths; show exact path and any fallback. |

## 6. Approved scope preservation

**Maintained by no-change audit and isolated docs-only branch:** Template B, original orange/white/logo identity, A four top KPIs, UX-02 V04. Main app source/approved locks — Dynamic Marketplace B, Restaurant Details v1.6, Product Customization Direction A, DineOut Premium Gold — were **not edited**. Main `*.html` blob identities were inspected; no claim of screenshot/pixel parity or functionality for those apps is made. Prior accepted PRICE/RATINGS/TIP/106/107, G1 decisions and protected records stay outside this review.

## 7. Prerequisites, accountable owners, and closure criteria (NO authorization to implement)

| Blocker | Responsible party | Objective closure evidence |
|---|---|---|
| E-01: No exact-source runnable candidate accessible to independent QA | **Publisher + programmer** under PM authorization | Immutable artifact or approved private review URL, `source SHA=254757fab9d5fa80bffe22fa30de5e65aac2f153`, build hash, module asset manifest, environment isolation/no live services, non-production access evidence. No production host access-policy change. |
| E-02: No isolated authenticated test state | **Programmer/test-fixture owner** | Synthetic roles for Admin/Customer/Driver/Merchant/legacy Admin; mock API, deterministic seeded data and error/empty/denied/offline states; no real credentials, permissions or financial mutations. |
| E-03: No executable geometry/interaction evidence | **Independent QA tester** after E-01/E-02 | Unedited screenshots and DOM `boundingClientRect`, `scrollWidth/clientWidth`, CSS computed font/colors, focus/disabled, viewport/device scale, locale/theme and test steps/outcome linked to exact SHA for each V01/02/03/05. |
| E-04: No physical Safari proof | **QA/device tester** with PM-approved device access | Real iPhone Safari model/iOS/browser, safe-area, keyboard, zoom/dynamic text, touch screenshots and source/session receipt. |
| E-05: Misstated screenshot checksum provenance | **Original designer/evidence custodian** | Per-image true SHA-256 and current-source execution provenance or corrected handoff statement, separately authorized docs-only follow-up. |
| E-06: Source-level 3.072:1 contrast exception | **PM → owner** | Explicit acknowledgement/decision if accessibility remediation is contemplated. **Do not change approved colors/text/size autonomously.** |

**Safety stop:** Any path requiring production authentication, live customer accounts, real API/DB/SQL/Cloudflare writes, permissions or access setting changes is outside this assignment and requires separate owner instruction. No hosting, deployment, code change, package install or unapproved repair.

## 8. Final independent verdict and manager handoff

- **Designer Stage4 credibility:** **ACCEPTED FOR SOURCE INVENTORY/CONSERVATIVE LIMITS**, **PARTIAL FOR OVERALL UI QA**. Independently reproduced 10 source predicates, 37-route count, locale-key comparison and contrast. Identified two reporting precision faults: unsupported screenshot-SHA256 claim in `metrics.json`, and unlabeled 17 operational + 4 review route composition.
- **Source-level design issues:** known approved small-label WCAG AA normal-text shortfall **P2**; generic TG `common` fallback strings **P3 SOURCE-ONLY / visual unproven**. Documentation/evidence problems P3.
- **Runtime UI defects:** **NONE independently reproduced**. Absence of tests is not evidence of absence of defects.
- **E2E acceptance:** **BLOCKED/UNTESTED**; **0/21 Admin, 0/4 app journeys, 0/36 per route**. No newly acquired screenshot, DOM test, or real Safari evidence.
- **UX-02:** V01 PARTIAL; V02 PARTIAL + contrast criterion FAIL; V03 PARTIAL; **V04 APPROVED/PRESERVED**; V05 PARTIAL.
- **Decision:** **STAGE5 PARTIAL — independent source audit complete, executable UI QA BLOCKED; QA CLOSE NO-GO; PHASE2 NO-GO.** Return to PM/Master; do not assign remediation as already authorized and do not start fixes.

**Issue linkage:** [#31](https://github.com/merapplications-sketch/Talabat-v3/issues/31) (this audit) and [#26](https://github.com/merapplications-sketch/Talabat-v3/issues/26) (master consolidation).  
**Branch:** `review/qa-first-independent-ux-stage5-20261113`; this report is the only intended difference against the exact pinned candidate `254757fab9d5fa80bffe22fa30de5e65aac2f153`.

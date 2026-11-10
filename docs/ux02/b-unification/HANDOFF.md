# UX-02 — approved decisions implementation checkpoint

Status: PARTIAL IMPLEMENTATION / NOT ACCEPTED. Owner's settled decisions remain locked; no repeat approval requested for colors, A metrics, B analytics, compact explicit details or native React architecture.

Repository: merapplications-sketch/talabot-tailadmin-review
Branch: review/ux02-native-unified-20261110

## Recoverable checkpoints
- bf93ecfe8b44b2a91de568466b9d73273fb173cf: B cards/buttons/fields/forms/confirmation, saved and fetched remotely.
- 50c45a1fc5d24cd75b21a6b9213326b0e443eb75: B tables/filters/MetricCard/status/Accordion, saved and fetched remotely.
- Commit containing this document: existing phone/map targets in B icon controls and explicit unavailable-assignment reasons, group4 evidence.
Local Git history differs from connector-created remote commits. No force/reset/clean used. Use GitHub branch head and file contents for recovery, not equivalence of local/remote SHA.

## Component map
| D element | B source used |
|---|---|
| Shell | native/b-shell copies of AdminLayout/AppSidebar/AppHeader, original SidebarProvider/SidebarInset/Sheet |
| Shared cards | ui/card Card/Header/Title/Content |
| Buttons/actions | ui/button Button, original icon-lg/outline variants |
| Forms | ui/field, input, textarea, select, checkbox, file-input |
| Confirmations | ui/dialog |
| Lists | ui/table; TableOne/row class patterns preserved |
| A metrics | main/dashboard/ecommerce/metrics/metric-card |
| Order status | talabot/integrated-review/order-status, unchanged |
| Secondary detail | ui/accordion, closed initially |
| Telephone/map | icons CallIcon/MapIcon; B Button render-anchor pattern |
| Analytics | original analytics.tsx and analytics-data.ts, untouched |

## Evidence and coverage
Group2/3/4 reports distinguish actual browser interactions from source protection and builds. coverage-37.json/md updated for observed changes; no blanket PASS. Prior48 unaffected checks preserved;17 affected operation checks passed in group2. Build and TypeScript pass per group; current lint0errors/47warnings (41unused,4image,1anonymous export,1Next-location).
One root, one nav, zeroiframe, fivecharts, no document overflow at actual1363px.12-section smoke, search/back, errors, payment filter, wallet draft and confirmation, select, locale/theme switching, selected analytics interactions observed.
320/390/1440 and physical Safari NOT TESTED. EN/RU/TG switching works; TG operational strings still RU fallback. No full locale/theme matrix claim.

## Stages and remaining work
0–1: saved architecture and native vertical slice; not full app acceptance.
2: order journey partial; preserved financial distinctions/events/chat, explicit detail and search/back tested. Assignment success/conflict/permission scenarios incomplete.
3–4: native controls unified in existing screens; remaining functions, uploads, geography, staff edits and37/124/179/50 correspondence incomplete.
5: original B analytics retained; notifications/settings not migrated completely.
6: partial QA only, mobile sizes and physical Safari open.

## Specific unresolved boundaries
- Geographic coordinate picker: B vector-map example does not establish a suitable original component for A point editing. Do not invent UI; record BLOCKED — DESIGN DECISION REQUIRED for this element only.
- Images: B FileInput exists, but original upload/preview/storage/error journey has not been transferred; this is remaining implementation, not permission to omit it.
- Wallet adjustment: original cuWal calls walletAdjust without confirmation. Native currently retains that behavior with PREVIEW rejection. Do not invent financial rules or claim financial acceptance.
- Header controls look cramped at1363; no arbitrary new width/position introduced. Keep this documented visual gap.
- Native generic sample actions must not be represented as server success or RBAC proof.

## Resume
Continue from this remote checkpoint. Complete source-mapped functions independently of geographic-picker decision; keep B components and closed default details. Resolve existing image/owner/staff/support contracts from frozen A before implementing their remaining behavior. Test only affected journeys and remote-checkpoint each group. Finish responsive/locale/analytics parity before final acceptance.
A/B/C/D2/production not changed; no main merge; original HTML/core retained as separate reference, never executed by native React. Inherited native .openai/hosting.json points D2 and MUST NOT be used to deploy. Any review hosting must be a new independent project with explicit partial status until complete.

# D01–D14 — Isolated visual decision gallery

**REVIEW ONLY — NO OPTION APPROVED.** This is a separate Vite entry and isolated Site, not a change to running D. Branch `review/ux02-decisions-gallery-20261110`. Base remote D: `1ed0d519a558c1254dc1bd8da40630cb7caab949`.

## Scope and limitations
All decision cards contain the original A function/location, proposed B location, two alternatives and accessibility/space effects from the saved decision report. The rendered alternatives are B component compositions for owner review; they are not completed A business journeys or server parity tests. UI primitives are imported from B. No new CSS file or inline styles, no iframe, no backend. Three grid class strings are reused verbatim from existing B composition patterns; no new sizing system. B shell is the isolated source adaptation already documented, not a second application.

Arabic decision guidance; EN/RU/TG gallery controls and existing B analytics translations. Some sample values/actions remain English, explicitly disclosed. No claim of complete localization. Data and financial outcomes are invented demonstration state. Call/location buttons open a simulation notice, not a phone call/location request. Full live map, media upload and operational permission/financial enforcement are NOT represented.

## Actual components
B `ui`: Card/Header/Title/Description/Content/Footer, Button, Field/FieldLabel/FieldDescription/FieldGroup, Input, Textarea, Select/Trigger/Value/Content/Item, Tabs/List/Trigger/Content, Dialog/Content/Header/Title/Description/Footer, Table/Header/Body/Row/Cell, Alert/Title/Description, Badge, ScrollArea, TooltipProvider, SidebarProvider/SidebarInset/Sheet through B shell.
B `main/dashboard/ecommerce/metrics/metric-card.tsx`: MetricCard.
B `talabot/analytics.tsx`: unchanged AnalyticsDashboard; all charts/tables/filters retained. B `analytics-data.ts` unchanged.
B icons: Call, Pencil, ChevronRight, Map, Chat, Search, Filter, Box, ArrowLeft, Bell, List. No new icons drawn.

## Rendered comparison
| ID | Option 1 | Option 2 | Limits |
|---|---|---|---|
| D01 | B Input in order Table | Same search state in B Header + order Input | In option1 header search disabled, not a fake independent search |
| D02 | B Field/Select controls in page | Same controls inside B Dialog | Not a final settings route decision |
| D03 | Alert entries shown in Card | Entries opened in Dialog | Synthetic events; not production notification delivery |
| D04 | Details/timeline/payment/chat visible | Secondary sections in B Tabs | Order examples only |
| D05 | Payment/collection/settlement separate table rows | Same table inside Dialog | No accounting formulas or settlement mutation |
| D06 | Assignment from order detail | Assignment from order row | One synthetic eligible courier; not contract/RBAC proof |
| D07 | Wallet after customer summary, history visible | Wallet stays visible; secondary history in Tabs | Local confirmation only |
| D08 | Cash/limit/action visible | Actions inside B Dialog | No live map or cash receipt |
| D09 | Approval in visible merchant card | Merchant details opened before approval | Ownership/images/full merchant forms are not represented |
| D10 | Decision form in page | Decision form in Dialog | Example refund room text only; not server refund validation |
| D11 | Editor in page | Editor in Dialog | Generic position example across 6 categories, NOT full field coverage |
| D12 | Original MetricCard for A metrics | Original Card without custom styling | A metrics stay first; B metrics separate after complete analytics |
| D13 | B icon buttons with accessible names | Same icons with visible text | No standalone Wallet icon; text button. MapIcon original, not new pin |
| D14 | B Sidebar/Sheet for navigation | NOT REPRESENTED notice | Bottom-bar destinations unresolved; no invented bar |

## Executed checks
- TypeScript and gallery build: PASS (logs included); chunk-size warning retained.
- Gallery lint: 0 errors, 1 no-img-element warning for approved local logo; no rule disabled. This is gallery-only lint, not full-repo historical warning count.
- Browser desktop1363×936: no document horizontal overflow, no iframe.
- All14 decision Option2 panels inspected and text recorded in evidence/options.json; this is panel existence/navigation evidence, not all interactions.
- Search ord1 → details → Back retained query.
- Wallet form → confirmation → cancel; close and reopen preserved reason; confirmed simulation displayed no-request notice.
- Assignment from row opened B Dialog with synthetic courier.
- Full five B charts rendered in observed desktop DOM, tables retained.
- Language/Theme controls render, but interaction selection was not successfully verified in shared-browser session; NOT VERIFIED.
- 320/390/1440 and mobile screenshots: NOT TESTED / NOT CAPTURED. Native window-control attempt failed with AT-SPI provider unavailable. Prior environment DevTools restrictions not bypassed.
- Physical iPhone Safari: NOT TESTED. The public HTTPS site is intended for owner Safari review; do not claim proven Safari compatibility.
- Desktop screenshot included; there is no fabricated mobile screenshot.

## Preservation
No edits under src/ for gallery implementation: protected D source, B primitives, analytics, domain/contracts/permissions and A/B/C/D2 are unchanged. Separate `gallery/` entry, build config, package dev script, type alias and new Site identity only. The D worktree remains on its prior branch. No main merge, no production application publication. Publishing this independent gallery does not approve or apply any decision.

## Resume
Use this branch's verified remote head; `gallery/main.tsx`, `gallery/decisions.json`, `gallery/shell/`. Complete mobile capture, language/theme selection, remaining action/filter scenarios and per-option screenshots before claiming full review QA. Await owner option choices before applying anything to D.

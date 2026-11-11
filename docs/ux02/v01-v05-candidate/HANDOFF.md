# UX-02 V01–V05 — candidate for owner review

Base branch: review/ux02-owner-refinement-20261111
Base HEAD: d7dfb2dd70d80a3ab7c63e970ba53e8f74ad3f70
Base executable: 64e4f1178c341ab475a46245b8537993cb3cf4e3
Candidate branch: review/ux02-v01-v05-candidate-20261112
Preview: https://talabot-ux02-v01-v05-review.alwarikahtan.chatgpt.site/
Status: isolated candidate, NOT approved or merged. Old Admin and customer production unchanged.

| Item | Candidate change | Evidence |
|---|---|---|
| V01 | B two-line bounded restaurant/driver identities; route minimum width prevents displaced wrapping. Full names retained in details and title. Existing horizontal table scrolling retained. | Same 7 saved orders, EN, 1363×936: before 304.5–305px; after 116.5–133px. |
| V02 | Only notification detail links and mark-read button. Light links brand-700; dark links existing B brand-400; mark-read background brand-700 both themes. No logo/base token/global button changes. | White versus brand-500 3.07:1; white versus brand-700 5.00:1. Dark brand-400 versus #222 7.19:1. Before/after same data, size and themes. Pending owner visual approval. |
| V03 | B buttonVariants ghost/lg and Button lg on notification detail/mark-read actions. | List detail target 74.36×18px before, 114.97×44px after. Mark-read 44px tall, click changes to disabled Read in sample. |
| V04 | Existing formatDate renders scheduled_for using current locale/timezone. | ord0 raw 2026-11-10T15:00:00.000Z unchanged; EN UI Nov 10, 2026, 20:00. |
| V05 | Explicit notification/order and merchant headings; driver name/status/phone/last activity/cash headings through workspace EN/RU/TG. | Browser verified EN/RU/TG headings; fixes TG fallback in affected driver columns only. |

## Tests
- Native build PASS (existing chunk-size warning).
- TypeScript noEmit PASS.
- Existing 5 format checks PASS.
- Existing 17 native operation/contract checks PASS; 37 mutation methods retained, no production transport.
- Browser Chrome 1363×936: Light/Dark, notification opening/closing and mark-read; order details/back; full merchant/driver text; scheduled date; affected column translations.
- 320, 390, 1440: NOT TESTED. Actual Safari/iPhone: NOT TESTED.
- No claim of 37 end-to-end functions or server permissions tested.

## Files
- src/components/talabot/native/b-shell/list-patterns.tsx
- src/components/talabot/native/entity-sections.tsx
- src/components/talabot/native/order-details.tsx
- src/components/talabot/workspace.tsx
- src/messages/{en,ru,tg}.json
- This handoff and evidence files.

Local build uses recovered installed dependencies/configuration; canonical package/lock/tsconfig were not changed. Source recovery compared 544 relevant source/assets with remote Git blob hashes. Only seven implementation files are submitted.

## Resume
Owner reviews V02 and candidate screenshots. Do not merge or update current Admin. Any remaining audit issue needs a separate scoped follow-up. No FP16 or policy/data changes.

# Focused owner corrections — isolated preview v2

- Canonical executable source: `64e4f1178c341ab475a46245b8537993cb3cf4e3`.
- Parent: `91ac107c125998dcd1998147b845ec511a1f6b46`.
- Branch: `review/ux02-owner-refinement-20261111`.
- Preview: https://talabot-ux02-refined-review.alwarikahtan.chatgpt.site/?section=ratings
- Site: `appgprj_6af4b9697dc88191a4992df2cc6c89d7`; version **2**.
- Version ID: `appgprj_6af4b9697dc88191a4992df2cc6c89d7~appgver_41c599a065f88191924d8be004bee970`.
- Artifact commit: `83432b2f60e01db5f645b64c29b2d75b0ae1f814`.
- Archive SHA256: `44cbfaa55243f42e723882c8d4f3db2f6012a167cde593ac202f2911734ec7be`.
- Deployment: `appgdep_6af4c6caac0c8191b416dfc59e3bc2f4`, succeeded.
- Live DOM loaded `/assets/index-BpZSgN4q.js`, matching the saved build. `SOURCE.json` carries the canonical commit and tree.

## Bounded verification

| Correction | Observed evidence |
|---|---|
| Support detail controls | Phone/call and linked order have 12 px separation, no rectangle overlap. Linked order opens ord1 and Back returns to support t1. No call placed or support decision submitted. |
| Edit pencil | NativeForm trigger has 0 px border, border-style none, box-shadow none and 44×44 px touch target. Orange retained. |
| Ratings cards | All four are buttons. Courier selects Courier scope; Store selects Restaurant scope; Total shows 11 rows; Need attention shows only ord4. Opening details and Back retains that scope. |
| Five stars | Live ord4 restaurant: 5 SVG stars / 3 yellow; courier: 5 / 4 yellow. Detail scores match list. Summary averages unchanged. |
| Search/select focus | List search and merchant search: outline-style none, colored ring spread 0 px, neutral group border rgb(212,212,212). Language selector: outline-style none, blue ring spread 0 px, neutral border. Ordinary neutral field boundary retained. |

Local: TypeScript PASS; native build PASS; 17 list journeys PASS; 7 composition SSR PASS; 7 owner refinement checks PASS; star rendering tested for scores 0–5 plus missing/invalid. SSR icons stubbed, not visual proof.

Browser: **Chrome 1363×936 actually tested**. **320 / 390 / 1440 / real Safari: NOT TESTED.** Supported browser API exposes no viewport emulation. Existing managed local preview belonged to another project and was not replaced; browser checks used this authorized isolated deployment. Owner's supplied iPhone images were the defect references, not evidence of a post-fix Safari run.

Screenshots: `focused-evidence/ratings-before.jpg` (v1 desktop), `ratings-after.jpg`, `details-after.jpg`, `settings-after.jpg` (v2 desktop). No screenshot is labeled as an iPhone test.

Scope: only the five latest requests. No production or older preview deployment, main merge, permission change, financial mutation, rule change or FP16. Existing 37-function acceptance is not upgraded by these focused tests.

Stop: await owner visual review of v2. Resume from the latest canonical branch HEAD; a later documentation-only commit is not a new executable source.

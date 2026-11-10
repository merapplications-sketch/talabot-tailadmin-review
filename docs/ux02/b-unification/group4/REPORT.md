# UX-02 — operation context and icon actions

PARTIAL IMPLEMENTATION. Original B CallIcon/MapIcon and Button render-anchor pattern (from B profile social-links) now used for existing telephone/map targets. Phone text retained,44×44 icon actions, accessible names include target number. Targets unchanged; no calls placed and no external maps opened by QA.

Assignment unavailable reason now comes from the existing canAssign predicate: already assigned, or status outside preparing/ready. No new stage, permission or mutation. This is limited task context, not full Transcom acceptance.

Shared Chromium checks:
- ord1 explicitly reports already-assigned reason.
- Three telephone controls are anchors with original synthetic tel targets, accessible labels and44×44 dimensions.
- On map preserves https://www.google.com/maps?q=38.56,68.78.
- B analytics controls exercised: last7days, merchant-sales metric, merchant ranking, Monday hourly heading, quality by delivery area, custom period invalid rejection then valid2026-11-01..2026-11-02 yielding merchant-sales19,084 and previous12,631.
- Initial date fill through the browser tool changed DOM value without React state; keyboard date editing updated both value and React-backed attribute, and original submit/validation worked. No analytics fix made. Do not report the tool's first fill attempt as an app defect or successful validation.

Build/TypeScript/Lint results are sibling logs.47 warnings, zero errors; no lint rules disabled. Previous source-level cases unchanged; no repeated unrelated tests. NativeForm and domain contracts untouched in this group.

Not complete: B notifications/settings migration; image upload/preview; geographic picker/map; item/branch/working-hour administration; all permissions and concurrency/error journeys; complete37/124/179/50 parity. Phone viewport sizes and physical Safari remain NOT TESTED.

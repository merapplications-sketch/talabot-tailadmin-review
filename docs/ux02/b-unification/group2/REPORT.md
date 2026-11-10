# UX-02 approved lock — B component group 2

Status: PARTIAL IMPLEMENTATION. No deployment, no acceptance claim.
Base remote: 1ed0d519a558c1254dc1bd8da40630cb7caab949.
Owner's latest execution directive supersedes the blanket D01–D14 decision pause. Settled decisions are not reopened.

## Implemented
- Shared Card now uses original B Card/CardHeader/CardTitle/CardContent.
- Action and native action buttons use original B Button; clear phone/edit/details/search/chat actions use its icon-lg variant with accessible names.
- NativeForm uses B Field/FieldGroup/Input/Textarea/Select/Checkbox/FileInput/FieldError and Dialog confirmation. Existing keys, constraints, draft storage, validators and operations retained.
- Forms closed initially, opened explicitly with B Pencil action. Existing identity fields name/title/code/phone/address remain visible read-only. Submit uses B horizontal Field; no custom CSS.
- Source formatting expanded for review. Misplaced use-client expressions corrected, no lint rules disabled.

## Browser observations (shared Chromium, 1363px)
1. Customer detail: wallet balance visible, editing forms closed initially.
2. Wallet edit amount10 and reason Synthetic QA correction: isolated-write error, balance50 unchanged.
3. Suspend form: explicit Save opens B Dialog with original confirmation; Close retains input.
4. Back to customer list then details and reopen wallet: amount10/reason restored.
5. Store edit: original identity visible, form explicit; Category Select changed Restaurants→Groceries, retained after close/reopen.
6. DOM: one root, no iframe, no document overflow at observed1363px.
Screenshot customer.png captures the intermediate form before final horizontal-submit alignment; not a final-design approval.

## Validation and limits
Build, TypeScript and lint results in sibling logs. 17 affected operation checks rerun because their action controls changed; all pass. Prior unrelated48 checks not rerun.
protection.json verifies untouched domain/navigation/fields/client mutations/payload allowlists/validators/analytics source. This is not complete37-item functional acceptance.
320/390/1440, EN/RU/TG matrix, theme matrix, physical Safari: NOT TESTED for this group.
Existing wallet correction lacks a confirmation prop in native source; compare original A before changing behavior. Image selection remains explicitly blocked; no upload success simulated.
Manual Pair, list layouts/filter selects, status rendering, location/wallet icons, operation details remain for following groups. Core native migration stages2–5 and QA6 remain partial. Preserve all reference source and evidence.

# TALABOT Admin — programmer coordination register

Status: design/data-contract inventory only. No operational integration, schema migration, financial action, or business rule approved by this document. Existing production/security work remains separate. Reference UI: ed5e33af0f4f1d9b5d4a54c25444a2e8b5916395.

| Domain | UI/data needs to confirm with programmer | Blocking definitions / acceptance |
|---|---|---|
| Banners | Existing campaign ID, localized copy/image and alt text, destination type/ID, existing publication visibility and schedule, timezone, approved asset origin | Confirm existing placement/order, supported dimensions, schedule semantics and permissions. No new campaign scheduling rule or upload implementation. Preview must distinguish missing fields. |
| Offers | Existing offer/product/merchant IDs, translated title, authoritative price/display calculation, validity, eligibility and existing state vocabulary | Programmer provides actual contract and supported actions; no invented discount stacking, quotas, auto offers or eligibility. UI never calculates a payable total independently. |
| Points | Authoritative balance and ledger, transaction/order reference, timestamps, reason labels, existing expiration/reversal semantics | No assumed cash conversion (including 1000=10), issuance/redemption/expiration rules. Need approved source and permission boundary before design of actions. |
| Refunds | Original payment/order reference, actual refund record, amounts/currency, status vocabulary, reason/audit evidence, provider reference if applicable | Distinguish cancellation, refund, cash return and open claim. No assumed entitlement, settlement, automatic refund or editable balance. Read-only examples until actual contract approved. |
| Accounting | Separate merchant sales, platform revenue, recorded expenses, completeness flag, existing ledger/source references and reconciliation data | Profit remains unavailable when expense coverage is incomplete. No invented commissions, liabilities, settlement formulas or account access. Confirm definition/version and authorized server response. |
| Cross-domain | Stable IDs linking orders/entities; monetary units/rounding; Dushanbe timestamps; locale fallback; query/sort/page contract; empty/error/loading shapes; permission flags backed by server enforcement | Need versioned schemas or examples from actual source. Existing synthetic fixtures are not an API contract. Never infer operational status from mock data. |

## Requested programmer handoff (single bundle)

Provide read-only paths/commit for existing models and APIs; request/response examples with synthetic values; actual enums; financial definitions and units; permission matrix; existing pagination/filter/sort behavior; relevant test references. List unavailable capabilities explicitly. No secrets or real customer records.

## Coordination state

This register is saved on the shared review branch for programmer review. It is not evidence of programmer acceptance or a message delivered to another conversation. No reliable recipient/thread endpoint was supplied here. Review of responses can proceed independently of visual approval; integration or business-rule changes require their own authorization.

## Decisions preserved

Current admin preview uses synthetic data only. Original pages and approved statistics stay unchanged. The image gallery does not approve visual models. Human Tajik review and deferred owner Safari checks stay open. Missing operational definitions must not be resolved by assumption.

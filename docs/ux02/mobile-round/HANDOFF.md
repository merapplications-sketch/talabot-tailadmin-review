# Mobile corrections — 11 November 2026

Baseline source93f522422722103c32d075c219674714a93eb14d; baseline evidence HEAD6cb11a822db57b65252bc6615341d66441f381fb verified unchanged remotely.
Branch review/ux02-mobile-round-20261111. New Site appgprj_6af46bae3784819199ee675d8335f5cc. Prior previews preserved.

## Owner image review (seven supplied iPhone images)
Observed: tall order cards with a dedicated chevron footer; separate spacious contact cards; untranslated ySub_call; nested driver/customer card frames; verbose operational rules; restaurant/item ranking columns outside visible mobile area. Share / Describe edits bars are hosting viewer chrome, not application components. No claim that these photos constitute an after-test.

## Changes
- Home: all four indicators, six shortcuts, charts retained; compact indicator type/padding and shortcut gaps. Existing B Accordion exposes scope/calculation text on demand; visible demo label retained.
- Rankings: wrapping full entity names; completed count and saved sales below restaurant name, quantity below item/store. No truncation and no horizontal table required. Original grouping/sorting/calculations unchanged.
- Orders: chevron joins status header, removes empty footer; concise date without repeated entity type; compact party/address rows. Driver name retained; redundant driver avatar removed in phone card only. All values/filter controls remain.
- Details/general B cards use original small size and shorter gaps. Contact label/name adjacent with existing green call action. Orange journey, invoice, map, chat preserved.
- Entity list outer frame limited to desktop, eliminating double card on mobile for customers/drivers/stores and other original grid consumers. Detail action joins identity header. Muted labels/prominent values.
- Header icon controls use original44px B variant. No logo, sticky positioning or scroll restoration changes.
- Missing call substitution gets EN/RU/TG translation.
- Financial semantics: wallet_used remains unchanged; label now Wallet amount · saved record. It is not inferred cash collection or proof of settlement. Cash continues to display cash_collected under original delivered-state guard; online method wording no longer labels an unknown payment result Money received. Commission/tip explanatory status is smaller muted text, values unchanged.

## Validation
Build and TypeScript PASS. Eight inherited affected test files PASS. Added SSR regression checks: missing call translation, saved wallet label, actual cash_collected field, invoice values, journey and tel retained PASS.
No packages, stylesheets, calculation files, permissions, server contracts or ranking data changed.
320/390/1440: NOT TESTED. Safari/iPhone after correction: NOT TESTED. Screenshot after: NOT AVAILABLE.
Managed preview start rejected because another preview holds the shared daemon. No active preview stopped, no alternative browser-control infrastructure or viewport workaround used. Build/SSR is not mobile verification. Owner photos serve before evidence only.

## Protection and resume
Home/Orders/Reports remain independent. A functions and full B reports retained. FP16 not started. Previous matrix37 evidence levels unchanged; no new full certification. Old previews/main/production unchanged.
Resume at owner review of new isolated mobile candidate. Browser/mobile verification and matched before/after captures remain open. Do not merge or claim visual acceptance.

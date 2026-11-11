# Approved Home / Orders separation

Baseline: source48592032, evidence3dd3edfe, published D version11 retained unchanged.
Branch: review/ux02-home-orders-20261111. A separate Site is required.

1. Preserve the v11 list/detail components and protected modules. Move the full list to Orders only; Home becomes the default route. Keep full B analytics on Reports.
2. Compose Home from B SummaryCards, Card, Table, Button, operational alerts and the existing B analytics period control. No new CSS/theme/widget system.
3. Use the saved native fixture for both Home rankings: delivered, nonhistorical, latest-loaded scope, Dushanbe creation date within the chosen period. Restaurant order count and saved total value are separate. Item ranking sums order_items.qty by store_id + item_id. Explicit synthetic/incomplete sample labels; no backend financial rule changes. B analytics dataset and formulas remain separate and intact.
4. Preserve query/status/secondary filters/sort/detail return/scroll, including leaving Orders for Home and returning through navigation. Add affected data/navigation/render checks and browser evidence at the actual available viewport only.
5. Publish only the new isolated Site. Save source, evidence, ranking definitions, matrix37 impact and handoff; stop for owner visual approval. Phone/Safari remain NOT TESTED unless actually exercised.

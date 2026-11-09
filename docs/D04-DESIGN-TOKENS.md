# D-04 shared design tokens

Owner amendment: orange is frozen to D-03. #F27645 is cancelled, not used in application source. The original logo is not modified.

| Role | Light | Dark | Source / use |
|---|---|---|---|
| Primary action | #F36831 | #F36831 | Existing `--color-brand-500`; derivatives unchanged in globals.css |
| Selected item | Existing brand-50 / brand-600 | Existing brand-500/15 / brand-400 | Existing selection classes retained |
| Page | #F7F7F7 | #171717 | `--tp-bg` |
| Card | #FFFFFF | #222222 | `--tp-surface` |
| Primary text | #262626 | #F5F5F5 | `--tp-text` |
| Secondary text | #666666 | #B5B5B5 | `--tp-muted` |
| Border | #E5E5E5 | #404040 | `--tp-border` |
| Pending background/text | #FFFAEB / #93370D | #362A13 / #FEC84B | `--tp-pending-bg/text` |
| Preparing background/text | #FFF0E8 / #B54708 | #38251C / #FFAB85 | `--tp-preparing-bg/text`; unchanged orange values |
| Picked-up/in-transit background/text | #F4EBFF / #6941C6 | #302044 / #D6BBFB | `--tp-transit-bg/text`; existing pickedup state only |
| Delivered background/text | #ECFDF3 / #067647 | #123027 / #75E0A7 | `--tp-success-bg/text` |
| Cancelled/rejected background/text | #FEF3F2 / #B42318 | #3B1D1B / #FDA29B | `--tp-error-bg/text` |
| Neutral background/text | #F2F2F2 / #666666 | #2C2C2C / #B5B5B5 | `--tp-neutral-bg/text`; confirmed/ready keep neutral semantics |

No new approval, connectivity or cash-limit status is invented. Existing state labels and icon family remain. Cards, radii, font, image dimensions and navigation order remain D-03. Blue/navy UI mappings remain neutral/orange; logo exception retained.

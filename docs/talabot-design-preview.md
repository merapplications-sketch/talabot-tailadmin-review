# TALABOT design preview — 2026-11-09

Base: 2151b9d061e5aa5f5bd55683fe527cccdb5d786b.
Scope: independent review/cloudflare-vinext, talabot-tailadmin-review only.

## Approved identity
Original TALABOT_A_English_Transparent_4x(1).png copied byte-for-byte to
public/images/logo/talabot-original.png. Original dimensions 2404×504.
SHA256 febf5356391e813b9abd549c67e4996aee93bdc63b2139098fdc8baa24ba9367.
Logo colors/aspect retained; neutral light backing in dark mode keeps its dark
wordmark legible. No duplicate wordmark.
UI brand #F36831 comes directly from the owner's approved instruction. Brand
shades derived for existing hover/background states. Semantic colors retained.

## Preview behavior
Four synthetic summary cards (24/12/18/3782), two per row on phones, four on wide
desktop. No comparison percentages. Needs attention precedes the original charts.
Attention and notifications are explicitly illustrative delivery/cancellation
examples, not production rules, timers, or automatic administrative intervention.
All charts and template tables remain sample data; no real financial data.

Missing TALABOT destinations open a translated preparation dialog. No new detail
pages or backend links. Existing template examples including Calendar retained.
Mobile Home/Orders/Notifications/Finance navigation respects safe areas, hides
during editable focus, dialogs/menus and mobile sidebar. Desktop sidebar retained.
Finance uses an explicitly synthetic permitted design persona, not a real account.
A canViewFinance=false prop removes it and flex distributes the other three links.
There is no implemented financial route, API, server permission, or account change.
Real integration must independently protect server routes and data.

English/Russian/Tajik, all LTR. Supported browser locale selected through next-intl,
manual selection persists in NEXT_LOCALE (one year), unsupported languages use en.
Changed dashboard/navigation/notification strings translated. Some preserved
template-example pages still contain English. Tajik needs native language review.

## Verification before commit
- vinext production build: passed.
- next typegen + tsc --noEmit: passed.
- ESLint affected TS/TSX: passed; git diff --check passed.
- Chromium 134 responsive/light/dark: 430×932, 320×640, 932×430,
  844×300, 1440×1000. Equal summary columns, no horizontal overflow.
- Summary/attention/missing destination and sidebar interactions; bottom navigation
  hidden in dialogs; actual theme toggle used for screenshots.
- Browser ru-RU/tg-TJ detection, fr-FR fallback; manual Russian survives reload and
  saved English overrides Russian browser preference.
- Editable input focus hides mobile navigation; blur restores; non-home routes
  do not mark Home selected.
- Notification regression: five rotation/short-height cases, touch scrolling to
  last complete item, geometric overlap guard and negative control, close focus
  restoration, zero page errors. Test selectors distinguish header Notifications
  from newly added bottom navigation.
These are browser automation/emulation tests, not actual Safari or iOS keyboard tests.
Owner Safari confirmation of notification scroll/clipping remains open.

No dependencies, lockfile, operational applications, main, payment services,
production data, authentication, or MFA changed. Image optimization is out of scope.

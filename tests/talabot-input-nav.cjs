const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch({
    executablePath:
      "/root/.cache/ms-playwright/chromium_headless_shell-1161/chrome-linux/headless_shell",
    ...(process.env.REMOTE
      ? { proxy: { server: process.env.HTTPS_PROXY } }
      : {}),
  });
  const p = await b.newPage({
    viewport: { width: 430, height: 932 },
    isMobile: true,
    hasTouch: true,
  });
  await p.goto(process.env.BASE_URL + "/form-elements", {
    waitUntil: "networkidle",
  });
  const nav = p.locator("[data-testid=mobile-navigation]");
  assert(await nav.isVisible());
  const input = p
    .locator("input:not([type=hidden])")
    .filter({ visible: true })
    .first();
  await input.focus();
  await p.waitForTimeout(100);
  assert.equal(await nav.count(), 0);
  await input.blur();
  await nav.waitFor({ state: "visible" });
  assert.equal(await nav.locator("[aria-current=page]").count(), 0);
  await b.close();
  console.log(
    "input focus hides bottom navigation; blur restores it; non-home not marked selected",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

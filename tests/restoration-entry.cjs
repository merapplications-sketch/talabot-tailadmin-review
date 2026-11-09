const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch({
    ...(process.env.REMOTE
      ? { proxy: { server: process.env.HTTPS_PROXY } }
      : {}),
    executablePath:
      "/root/.cache/ms-playwright/chromium_headless_shell-1161/chrome-linux/headless_shell",
  });
  const c = await b.newContext({
    viewport: { width: 390, height: 844 },
    locale: "en-US",
    isMobile: true,
    hasTouch: true,
  });
  await c.addInitScript(() => localStorage.setItem("theme-mode", "light"));
  const p = await c.newPage();
  const base = process.env.BASE_URL;
  for (const locale of ["en", "ru", "tg"]) {
    await p.goto(`${base}/${locale}/operations-review?section=finance`, {
      waitUntil: "networkidle",
    });
    await p.locator("[data-testid=summary-cards]").waitFor();
    assert(!p.url().includes("operations-review"));
    assert.equal(await p.locator(".op-main").count(), 0);
    assert.equal(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
  }
  await c.clearCookies();
  await p.goto(base + "/", { waitUntil: "networkidle" });
  await p.locator("[data-testid=summary-cards]").waitFor();
  await p.screenshot({
    path: process.env.RESTORE_CAPTURE || "public/restoration-review/after.png",
  });
  await p.goto(base + "/review/operations", { waitUntil: "networkidle" });
  await p.locator(".op-main").waitFor();
  assert.equal(await p.locator("[data-testid=summary-cards]").count(), 0);
  console.log(
    "PASS original entry EN/RU/TG, mobile overflow, isolated prototypes",
  );
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

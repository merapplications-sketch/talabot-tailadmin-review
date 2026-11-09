const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
  const browser = await chromium.launch({
    executablePath:
      "/root/.cache/ms-playwright/chromium_headless_shell-1161/chrome-linux/headless_shell",
    ...(process.env.REMOTE
      ? { proxy: { server: process.env.HTTPS_PROXY } }
      : {}),
  });
  const page = await browser.newPage();
  const base = process.env.BASE_URL || "http://127.0.0.1:3001";
  const out = "qa/visual-review";
  fs.mkdirSync(out, { recursive: true });
  const errors = [],
    failed = [],
    checks = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error" && !m.text().includes("ERR_INVALID_URL"))
      errors.push(m.text());
  });
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push([r.status(), r.url()]);
  });
  async function goto(path) {
    await page.goto(base + path, { waitUntil: "networkidle" });
    await page.locator(".vr-main[aria-busy=false]").waitFor();
  }
  if (!process.env.SKIP_MATRIX)
    for (const locale of ["en", "ru", "tg"])
      for (const [width, height] of [
        [320, 640],
        [390, 844],
        [932, 320],
        [1440, 1000],
      ]) {
        await page.setViewportSize({ width, height });
        for (const tab of ["orders", "accounts", "notifications", "metrics"]) {
          await goto(`/${locale}/visual-review?tab=${tab}`);
          assert(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth + 1,
            ),
            `overflow ${locale} ${width} ${tab}`,
          );
          assert(
            !/MISSING_MESSAGE|talabotOrders\.|workspace\./.test(
              await page.locator(".vr").innerText(),
            ),
            "translations",
          );
          const small = await page
            .locator(".vr input,.vr select")
            .evaluateAll((es) =>
              es.some((e) => parseFloat(getComputedStyle(e).fontSize) < 16),
            );
          assert(!small, "input font");
          if (tab === "accounts") {
            await page.waitForFunction(
              () =>
                document.querySelectorAll(".vr-avatar[data-fallback=true]")
                  .length >= 2,
            );
            assert.equal(
              await page.locator(".vr-avatar[data-fallback=true]").count(),
              2,
            );
            assert.equal(
              await page
                .locator(".vr-avatar img")
                .evaluateAll(
                  (es) =>
                    es.filter((e) => !e.complete || !e.naturalWidth).length,
                ),
              0,
            );
          }
          checks.push({ locale, width, height, tab });
          fs.writeFileSync(
            out + "/matrix.json",
            JSON.stringify(checks, null, 2),
          );
        }
      }
  await page.setViewportSize({ width: 390, height: 844 });
  await goto("/en/visual-review");
  await page.getByRole("searchbox").fill("DEMO-1104");
  await page.getByRole("button", { name: "Delivered", exact: true }).click();
  assert.equal(await page.locator(".vr-order").count(), 1);
  assert.equal(await page.getByRole("status").innerText(), "1 order");
  await page.locator(".vr-order .vr-link").click();
  await page.waitForURL("**/orders/DEMO-1104");
  await page.goBack({ waitUntil: "networkidle" });
  assert.equal(await page.getByRole("searchbox").inputValue(), "DEMO-1104");
  assert.equal(
    await page
      .getByRole("button", { name: "Delivered", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await goto("/en/visual-review?tab=accounts");
  for (const [width, height] of [
    [390, 844],
    [932, 320],
    [320, 480],
    [1440, 1000],
  ]) {
    await page.setViewportSize({ width, height });
    await page
      .getByRole("button", { name: "Open notifications", exact: true })
      .click();
    const scroll = page.locator(".vr-scroll");
    await scroll.evaluate((e) => (e.scrollTop = e.scrollHeight));
    const bounds = await page.locator(".vr-dialog").evaluate((e) => {
      const list = e.querySelector(".vr-scroll"),
        last = list.lastElementChild,
        footer = e.querySelector("footer"),
        header = e.querySelector("header");
      return {
        last: last.getBoundingClientRect().bottom,
        list: list.getBoundingClientRect().bottom,
        footer: footer.getBoundingClientRect().top,
        header: header.getBoundingClientRect().bottom,
        top: list.getBoundingClientRect().top,
        bottom: e.getBoundingClientRect().bottom,
        height: innerHeight,
      };
    });
    assert(
      bounds.last <= bounds.list + 1 &&
        bounds.list <= bounds.footer + 1 &&
        bounds.top >= bounds.header - 1 &&
        bounds.bottom <= bounds.height,
      JSON.stringify(bounds),
    );
    const overlap = await page.locator(".vr-dialog").evaluate((e) => {
      const f = e.querySelector("footer").getBoundingClientRect();
      return [...e.querySelectorAll("[data-notice]:last-child *")].some((x) => {
        const r = x.getBoundingClientRect();
        return (
          r.height &&
          r.width &&
          r.bottom > f.top + 0.5 &&
          r.top < f.bottom &&
          r.right > f.left &&
          r.left < f.right
        );
      });
    });
    assert(!overlap, "notice descendants overlap footer");
    await page.keyboard.press("Escape");
    assert.equal(await page.getByRole("dialog").count(), 0);
    assert.equal(
      await page.evaluate(() =>
        document.activeElement.getAttribute("aria-label"),
      ),
      "Open notifications",
    );
    checks.push({
      notificationRotation: [width, height],
      bounds,
      overlap: false,
      escapeFocus: true,
    });
  }
  for (const theme of ["light", "dark"])
    for (const [width, height] of [
      [390, 844],
      [1440, 1000],
    ]) {
      await page.setViewportSize({ width, height });
      await page.evaluate((t) => {
        localStorage.setItem("theme-mode", t);
        localStorage.setItem("theme", t);
      }, theme);
      for (const [tab, before] of [
        ["orders", "/orders"],
        ["accounts", "/restaurants"],
        ["notifications", "/notifications"],
        ["metrics", "/finance?period=month"],
      ]) {
        await page.goto(base + "/en" + before, { waitUntil: "networkidle" });
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({
          path: `${out}/${tab}-${width}-${theme}-before.png`,
          fullPage: false,
        });
        await goto("/en/visual-review?tab=" + tab);
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({
          path: `${out}/${tab}-${width}-${theme}-after.png`,
          fullPage: false,
        });
      }
    }
  fs.writeFileSync(
    out + "/results.json",
    JSON.stringify(
      { browser: browser.version(), safari: false, checks, errors, failed },
      null,
      2,
    ),
  );
  assert.deepEqual(errors, []);
  assert.deepEqual(failed, []);
  await browser.close();
  console.log(
    `PASS ${checks.length} review checks + 32 comparison screenshots`,
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

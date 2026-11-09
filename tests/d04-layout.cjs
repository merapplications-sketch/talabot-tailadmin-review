const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
  const phase = Number(process.env.D04_PHASE || 6),
    results = [],
    errors = [];
  const b = await chromium.launch({
    executablePath:
      "/root/.cache/ms-playwright/chromium_headless_shell-1161/chrome-linux/headless_shell",
  });
  for (const width of [320, 390, 1440])
    for (const theme of ["light", "dark"]) {
      const height = width === 320 ? 640 : width === 390 ? 844 : 1000;
      const c = await b.newContext({
        viewport: { width, height },
        locale: "en-US",
      });
      await c.addInitScript(
        (t) => localStorage.setItem("theme-mode", t),
        theme,
      );
      const p = await c.newPage();
      p.on("pageerror", (e) => errors.push(e.message));
      await p.goto(process.env.BASE_URL + "/", { waitUntil: "networkidle" });
      assert.equal(
        await p
          .locator("body")
          .evaluate((e) =>
            getComputedStyle(e).getPropertyValue("--color-brand-500").trim(),
          ),
        "#f36831",
      );
      if (phase >= 2) {
        const ids = await p
          .getByTestId("analytics")
          .locator("section[data-testid]")
          .evaluateAll((es) => es.map((e) => e.dataset.testid));
        assert(
          ids.indexOf("performance-summary") < ids.indexOf("finance-summary"),
        );
        assert.equal(ids.at(-1), "monthly-target");
      }
      if (phase >= 3) {
        await p.goto(process.env.BASE_URL + "/orders", {
          waitUntil: "networkidle",
        });
        assert.equal(
          await p.locator(".tp-secondary-filters").getAttribute("open"),
          null,
        );
        if (width < 1280) {
          const bounds = await p
            .getByTestId("orders-cards")
            .locator("h2")
            .first()
            .boundingBox();
          assert(
            bounds.y + bounds.height < height - 64,
            `First order hidden at ${width}: ${JSON.stringify(bounds)}`,
          );
        }
        await p.locator(".tp-secondary-filters > summary").click();
        assert(await p.getByLabel("Period", { exact: true }).isVisible());
        assert(await p.getByLabel("Sort", { exact: true }).isVisible());
        await p.getByLabel("Period", { exact: true }).selectOption("week");
        await p.waitForURL(/period=week/);
        await p.getByLabel("Sort", { exact: true }).selectOption("oldest");
        await p.waitForURL(/sort=oldest/);
        await p.locator(".tp-secondary-filters > summary").click();
        assert(
          (
            await p.locator(".tp-secondary-filters > summary").innerText()
          ).includes("Oldest first"),
        );
      }
      if (phase >= 5) {
        await p.goto(process.env.BASE_URL + "/orders?status=pickedup", {
          waitUntil: "networkidle",
        });
        const expected = await p
          .locator('.tp-status[data-status="pickedup"]')
          .first()
          .evaluate((e) => getComputedStyle(e).color);
        assert.equal(
          expected,
          theme === "dark" ? "rgb(214, 187, 251)" : "rgb(105, 65, 198)",
        );
        await p.goto(process.env.BASE_URL + "/notifications", {
          waitUntil: "networkidle",
        });
        assert.equal(
          await p
            .locator('.tp-status[data-status="pickedup"]')
            .first()
            .evaluate((e) => getComputedStyle(e).color),
          expected,
        );
      }
      assert(
        !(await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        )),
      );
      results.push({ width, height, theme, phase, pass: true });
      await c.close();
    }
  await b.close();
  assert.deepEqual(errors, []);
  fs.mkdirSync(process.env.D04_OUTPUT, { recursive: true });
  fs.writeFileSync(
    process.env.D04_OUTPUT + "/layout.json",
    JSON.stringify({ results, errors, realSafari: false }, null, 2),
  );
  console.log("PASS D04 layout", phase, results.length);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

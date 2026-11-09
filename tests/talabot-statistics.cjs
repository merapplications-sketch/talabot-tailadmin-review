const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const out = process.env.QA_OUTPUT_DIR || "qa/talabot-statistics";
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({
    executablePath:
      "/root/.cache/ms-playwright/chromium_headless_shell-1161/chrome-linux/headless_shell",
    ...(process.env.REMOTE
      ? { proxy: { server: process.env.HTTPS_PROXY } }
      : {}),
  });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
    isMobile: true,
    hasTouch: true,
    locale: "en-US",
  });
  const p = await context.newPage(),
    errors = [],
    failed = [];
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("response", (r) => {
    if (r.status() >= 400) failed.push({ url: r.url(), status: r.status() });
  });
  await p.goto(process.env.BASE_URL || "http://127.0.0.1:3001", {
    waitUntil: "networkidle",
  });
  await p
    .locator("[data-testid=analytics] .apexcharts-canvas")
    .first()
    .waitFor();
  await p
    .getByTestId("weekday-orders")
    .locator(".apexcharts-bar-area")
    .first()
    .click();
  assert((await p.getByTestId("hourly-orders").innerText()).includes("Monday"));
  await p.getByRole("button", { name: "All days", exact: true }).click();
  const target = await p.getByTestId("monthly-target").innerText();
  await p.getByRole("button", { name: "Last 7 days", exact: true }).click();
  assert(
    (await p.getByTestId("period-range").innerText()).includes("2026-11-03"),
  );
  assert.equal(await p.getByTestId("monthly-target").innerText(), target);
  await p.getByRole("button", { name: "Monday", exact: true }).click();
  assert((await p.getByTestId("hourly-orders").innerText()).includes("Monday"));
  const monday = await p.getByTestId("hourly-total").innerText();
  await p.getByRole("button", { name: "All days", exact: true }).click();
  assert.notEqual(await p.getByTestId("hourly-total").innerText(), monday);
  await p.getByRole("button", { name: "Custom period", exact: true }).click();
  await p.getByLabel("Start date", { exact: true }).fill("2026-11-08");
  await p.getByLabel("End date", { exact: true }).fill("2026-11-03");
  await p.getByRole("button", { name: "Apply", exact: true }).click();
  await p.getByRole("alert").waitFor();
  assert(
    (await p.getByTestId("period-range").innerText()).includes("2026-11-03"),
  );
  await p.getByLabel("End date", { exact: true }).fill("2026-11-09");
  await p.getByRole("button", { name: "Apply", exact: true }).click();
  assert(
    (await p.getByTestId("period-range").innerText()).includes("2026-11-08"),
  );
  assert.equal(await p.getByTestId("monthly-target").innerText(), target);
  await p.getByRole("button", { name: "Month", exact: true }).click();
  assert(
    (await p.getByTestId("profit-status").innerText()).includes(
      "expenses incomplete",
    ),
  );
  const results = [];
  for (const [name, w, h] of [
    ["phone", 430, 932],
    ["small", 320, 640],
    ["landscape", 932, 430],
    ["short", 844, 300],
    ["desktop", 1440, 1000],
  ]) {
    await p.setViewportSize({ width: w, height: h });
    await p.waitForTimeout(400);
    assert(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      `overflow ${name}`,
    );
    for (const theme of ["light", "dark"]) {
      if (
        (await p.evaluate(() =>
          document.documentElement.classList.contains("dark"),
        )) !==
        (theme === "dark")
      ) {
        const toggle = p.getByRole("button", { name: "Toggle color theme" });
        if (!(await toggle.isVisible()))
          await p
            .getByRole("button", { name: "Toggle application menu" })
            .click();
        await toggle.click();
        if (w < 1280)
          await p
            .getByRole("button", { name: "Toggle application menu" })
            .click();
      }
      await p.waitForTimeout(400);
      await p.evaluate(() => scrollTo(0, 0));
      if (name === "phone" || name === "desktop") {
        await p.screenshot({
          path: `${out}/${name}-${theme}.png`,
          fullPage: true,
        });
        await p.screenshot({ path: `${out}/${name}-${theme}-top.png` });
        await p.getByTestId("hourly-orders").scrollIntoViewIfNeeded();
        await p.screenshot({ path: `${out}/${name}-${theme}-peaks.png` });
      }
      results.push({ name, viewport: [w, h], theme, overflow: false });
    }
  }
  for (const locale of ["ru", "tg"]) {
    await p.goto(
      (process.env.BASE_URL || "http://127.0.0.1:3001") + "/" + locale,
      { waitUntil: "networkidle" },
    );
    await p.getByTestId("analytics").waitFor();
    assert(
      !(await p.getByTestId("analytics").innerText()).includes(
        "talabotAnalytics.",
      ),
    );
  }
  fs.writeFileSync(
    `${out}/results.json`,
    JSON.stringify(
      {
        browser: await browser.version(),
        mobile: "Chromium emulation, not real Safari",
        results,
        checks: [
          "period filter",
          "custom invalid/valid",
          "target independent",
          "weekday/hour filter",
          "incomplete profit",
          "RU/TG render",
        ],
        errors,
        failed,
      },
      null,
      2,
    ),
  );
  await browser.close();
  assert.deepEqual(errors, []);
  assert.deepEqual(failed, []);
  console.log("PASS statistics UI");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

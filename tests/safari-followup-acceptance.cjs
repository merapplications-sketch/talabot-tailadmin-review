// Requires Playwright supplied by the test environment; no project dependency changes.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const output = process.env.QA_OUTPUT_DIR || "qa-results";
fs.mkdirSync(output, { recursive: true });
const origin = process.env.BASE_URL;
if (!origin)
  throw new Error("Set BASE_URL to the review deployment or local server");
const assert = require("assert/strict");
(async () => {
  const results = [],
    errors = [];
  const b = await chromium.launch({
    executablePath:
      "/root/.cache/ms-playwright/chromium_headless_shell-1161/chrome-linux/headless_shell",
    headless: true,
    ...(origin.startsWith("http://localhost")
      ? {}
      : { proxy: { server: process.env.HTTPS_PROXY } }),
  });
  for (const mobile of [true, false]) {
    const c = await b.newContext({
      viewport: mobile
        ? { width: 390, height: 844 }
        : { width: 1366, height: 900 },
      isMobile: mobile,
      hasTouch: mobile,
      ...(mobile
        ? {
            userAgent:
              "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1",
          }
        : {}),
    });
    const p = await c.newPage();
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(origin + "/calendar", { waitUntil: "networkidle" });
    await p
      .getByRole("button", { name: /Add Event/ })
      .first()
      .click();
    await p.waitForTimeout(800);
    await p.locator("#event-title").fill("Same day verification");
    const start = p.locator(
        mobile ? "#event-start-date-mobile" : "#event-start-date",
      ),
      end = p.locator(mobile ? "#event-end-date-mobile" : "#event-end-date");
    async function date(el, value) {
      if (mobile) {
        await el.fill(value);
        await el.dispatchEvent("change");
      } else {
        await el.evaluate((e, v) => e._flatpickr.setDate(v, true), value);
      }
    }
    await date(start, "2026-11-20");
    await date(end, "2026-11-19");
    await p.getByRole("button", { name: "Add Event", exact: true }).click();
    assert.match(await p.getByRole("alert").innerText(), /on or after/);
    assert.equal(await end.getAttribute("aria-invalid"), "true");
    results.push({
      mobile,
      test: "reversed dates rejected; visible input marked invalid",
      pass: true,
    });
    await date(end, "2026-11-20");
    await p.getByRole("button", { name: "Add Event", exact: true }).click();
    await p.locator("[role=dialog]").waitFor({ state: "hidden" });
    // Landscape shows the event title directly; open the saved event through the UI.
    if (mobile) await p.setViewportSize({ width: 844, height: 390 });
    await p
      .getByRole("button", { name: "Same day verification", exact: true })
      .click();
    await p.waitForTimeout(500);
    assert.equal(await start.inputValue(), "2026-11-20");
    assert.equal(await end.inputValue(), "2026-11-20");
    results.push({
      mobile,
      test: "save and reopen same-day event retains both 2026-11-20 dates",
      pass: true,
    });
    await end.scrollIntoViewIfNeeded();
    await p.screenshot({
      path: `${output}/${process.env.TAG || "local"}-same-day-${mobile ? "phone" : "desktop"}.png`,
    });
    await p.getByRole("button", { name: "Close", exact: true }).last().click();
    await p.locator("[role=dialog]").waitFor({ state: "hidden" });
    await p
      .getByRole("button", { name: /Add Event/ })
      .first()
      .click();
    await p.waitForTimeout(500);
    await p.locator("#event-title").fill("Reopen");
    const count = await p
      .locator("[role=dialog] input")
      .evaluateAll(
        (es) =>
          es.filter(
            (e) =>
              (e.id.includes("date") ||
                e.classList.contains("flatpickr-mobile")) &&
              getComputedStyle(e).display !== "none",
          ).length,
      );
    assert.equal(count, 2);
    results.push({
      mobile,
      test: "reopen modal and rerender retains exactly two date inputs",
      pass: true,
    });
    await p.getByRole("button", { name: "Close", exact: true }).last().click();
    await p.locator("[role=dialog]").waitFor({ state: "hidden" });
    if (mobile) {
      if (
        !(await p
          .getByRole("button", { name: "Toggle notifications" })
          .isVisible())
      )
        await p
          .getByRole("button", { name: "Toggle application menu" })
          .click();
      await p.getByRole("button", { name: "Toggle notifications" }).click();
      const area = p.locator(
        "[data-slot=dropdown-menu-content] [data-slot=scroll-area-viewport]",
      );
      await area.evaluate((e) => (e.scrollTop = e.scrollHeight));
      const metrics = await area.evaluate((e) => ({
        top: e.scrollTop,
        h: e.clientHeight,
        sh: e.scrollHeight,
      }));
      assert.ok(Math.abs(metrics.top + metrics.h - metrics.sh) < 2);
      await p
        .getByText("View All Notifications", { exact: true })
        .scrollIntoViewIfNeeded();
      await p.screenshot({
        path: `${output}/${process.env.TAG || "local"}-notifications-bottom.png`,
      });
      await p.getByRole("button", { name: "Close notifications" }).click();
      results.push({
        mobile,
        test: "notification content scrolls to end and closes landscape",
        pass: true,
      });
    }
    await c.close();
  }
  fs.writeFileSync(
    `${output}/${process.env.TAG || "local"}-acceptance.json`,
    JSON.stringify({ results, errors }, null, 2),
  );
  console.log({ results, errors });
  assert.equal(errors.length, 0);
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

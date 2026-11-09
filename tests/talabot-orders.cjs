const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const base = process.env.BASE_URL || "http://127.0.0.1:3001",
  out = process.env.QA_OUTPUT_DIR || "qa/talabot-orders";
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({
    executablePath:
      "/root/.cache/ms-playwright/chromium_headless_shell-1161/chrome-linux/headless_shell",
    ...(process.env.REMOTE
      ? { proxy: { server: process.env.HTTPS_PROXY } }
      : {}),
  });
  const c = await browser.newContext({
    viewport: { width: 430, height: 932 },
    isMobile: true,
    hasTouch: true,
    locale: "en-US",
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const p = await c.newPage();
  const errors = [],
    failed = [],
    writes = [],
    checks = [];
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("response", (r) => {
    if (r.status() >= 400) failed.push({ url: r.url(), status: r.status() });
  });
  p.on("request", (r) => {
    if (["POST", "PATCH", "PUT", "DELETE"].includes(r.method()))
      writes.push({ url: r.url(), method: r.method() });
  });
  async function go(path) {
    await p.goto(base + path, { waitUntil: "networkidle" });
  }
  await go("/orders");
  await p.getByTestId("orders-list").waitFor();
  assert.equal(await p.getByTestId("result-count").innerText(), "36 orders");
  await p.getByLabel("Search", { exact: true }).fill("demo-1100");
  await p.getByRole("button", { name: "Search", exact: true }).click();
  await p.waitForURL(/q=demo-1100/);
  assert.equal(await p.getByTestId("result-count").innerText(), "1 order");
  await p.getByLabel("Search", { exact: true }).fill("absent");
  await p.getByRole("button", { name: "Search", exact: true }).click();
  await p.getByTestId("empty-orders").waitFor();
  await p.getByRole("button", { name: "Reset filters" }).click();
  await p.waitForURL("**/orders");
  await p.getByText("More filters", { exact: true }).click();
  await p.getByLabel("Status", { exact: true }).selectOption("delivered");
  await p.waitForURL(/status=delivered/);
  assert.equal(await p.getByTestId("result-count").innerText(), "5 orders");
  await p.getByRole("button", { name: "Reset filters" }).click();
  await p.waitForURL("**/orders");
  await p.getByLabel("Period", { exact: true }).selectOption("custom");
  await p.getByLabel("Start date", { exact: true }).fill("2026-11-09");
  await p.getByLabel("End date", { exact: true }).fill("2026-11-03");
  await p.getByRole("button", { name: "Apply", exact: true }).click();
  await p.getByRole("alert").waitFor();
  await p.getByLabel("End date", { exact: true }).fill("2026-11-09");
  await p.getByRole("button", { name: "Apply", exact: true }).click();
  await p.waitForURL(/end=2026-11-09/);
  assert.equal(await p.getByTestId("result-count").innerText(), "4 orders");
  checks.push(
    "Search ID, empty state, status filter, custom date validation and application",
  );
  await go("/orders?period=month&sort=oldest&page=2");
  assert.equal(await p.getByTestId("page-number").innerText(), "Page 2 of 4");
  const detailLink = p
    .getByTestId("orders-cards")
    .getByTestId("order-details")
    .nth(2);
  await detailLink.scrollIntoViewIfNeeded();
  const y = await p.evaluate(() => scrollY);
  const id = (await detailLink.innerText()).replace("View details", "").trim();
  await detailLink.click();
  await p.getByTestId("order-detail").waitFor();
  await p.getByRole("button", { name: "Copy order number" }).click();
  assert.equal(await p.evaluate(() => navigator.clipboard.readText()), id);
  await p.getByTestId("amount-breakdown").locator("summary").click();
  assert(await p.getByText("Items subtotal", { exact: true }).isVisible());
  await p.getByRole("link", { name: "Back to orders" }).click();
  await p.getByTestId("orders-list").waitFor();
  await p.waitForTimeout(500);
  assert.equal(await p.getByTestId("page-number").innerText(), "Page 2 of 4");
  assert(Math.abs((await p.evaluate(() => scrollY)) - y) < 10, "return scroll");
  checks.push(
    "Page 2 + oldest preserved, standalone details, clipboard real write/read, expandable amounts, back scroll restored",
  );
  await go("/orders?status=invalid&period=invalid&page=NaN");
  assert.equal(await p.getByTestId("result-count").innerText(), "36 orders");
  const views = [];
  for (const [name, width, height] of [
    ["phone", 430, 932],
    ["small", 320, 640],
    ["landscape", 932, 430],
    ["short", 844, 300],
    ["desktop", 1440, 1000],
  ]) {
    await p.setViewportSize({ width, height });
    for (const theme of ["light", "dark"]) {
      for (const route of ["/orders", "/orders/DEMO-1104"]) {
        await go(route);
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
          if (width < 1280)
            await p
              .getByRole("button", { name: "Toggle application menu" })
              .click();
        }
        await p.waitForTimeout(150);
        const selected = await p
          .locator('nav [aria-current="page"]')
          .evaluateAll((nodes) =>
            nodes
              .filter((n) => n.getBoundingClientRect().width > 0)
              .map((n) => getComputedStyle(n).color),
          );
        assert(
          selected.length > 0 &&
            selected.every((color) => color === "rgb(243, 104, 49)"),
          "selected Orders orange in both themes",
        );
        assert(
          await p.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          `overflow ${name} ${route} ${theme}`,
        );
        if (name === "phone" || name === "desktop") {
          await p.screenshot({
            path: `${out}/${name}-${theme}-${route === "/orders" ? "list" : "detail"}.png`,
            fullPage: true,
          });
          await p.screenshot({
            path: `${out}/${name}-${theme}-${route === "/orders" ? "list" : "detail"}-top.png`,
          });
        }
        views.push({ name, width, height, theme, route, overflow: false });
      }
    }
  }
  for (const locale of ["ru", "tg"]) {
    await p.setViewportSize({ width: 320, height: 640 });
    await go("/" + locale + "/orders");
    assert(
      !(await p.getByTestId("orders-list").innerText()).includes(
        "talabotOrders.",
      ),
    );
    assert(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    );
    await go("/" + locale + "/orders/DEMO-1104");
    assert(
      !(await p.getByTestId("order-detail").innerText()).includes(
        "talabotOrders.",
      ),
    );
    assert(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    );
  }
  checks.push(
    "20 viewport/theme/route combinations, RU/TG at 320px, invalid query defaults",
  );
  await go("/en/orders/not-an-order");
  await p
    .getByRole("heading", { name: "Order not found in this sample" })
    .waitFor();
  await go("/en");
  await p.getByTestId("summary-cards").waitFor();
  await p.getByTestId("summary-cards").getByRole("button").first().click();
  await p.getByTestId("orders-list").waitFor();
  checks.push(
    "Unknown order recovery; home Orders card navigation; home intact",
  );
  fs.writeFileSync(
    out + "/results.json",
    JSON.stringify(
      {
        browser: await browser.version(),
        mobile: "Chromium touch emulation, not Safari",
        checks,
        views,
        errors,
        failed,
        writes,
      },
      null,
      2,
    ),
  );
  await browser.close();
  assert.deepEqual(errors, []);
  assert.deepEqual(failed, []);
  assert.deepEqual(writes, []);
  console.log(
    JSON.stringify({ checks, views: views.length, errors, failed, writes }),
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

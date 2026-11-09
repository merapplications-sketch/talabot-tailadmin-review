const { chromium } = require("playwright"),
  assert = require("node:assert/strict"),
  fs = require("node:fs");
(async () => {
  const browser = await chromium.launch({
    executablePath:
      "/root/.cache/ms-playwright/chromium_headless_shell-1161/chrome-linux/headless_shell",
    ...(process.env.REMOTE
      ? { proxy: { server: process.env.HTTPS_PROXY } }
      : {}),
  });
  const p = await browser.newPage({
      viewport: { width: 430, height: 932 },
      locale: "en-US",
    }),
    base = process.env.BASE_URL || "http://127.0.0.1:3001";
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(base + "/en/orders/not-an-order", { waitUntil: "networkidle" });
  await p
    .getByRole("heading", { name: "Order not found in this sample" })
    .waitFor();
  await p.getByRole("link", { name: "Back to orders" }).click();
  await p.getByTestId("orders-list").waitFor();
  await p.waitForLoadState("networkidle");
  await p.getByText("More filters", { exact: true }).click();
  await p
    .getByLabel("Restaurant / store", { exact: true })
    .selectOption("Demo Bistro");
  await p.waitForURL(
    (url) => url.searchParams.get("merchant") === "Demo Bistro",
  );
  assert.equal(await p.getByTestId("result-count").innerText(), "12 orders");
  await p.getByRole("button", { name: "Reset filters" }).click();
  await p.waitForURL("**/orders");
  if (!(await p.getByLabel("Pickup area", { exact: true }).isVisible()))
    await p.getByText("More filters", { exact: true }).click();
  await p.getByLabel("Pickup area", { exact: true }).selectOption("Sino");
  await p.waitForURL(/pickup=Sino/);
  assert.equal(await p.getByTestId("result-count").innerText(), "9 orders");
  await p.getByLabel("Delivery area", { exact: true }).selectOption("Firdavsi");
  await p.waitForURL(/delivery=Firdavsi/);
  assert.equal(await p.getByTestId("result-count").innerText(), "9 orders");
  await p.getByLabel("Driver", { exact: true }).selectOption("unassigned");
  await p.waitForURL(/driver=unassigned/);
  const count = await p.getByTestId("result-count").innerText();
  assert.notEqual(count, "9 orders");
  await p.getByRole("button", { name: "Reset filters" }).click();
  await p.waitForURL("**/orders");
  await p.getByRole("button", { name: "Next", exact: true }).click();
  await p.waitForURL(/page=2/);
  assert.equal(await p.getByTestId("page-number").innerText(), "Page 2 of 4");
  await p.getByRole("button", { name: "Previous", exact: true }).click();
  await p.waitForURL(/page=1/);
  const link = p
    .getByTestId("orders-cards")
    .getByTestId("order-details")
    .nth(1);
  await link.scrollIntoViewIfNeeded();
  const y = await p.evaluate(() => scrollY);
  await link.click();
  await p.getByTestId("order-detail").waitFor();
  await p.goBack();
  await p.getByTestId("orders-list").waitFor();
  await p.waitForLoadState("networkidle");
  await p.waitForTimeout(400);
  assert(Math.abs((await p.evaluate(() => scrollY)) - y) < 10);
  await p.goForward();
  await p.getByTestId("order-detail").waitFor();
  await p.reload();
  await p.getByTestId("order-detail").waitFor();
  await p.goto(base + "/en", { waitUntil: "networkidle" });
  await p.getByTestId("summary-cards").getByRole("button").first().click();
  await p.getByTestId("orders-list").waitFor();
  await p.waitForLoadState("networkidle");
  assert.equal(
    await p
      .getByTestId("mobile-navigation")
      .getByRole("button", { name: "Orders", exact: true })
      .getAttribute("aria-current"),
    "page",
  );
  const result = {
    checks: [
      "unknown ID recovery",
      "merchant/pickup/delivery/driver combined filters",
      "next/previous",
      "browser back restores scroll",
      "forward and detail reload",
      "home card and selected mobile nav",
    ],
    errors,
  };
  fs.writeFileSync(
    (process.env.QA_OUTPUT_DIR || "qa/talabot-orders") +
      "/filters-results.json",
    JSON.stringify(result, null, 2),
  );
  await browser.close();
  assert.deepEqual(errors, []);
  console.log(JSON.stringify(result));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

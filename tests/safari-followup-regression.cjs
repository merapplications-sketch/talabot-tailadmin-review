// Requires Playwright supplied by the test environment; no project dependency changes.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const output = process.env.QA_OUTPUT_DIR || "qa-results";
fs.mkdirSync(output, { recursive: true });
const origin = process.env.BASE_URL;
if (!origin)
  throw new Error("Set BASE_URL to the review deployment or local server");
(async () => {
  let failures = 0;
  const results = [];
  const check = (name, actual, pass) => {
    results.push({ name, actual, pass });
    if (!pass) failures++;
  };
  const b = await chromium.launch({
    executablePath:
      "/root/.cache/ms-playwright/chromium_headless_shell-1161/chrome-linux/headless_shell",
    headless: true,
    ...(origin.startsWith("http://localhost")
      ? {}
      : { proxy: { server: process.env.HTTPS_PROXY } }),
  });
  const c = await b.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1",
  });
  const p = await c.newPage();
  await p.goto(origin + "/calendar", { waitUntil: "networkidle" });
  await p
    .getByRole("button", { name: /Add Event/ })
    .first()
    .click();
  await p.waitForTimeout(800);
  await p.locator("#event-title").fill("Single day follow-up");
  let visible = await p
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
  check("Two visible date fields after title rerender", visible, visible === 2);
  const font = await p
    .locator("#event-title")
    .evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
  check("Focused mobile title at least 16px", font, font >= 16);
  await p.screenshot({
    path: `${output}/${process.env.TAG || "before"}-dates.png`,
  });
  await p.getByRole("button", { name: "Close", exact: true }).last().click();
  await p.setViewportSize({ width: 844, height: 390 });
  const nb = p.getByRole("button", { name: "Toggle notifications" });
  if (!(await nb.isVisible())) {
    const buttons = await p.getByRole("button").all();
    console.log(
      "BUTTONS",
      await p
        .getByRole("button")
        .evaluateAll((es) =>
          es.map((e) => ({
            label: e.getAttribute("aria-label"),
            text: e.textContent,
          })),
        ),
    );
    await p.getByRole("button", { name: "Toggle application menu" }).click();
  }
  await nb.click();
  await p.waitForTimeout(500);
  let menu = p.locator("[data-slot=dropdown-menu-content]");
  console.log("MENU", await menu.innerText());
  const footer = menu.getByText("View All Notifications", { exact: true });
  await footer.scrollIntoViewIfNeeded();
  const bounds = await footer.boundingBox();
  const hit = await footer.evaluate((e) => {
    let r = e.getBoundingClientRect();
    return e.contains(
      document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2),
    );
  });
  check("Notification footer reachable landscape", { bounds, hit }, hit);
  await p.screenshot({
    path: `${output}/${process.env.TAG || "before"}-notifications.png`,
  });
  await p.getByRole("button", { name: "Close notifications" }).click();
  fs.writeFileSync(
    `${output}/${process.env.TAG || "before"}-results.json`,
    JSON.stringify(results, null, 2),
  );
  console.log(results);
  await b.close();
  process.exitCode = failures ? 1 : 0;
})().catch((e) => {
  console.error(e);
  process.exit(2);
});

const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
  const browser = await chromium.launch({
    executablePath:
      "/root/.cache/ms-playwright/chromium_headless_shell-1161/chrome-linux/headless_shell",
  });
  const out = "docs/evidence/d03";
  fs.mkdirSync(out, { recursive: true });
  fs.mkdirSync("public/d03-comparison", { recursive: true });
  const results = [],
    errors = [];
  const routes = [
    "/",
    "/orders?q=DEMO-1104",
    "/restaurants",
    "/drivers",
    "/customers",
    "/notifications",
    "/restaurants/1",
    "/review/image-cases",
    "/bar-chart",
    "/line-chart",
  ];
  for (const locale of ["en", "ru", "tg"])
    for (const theme of ["light", "dark"])
      for (const width of [320, 390, 1440]) {
        const context = await browser.newContext({
          viewport: { width, height: width === 1440 ? 1000 : 844 },
          locale:
            locale === "en" ? "en-US" : locale + "-" + locale.toUpperCase(),
        });
        await context.addInitScript(
          (mode) => localStorage.setItem("theme-mode", mode),
          theme,
        );
        const page = await context.newPage();
        page.on("pageerror", (e) => errors.push(e.message));
        for (const route of routes) {
          await page.goto(
            process.env.BASE_URL + "/" + locale + (route === "/" ? "" : route),
            { waitUntil: "networkidle" },
          );
          await page.locator(".talabot-polish").waitFor();
          assert.equal(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
            true,
            `${locale}/${theme}/${width}${route} overflow`,
          );
          assert.equal(
            await page.evaluate(() =>
              document.documentElement.classList.contains("dark"),
            ),
            theme === "dark",
          );
          if (route.includes("image-cases")) {
            assert.equal(
              await page.locator(".tp-avatar[data-fallback=true]").count(),
              3,
            );
            const sizes = await page.locator(".tp-avatar").evaluateAll((es) =>
              es.map((e) => ({
                w: e.getBoundingClientRect().width,
                h: e.getBoundingClientRect().height,
              })),
            );
            for (const s of sizes) assert.equal(s.w, s.h);
            assert.equal(sizes[4].w, 80);
            const contrast = await page
              .locator(".tp-avatar[data-fallback=true]")
              .first()
              .evaluate((el) => {
                const style = getComputedStyle(el);
                const luminance = (value) => {
                  const rgb = value
                    .match(/[\d.]+/g)
                    .slice(0, 3)
                    .map(Number)
                    .map((n) => {
                      n /= 255;
                      return n <= 0.04045
                        ? n / 12.92
                        : ((n + 0.055) / 1.055) ** 2.4;
                    });
                  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
                };
                const a = luminance(style.color),
                  b = luminance(style.backgroundColor);
                return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
              });
            assert(contrast >= 4.5, `Image fallback text contrast ${contrast}`);
          }
          if (
            locale === "en" &&
            width !== 320 &&
            [
              "/",
              "/orders?q=DEMO-1104",
              "/restaurants",
              "/notifications",
            ].includes(route)
          ) {
            const name = route === "/" ? "home" : route.split("?")[0].slice(1);
            await page.screenshot({
              path: `public/d03-comparison/${name}-${width}-${theme}-after.png`,
              fullPage: false,
            });
          }
          if (
            locale === "en" &&
            width !== 320 &&
            route.startsWith("/orders") &&
            width === 390
          ) {
            await page
              .getByTestId("orders-cards")
              .locator("article")
              .first()
              .scrollIntoViewIfNeeded();
            await page.screenshot({
              path: `public/d03-comparison/orders-card-${width}-${theme}-after.png`,
            });
          }
          results.push({ locale, theme, width, route, pass: true });
        }
        await context.close();
      }
  // Original query/state contract plus new quick filters; theme survives reload and supports OS auto.
  const c = await browser.newContext({
    viewport: { width: 390, height: 844 },
    locale: "en-US",
  });
  const p = await c.newPage();
  await p.goto(process.env.BASE_URL + "/orders", { waitUntil: "networkidle" });
  await p
    .getByTestId("order-quick-filters")
    .getByRole("button", { name: "Delivered", exact: true })
    .click();
  await p.waitForURL(/status=delivered/);
  assert.equal(await p.getByTestId("result-count").innerText(), "5 orders");
  await p.getByLabel("Search", { exact: true }).fill("DEMO-1104");
  await p.getByRole("button", { name: "Search", exact: true }).click();
  await p.waitForURL(/q=DEMO-1104/);
  assert.equal(await p.getByTestId("result-count").innerText(), "1 order");
  await p.getByTestId("orders-cards").getByTestId("order-details").click();
  await p.getByTestId("order-detail").waitFor();
  await p.goBack();
  await p.getByTestId("orders-list").waitFor();
  assert.equal(
    await p.getByLabel("Search", { exact: true }).inputValue(),
    "DEMO-1104",
  );
  assert.equal(
    await p.getByLabel("Status", { exact: true }).inputValue(),
    "delivered",
  );
  await p.evaluate(() => {
    localStorage.setItem("theme-mode", "auto");
    window.dispatchEvent(new Event("talabot-theme-preference"));
  });
  await p.emulateMedia({ colorScheme: "dark" });
  await p.waitForFunction(() =>
    document.documentElement.classList.contains("dark"),
  );
  await p.emulateMedia({ colorScheme: "light" });
  await p.waitForFunction(
    () => !document.documentElement.classList.contains("dark"),
  );
  await p.evaluate(() => {
    localStorage.setItem("theme-mode", "dark");
    window.dispatchEvent(new Event("talabot-theme-preference"));
  });
  await p.reload({ waitUntil: "networkidle" });
  assert.equal(
    await p.evaluate(() => document.documentElement.classList.contains("dark")),
    true,
  );
  assert.deepEqual(errors, []);
  fs.writeFileSync(
    out + "/matrix-results.json",
    JSON.stringify(
      {
        results,
        errors,
        extraChecks: [
          "quick filters + search + back",
          "OS auto mode + saved dark reload",
        ],
        realSafari: false,
      },
      null,
      2,
    ),
  );
  await browser.close();
  console.log(
    "PASS D03 " +
      results.length +
      " route/locale/theme/viewport checks, images, filters and theme persistence",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const out = process.env.QA_OUTPUT_DIR || "qa/talabot-design";
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({
    executablePath:
      "/root/.cache/ms-playwright/chromium_headless_shell-1161/chrome-linux/headless_shell",
    ...(process.env.REMOTE
      ? { proxy: { server: process.env.HTTPS_PROXY } }
      : {}),
  });
  const results = [],
    errors = [];
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
    isMobile: true,
    hasTouch: true,
    locale: "en-US",
  });
  const p = await context.newPage();
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(process.env.BASE_URL || "http://localhost:3001", {
    waitUntil: "networkidle",
  });
  await p.locator("[data-testid=summary-cards]").waitFor();
  for (const [name, w, h] of [
    ["phone", 430, 932],
    ["phone-small", 320, 640],
    ["landscape", 932, 430],
    ["short", 844, 300],
    ["desktop", 1440, 1000],
  ]) {
    await p.setViewportSize({ width: w, height: h });
    await p.waitForTimeout(600);
    const rects = await p
      .locator("[data-testid=summary-cards] > button")
      .evaluateAll((es) =>
        es.map((e) => {
          let r = e.getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width };
        }),
      );
    assert.equal(rects.length, 4);
    assert.equal(Math.round(rects[0].y), Math.round(rects[1].y));
    assert.equal(Math.round(rects[0].width), Math.round(rects[1].width));
    if (w < 1280) assert(rects[2].y > rects[0].y);
    else assert.equal(rects[2].y, rects[0].y);
    assert(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    );
    for (const theme of ["light", "dark"]) {
      if (
        (await p.evaluate(() =>
          document.documentElement.classList.contains("dark"),
        )) !==
        (theme === "dark")
      ) {
        if (
          w < 1280 &&
          !(await p
            .getByRole("button", { name: "Toggle color theme" })
            .isVisible())
        )
          await p
            .getByRole("button", { name: "Toggle application menu" })
            .click();
        await p.getByRole("button", { name: "Toggle color theme" }).click();
        if (w < 1280)
          await p
            .getByRole("button", { name: "Toggle application menu" })
            .click();
      }
      await p.waitForTimeout(500);
      await p.screenshot({ path: `${out}/${name}-${theme}.png` });
    }
    await p.locator("[data-testid=summary-cards] > button").first().click();
    await p.getByRole("dialog").waitFor();
    assert(
      await p
        .getByText(
          "This section is being prepared for the preview. No live data or permanent changes.",
        )
        .isVisible(),
    );
    if (w < 1280)
      assert(!(await p.locator("[data-testid=mobile-navigation]").isVisible()));
    await p.getByRole("button", { name: "Close", exact: true }).click();
    await p.getByRole("dialog").waitFor({ state: "hidden" });
    results.push({
      viewport: [w, h],
      columns: w < 1280 ? 2 : 4,
      overflow: false,
      message: true,
    });
  }
  await p.setViewportSize({ width: 430, height: 932 });
  for (const name of ["Orders", "Notifications", "Finance"]) {
    await p
      .locator("[data-testid=mobile-navigation]")
      .getByRole("button", { name, exact: true })
      .click();
    await p.getByRole("dialog").waitFor();
    await p.getByRole("button", { name: "Close", exact: true }).click();
  }
  await p.getByRole("button", { name: "Toggle Sidebar", exact: true }).click();
  await p
    .getByRole("navigation", { name: "Administration navigation" })
    .getByRole("button", { name: "Restaurants", exact: true })
    .click();
  await p.getByRole("dialog").waitFor();
  await p.getByRole("button", { name: "Close", exact: true }).click();
  // Manual language selection through the existing menu, persisted on reload.
  await p.getByRole("button", { name: "Toggle application menu" }).click();
  await p.getByRole("button", { name: "Musharof", exact: false }).click();
  await p.getByRole("menuitem", { name: /Language/ }).hover();
  await p.getByRole("menuitem", { name: "Русский", exact: true }).click();
  await p.getByText("Активные заказы", { exact: true }).waitFor();
  assert(
    (await context.cookies()).some(
      (c) => c.name === "NEXT_LOCALE" && c.value === "ru",
    ),
  );
  await p.reload({ waitUntil: "networkidle" });
  assert(await p.getByText("Активные заказы", { exact: true }).isVisible());
  results.push({ manualLanguage: "ru", persisted: true });
  // Browser language detection, fallback and saved manual override across fresh navigation.
  for (const [language, expected] of [
    ["ru-RU", "Активные заказы"],
    ["tg-TJ", "Фармоишҳои фаъол"],
    ["fr-FR", "Active orders"],
  ]) {
    const c = await browser.newContext({
      locale: language,
      viewport: { width: 430, height: 932 },
    });
    const q = await c.newPage();
    await q.goto(process.env.BASE_URL || "http://localhost:3001", {
      waitUntil: "networkidle",
    });
    assert(await q.getByText(expected, { exact: true }).isVisible());
    await q.screenshot({ path: `${out}/locale-${language}.png` });
    await c.addCookies([
      {
        name: "NEXT_LOCALE",
        value: "en",
        url: process.env.BASE_URL || "http://localhost:3001",
      },
    ]);
    await q.goto(process.env.BASE_URL || "http://localhost:3001", {
      waitUntil: "networkidle",
    });
    assert(await q.getByText("Active orders", { exact: true }).isVisible());
    results.push({
      locale: language,
      browserDetection: true,
      cookieOverride: true,
    });
    await c.close();
  }
  fs.writeFileSync(
    `${out}/results.json`,
    JSON.stringify(
      { results, errors, browser: browser.version(), realSafari: false },
      null,
      2,
    ),
  );
  assert.equal(errors.length, 0, errors.join("\n"));
  await browser.close();
  console.log(JSON.stringify({ passed: true, results }));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

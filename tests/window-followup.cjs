const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const out = process.env.QA_OUTPUT_DIR || "qa/windows";
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({
    executablePath:
      "/root/.cache/ms-playwright/chromium_headless_shell-1161/chrome-linux/headless_shell",
    ...(process.env.REMOTE
      ? { proxy: { server: process.env.HTTPS_PROXY } }
      : {}),
  });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  const results = [];
  await p.goto(process.env.BASE_URL + "/calendar", {
    waitUntil: "networkidle",
  });
  const marker = p.locator("[role=button][aria-haspopup=dialog]").nth(1);
  for (const close of ["button", "Escape"]) {
    await marker.click();
    const day = p.locator("[role=dialog][data-date]");
    await day.getByText("Meeting", { exact: true }).click();
    await p.waitForTimeout(600);
    assert.equal(
      await day.count(),
      0,
      "day list must unmount, not merely sit behind editor",
    );
    const modal = p.locator("[data-slot=dialog-content]");
    assert.equal(await modal.count(), 1);
    assert(
      await modal.evaluate((e) => e.contains(document.activeElement)),
      "focus belongs to editor",
    );
    await p.locator("#event-title").fill("Focus cycle");
    await p.keyboard.press("Tab");
    assert(await modal.evaluate((e) => e.contains(document.activeElement)));
    if (close === "button")
      await modal
        .getByRole("button", { name: "Close", exact: true })
        .last()
        .click();
    else await p.keyboard.press("Escape");
    await p.waitForTimeout(300);
    assert.equal(await modal.count(), 0);
    assert(
      await marker.evaluate((e) => e === document.activeElement),
      "focus restored to day marker",
    );
    results.push(
      "calendar day list -> editor -> " + close + " -> marker focus",
    );
  }
  await marker.click();
  await p
    .locator("[role=dialog][data-date]")
    .getByRole("button", { name: /close/i })
    .click();
  assert.equal(await p.locator("[role=dialog][data-date]").count(), 0);
  results.push("day list reopens and closes normally");
  await marker.click();
  await p
    .locator("[role=dialog][data-date]")
    .getByText("Meeting", { exact: true })
    .click();
  await p.waitForTimeout(500);
  await p.screenshot({ path: out + "/editor-portrait.png" });
  await p.setViewportSize({ width: 844, height: 430 });
  await p.waitForTimeout(200);
  await p.locator("#event-title").click();
  await p.screenshot({ path: out + "/editor-landscape.png" });
  await p.keyboard.press("Escape");
  await p.setViewportSize({ width: 390, height: 844 });
  await p.waitForTimeout(250);
  await p.getByRole("button", { name: "Toggle application menu" }).click();
  const cdp = await ctx.newCDPSession(p);
  for (const size of [
    { width: 844, height: 430 },
    { width: 844, height: 300 },
    { width: 320, height: 640 },
    { width: 390, height: 844 },
  ]) {
    await p.setViewportSize(size);
    await p.locator('button[data-slot="dropdown-menu-trigger"][aria-label="Notifications"]').click();
    await p.waitForTimeout(300);
    const popup = p.locator("[data-slot=dropdown-menu-content]");
    const area = popup.locator("[data-slot=scroll-area-viewport]");
    const footer = p.getByText("View All Notifications", { exact: true });
    const close = p.getByRole("button", { name: "Close", exact: true });
    const geom = await popup.evaluate((e) => {
      const a = e.querySelector("[data-slot=scroll-area-viewport]");
      return {
        popup: e.getBoundingClientRect().toJSON(),
        area: a.getBoundingClientRect().toJSON(),
        vh: visualViewport.height,
        offset: visualViewport.offsetTop,
      };
    });
    assert(
      geom.area.bottom <= geom.popup.bottom,
      "scroll viewport cannot extend beyond popup",
    );
    assert(geom.area.height > 10);
    for (let i = 0; i < 18; i++) {
      const r = await area.boundingBox();
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x: r.x + r.width / 2, y: r.y + r.height - 3 }],
      });
      for (let j = 1; j <= 5; j++)
        await cdp.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [
            {
              x: r.x + r.width / 2,
              y: Math.max(1, r.y + r.height - 3 - j * 35),
            },
          ],
        });
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
      await p.waitForTimeout(60);
      if (
        await area.evaluate(
          (e) => e.scrollTop + e.clientHeight >= e.scrollHeight - 2,
        )
      )
        break;
    }
    assert(
      await area.evaluate(
        (e) => e.scrollTop + e.clientHeight >= e.scrollHeight - 2,
      ),
      "touch scrolling reaches final notification bottom",
    );
    for (const el of [footer, close])
      assert(
        await el.evaluate((e) => {
          const r = e.getBoundingClientRect();
          const v = visualViewport;
          const hit = document.elementFromPoint(
            r.x + r.width / 2,
            r.y + r.height / 2,
          );
          return (
            r.top >= v.offsetTop &&
            r.bottom <= v.offsetTop + v.height &&
            e.contains(hit)
          );
        }),
        "footer/close visible and hit-testable",
      );
    await p.screenshot({
      path: out + "/notifications-" + size.width + "x" + size.height + ".png",
    });
    await close.click();
    await p.waitForTimeout(200);
    assert(
      await p
        .locator('button[data-slot="dropdown-menu-trigger"][aria-label="Notifications"]')
        .evaluate((e) => e === document.activeElement),
    );
    results.push({
      size,
      geometry: geom,
      touchScrollBottom: true,
      footerAndCloseReachable: true,
      focusReturned: true,
    });
  }
  // Rotation while open must recalculate the available space.
  await p.locator('button[data-slot="dropdown-menu-trigger"][aria-label="Notifications"]').click();
  await p.setViewportSize({ width: 844, height: 300 });
  await p.waitForTimeout(300);
  assert(
    await p
      .getByText("View All Notifications", { exact: true })
      .evaluate(
        (e) => e.getBoundingClientRect().bottom <= visualViewport.height,
      ),
  );
  await p.keyboard.press("Escape");
  await p.waitForTimeout(200);
  assert(
    await p
      .locator('button[data-slot="dropdown-menu-trigger"][aria-label="Notifications"]')
      .evaluate((e) => e === document.activeElement),
  );
  results.push("open rotation / Escape / focus");
  await p.setViewportSize({ width: 1280, height: 800 });
  await p.locator('button[data-slot="dropdown-menu-trigger"][aria-label="Notifications"]').click();
  await p.waitForTimeout(250);
  await p.screenshot({ path: out + "/notifications-desktop.png" });
  await p.getByRole("button", { name: "Close", exact: true }).click();
  await p.getByRole("button", { name: /toggle color theme/i }).click();
  await p.locator('button[data-slot="dropdown-menu-trigger"][aria-label="Notifications"]').click();
  await p.waitForTimeout(250);
  await p.screenshot({ path: out + "/notifications-desktop-dark.png" });
  await p.getByText("View All Notifications", { exact: true }).click();
  await p.waitForURL((url) => url.pathname === "/notifications");
  await p.getByRole("heading", { name: "Notifications", exact: true }).waitFor();
  results.push("desktop light/dark and footer link activation");
  fs.writeFileSync(
    out + "/results.json",
    JSON.stringify(
      {
        base: process.env.BASE_URL,
        browser: browser.version(),
        kind: "Chromium touch emulation, not actual Safari",
        results,
        errors,
      },
      null,
      2,
    ),
  );
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ passed: results.length, errors }));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

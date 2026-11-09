const { chromium } = require("playwright");
const assert = require("assert/strict");
const { spawn } = require("child_process");
(async () => {
  const server = spawn("python3", [
    "-m",
    "http.server",
    "3025",
    "--bind",
    "127.0.0.1",
    "--directory",
    "public",
  ]);
  try {
    await new Promise((r) => setTimeout(r, 800));
    const b = await chromium.launch({
      executablePath:
        "/root/.cache/ms-playwright/chromium_headless_shell-1161/chrome-linux/headless_shell",
    });
    const p = await b.newPage();
    await p.goto("http://127.0.0.1:3025/review-gallery/index.html");
    assert.equal(await p.locator("figure img").count(), 43);
    for (const [width, height] of [
      [320, 640],
      [390, 844],
      [1440, 1000],
      [932, 320],
    ]) {
      await p.setViewportSize({ width, height });
      assert(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await p.locator("figure a:has(img)").first().click();
      await p.locator("#viewer[open]").waitFor();
      assert(
        await p
          .locator("#viewer-image")
          .evaluate((i) => i.complete && i.naturalWidth > 0),
      );
      const first = await p.locator("#viewer-image").getAttribute("src");
      await p.click("#viewer-next");
      assert.notEqual(
        await p.locator("#viewer-image").getAttribute("src"),
        first,
      );
      await p.click("#viewer-zoom");
      assert(
        await p
          .locator("#viewer-image")
          .evaluate((i) => i.classList.contains("zoomed")),
      );
      await p.keyboard.press("Escape");
      assert.equal(await p.locator("#viewer[open]").count(), 0);
    }
    await p.selectOption("[name=group]", "orders");
    await p.selectOption("[name=device]", "phone");
    await p.selectOption("[name=theme]", "light");
    assert.equal(await p.locator("figure:visible").count(), 5);
    await p.reload();
    assert.equal(await p.locator("figure:visible").count(), 5);
    await p.click("#appearance");
    await p.screenshot({ path: "/tmp/gallery-phone.png", fullPage: false });
    await b.close();
    console.log(
      "PASS gallery: 43 images, 4 sizes, viewer next/zoom/Escape, filter reload",
    );
  } finally {
    server.kill();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

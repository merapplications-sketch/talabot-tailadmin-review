const { chromium, webkit } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const engine = process.env.ENGINE || "chromium";
const out = process.env.QA_OUTPUT_DIR || "qa/notification-clip/local-" + engine;
fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await (engine === "webkit" ? webkit : chromium).launch({
    ...(engine === "chromium"
      ? {
          executablePath:
            "/root/.cache/ms-playwright/chromium_headless_shell-1161/chrome-linux/headless_shell",
        }
      : {}),
    ...(process.env.REMOTE
      ? { proxy: { server: process.env.HTTPS_PROXY } }
      : {}),
  });
  const ctx = await b.newContext({
    viewport: { width: 430, height: 932 },
    isMobile: true,
    hasTouch: true,
  });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(process.env.BASE_URL + "/calendar", {
    waitUntil: "networkidle",
  });
  await p.getByRole("button", { name: "Toggle application menu" }).click();
  await p.getByRole("button", { name: "Toggle notifications" }).click();
  const popup = p.locator("[data-slot=dropdown-menu-content]");
  const area = popup.locator("[data-slot=scroll-area-viewport]");
  const results = [];
  const cdp = engine === "chromium" ? await ctx.newCDPSession(p) : null;
  async function measure() {
    return popup.evaluate((e) => {
      const root = e.querySelector("[data-slot=scroll-area]"),
        v = e.querySelector("[data-slot=scroll-area-viewport]"),
        footer = e.querySelector("a"),
        header = e.firstElementChild;
      const rect = (x) => {
        const r = x.getBoundingClientRect();
        return {
          top: r.top,
          bottom: r.bottom,
          left: r.left,
          right: r.right,
          height: r.height,
        };
      };
      const inter = (a, b) => ({
        top: Math.max(a.top, b.top),
        bottom: Math.min(a.bottom, b.bottom),
        left: Math.max(a.left, b.left),
        right: Math.min(a.right, b.right),
      });
      const intersects = (a, b) => {
        const r = inter(a, b);
        return r.bottom > r.top + 0.5 && r.right > r.left + 0.5;
      };
      const fr = rect(footer),
        hr = rect(header),
        items = [...v.querySelectorAll("[data-slot=dropdown-menu-item]")];
      let overlaps = [];
      for (const item of items) {
        for (const child of item.querySelectorAll("span,img")) {
          let visible = rect(child);
          for (let a = child.parentElement; a && a !== e; a = a.parentElement) {
            const s = getComputedStyle(a);
            if (/auto|scroll|hidden|clip/.test(s.overflowY))
              visible = inter(visible, rect(a));
          }
          if (intersects(visible, fr) || intersects(visible, hr))
            overlaps.push(child.textContent.slice(0, 70) || child.tagName);
        }
      }
      return {
        root: rect(root),
        viewport: rect(v),
        footer: fr,
        header: hr,
        last: rect(items.at(-1)),
        overlaps,
        scrollTop: v.scrollTop,
        scrollHeight: v.scrollHeight,
        clientHeight: v.clientHeight,
        visibleHeight: visualViewport.height,
      };
    });
  }
  function check(m, end = false) {
    assert(
      m.viewport.bottom <= m.root.bottom + 1 &&
        m.viewport.top >= m.root.top - 1,
      "scroll viewport escapes its allocated region",
    );
    assert(
      m.root.bottom < m.footer.top && m.root.top >= m.header.bottom,
      "header/list/footer must occupy separate regions",
    );
    assert.deepEqual(
      m.overlaps,
      [],
      "notification content paints over header or footer",
    );
    assert(
      m.footer.bottom <= m.visibleHeight + 1,
      "footer outside visible viewport",
    );
    if (end) {
      assert(
        m.scrollTop + m.clientHeight >= m.scrollHeight - 2,
        "end not reached",
      );
      assert(
        m.last.top >= m.viewport.top - 1 &&
          m.last.bottom <= m.viewport.bottom + 1,
        "entire last notification must fit above footer",
      );
    }
  }
  for (const size of [
    { width: 430, height: 932 },
    { width: 932, height: 430 },
    { width: 844, height: 300 },
    { width: 430, height: 932 },
    { width: 932, height: 430 },
  ]) {
    await p.setViewportSize(size);
    await p.waitForTimeout(350);
    await area.evaluate((e) => (e.scrollTop = 0));
    check(await measure());
    for (let i = 0; i < 20; i++) {
      const r = await area.boundingBox();
      if (cdp) {
        await cdp.send("Input.dispatchTouchEvent", {
          type: "touchStart",
          touchPoints: [{ x: r.x + r.width / 2, y: r.y + r.height - 5 }],
        });
        for (let j = 1; j <= 5; j++)
          await cdp.send("Input.dispatchTouchEvent", {
            type: "touchMove",
            touchPoints: [
              {
                x: r.x + r.width / 2,
                y: Math.max(1, r.y + r.height - 5 - j * 25),
              },
            ],
          });
        await cdp.send("Input.dispatchTouchEvent", {
          type: "touchEnd",
          touchPoints: [],
        });
      } else {
        await area.focus();
        await p.keyboard.press("End");
      }
      await p.waitForTimeout(100);
      check(await measure());
      if (
        await area.evaluate(
          (e) => e.scrollTop + e.clientHeight >= e.scrollHeight - 2,
        )
      )
        break;
    }
    const m = await measure();
    check(m, true);
    results.push({ size, ...m });
    await p.screenshot({
      path:
        out +
        "/end-" +
        results.length +
        "-" +
        size.width +
        "x" +
        size.height +
        ".png",
    });
  }
  // Validate that this guard detects escaping content, rather than just a clickable footer.
  const original = await area.evaluate((e) => {
    const r = e.parentElement;
    const old = [e.getAttribute("style"), r.getAttribute("style")];
    r.style.overflow = "visible";
    e.style.position = "relative";
    e.style.height = "600px";
    e.style.inset = "auto";
    e.style.overflow = "visible";
    e.scrollTop = 0;
    return old;
  });
  let detected = false;
  try {
    check(await measure());
  } catch {
    detected = true;
  }
  assert(detected, "guard must reject an oversized, leaking scroll viewport");
  await area.evaluate((e, s) => {
    [e, e.parentElement].forEach((n, i) =>
      s[i] === null
        ? n.removeAttribute("style")
        : n.setAttribute("style", s[i]),
    );
  }, original);
  await p.getByRole("button", { name: "Close notifications" }).click();
  await p.waitForTimeout(200);
  assert(
    await p
      .getByRole("button", { name: "Toggle notifications" })
      .evaluate((e) => e === document.activeElement),
  );
  assert.deepEqual(errors, []);
  fs.writeFileSync(
    out + "/results.json",
    JSON.stringify(
      {
        engine,
        version: b.version(),
        realSafari: false,
        scrollInput: cdp ? "CDP touch gestures" : "keyboard End",
        base: process.env.BASE_URL,
        results,
        negativeControlDetected: detected,
        errors,
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({
      engine,
      cases: results.length,
      overlapGuard: true,
      lastItemFullyVisible: true,
      errors,
    }),
  );
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

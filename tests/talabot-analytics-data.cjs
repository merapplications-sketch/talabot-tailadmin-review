const assert = require("node:assert/strict");
const ts = require("typescript");
const fs = require("node:fs");
const source = fs.readFileSync(
  "src/components/talabot/analytics-data.ts",
  "utf8",
);
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const mod = { exports: {} };
new Function("exports", "module", js)(mod.exports, mod);
const d = mod.exports;
const fixture = [...Array(2)]
  .map(() => ({ ...d.orders[0], date: "2026-11-02", hour: 12 }))
  .concat(
    [...Array(4)].map(() => ({ ...d.orders[0], date: "2026-11-09", hour: 18 })),
  );
assert.equal(d.weekdayMeans("2026-11-01", "2026-11-09", fixture)[0], 3);
assert.equal(d.weekdayMeans("2026-11-01", "2026-11-09", fixture)[1], 0);
assert.equal(d.weekdayMeans("2026-11-09", "2026-11-09", fixture)[1], null);
assert.equal(
  d.hours(fixture, 0).reduce((s, n) => s + n, 0),
  6,
);
assert.equal(
  d.hours(fixture, 1).reduce((s, n) => s + n, 0),
  0,
);
assert.deepEqual(d.previousRange("2026-11-01", "2026-11-09"), {
  start: "2026-10-23",
  end: "2026-10-31",
});
assert(!d.validRange("2026-11-09", "2026-11-01"));
assert(d.validRange("2026-11-01", "2026-11-09"));
const selected = d.selectOrders("2026-11-01", "2026-11-09"),
  total = d.totals(selected);
assert.equal(
  d
    .daily(selected, "2026-11-01", "2026-11-09", "sales")
    .reduce((s, n) => s + n, 0),
  total.sales,
);
assert.equal(
  d.hours(selected, null).reduce((s, n) => s + n, 0),
  total.orders,
);
assert.equal(d.expenses("2026-11-01", "2026-11-09").profit, null);
assert.equal(d.mean([]), null);
console.log(
  JSON.stringify({
    status: "PASS",
    checks: 12,
    totals: total,
    weekdayMeans: d.weekdayMeans("2026-11-01", "2026-11-09"),
  }),
);

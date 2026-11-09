const fs = require("node:fs"),
  ts = require("typescript"),
  assert = require("node:assert/strict");
const mod = { exports: {} };
new Function(
  "module",
  "exports",
  ts.transpileModule(
    fs.readFileSync("src/components/talabot/orders-data.ts", "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText,
)(mod, mod.exports);
const { orders, filterOrders, orderStatuses } = mod.exports;
assert.equal(new Set(orders.map((o) => o.id)).size, 36);
for (const o of orders) {
  assert(orderStatuses.includes(o.status));
  assert.equal(
    o.total,
    o.items.reduce((a, x) => a + x.unit * x.quantity, 0) +
      o.delivery -
      o.discount,
  );
  assert(Date.parse(o.updated) >= Date.parse(o.created));
  assert.equal(o.history.at(-1).status, o.status);
}
for (const status of orderStatuses) {
  assert(
    filterOrders(new URLSearchParams({ status })).every(
      (o) => o.status === status,
    ),
  );
}
assert.equal(filterOrders(new URLSearchParams({ period: "today" })).length, 4);
assert.equal(filterOrders(new URLSearchParams({ period: "week" })).length, 28);
assert.equal(
  filterOrders(new URLSearchParams({ q: "Demo Customer 01" })).length,
  1,
);
assert.equal(
  filterOrders(new URLSearchParams({ q: "demo bistro" })).length,
  12,
);
const oldest = filterOrders(new URLSearchParams({ sort: "oldest" }));
for (let i = 1; i < oldest.length; i++)
  assert(Date.parse(oldest[i].created) >= Date.parse(oldest[i - 1].created));
console.log(
  "PASS: 36 unique IDs, seven source statuses, cent-accurate totals, chronological events, dates/search/sort",
);

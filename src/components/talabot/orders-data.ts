// Synthetic, independent interaction sample. Not the home analytics dataset.
// Vocabulary only: Talabat-v3 @148cfae50000e983af2221a96057c507edac6d69,
// talabat-core.js:14-18,225 and sql/test_patch34.sql:36. No transition rules copied.
export const orderStatuses = [
  "pending",
  "preparing",
  "ready",
  "pickedup",
  "delivered",
  "rejected",
  "cancelled",
] as const;
export type OrderStatus = (typeof orderStatuses)[number];
export const merchants = ["Demo Bistro", "Demo Kitchen", "Demo Market"];
export const zones = ["Sino", "Firdavsi", "Ismoili Somoni", "Shohmansur"];
export const drivers = ["Demo Driver A", "Demo Driver B", "Demo Driver C"];
export const sampleDate = "2026-11-09";
export const orders = Array.from({ length: 36 }, (_, i) => {
  const status = orderStatuses[i % orderStatuses.length];
  const created = `2026-11-${String(9 - Math.floor(i / 4)).padStart(2, "0")}T${String(16 - (i % 4)).padStart(2, "0")}:10:00+05:00`;
  const items = [
    { key: "meal", quantity: 2, unit: 3500 + i * 25 },
    { key: "drink", quantity: 1, unit: 1500 },
  ];
  const subtotal = items.reduce((s, x) => s + x.quantity * x.unit, 0);
  const delivery = 1200;
  const discount = i % 3 === 0 ? 500 : 0;
  return {
    id: `DEMO-${1100 + i}`,
    customer: `Demo Customer ${String(i + 1).padStart(2, "0")}`,
    merchant: merchants[i % 3],
    store: i % 3 === 2,
    pickup: zones[i % 4],
    deliveryZone: zones[(i + 1) % 4],
    driver: i % 7 < 3 || i % 7 > 4 ? null : drivers[i % 3],
    status,
    created,
    updated: new Date(
      Date.parse(created) + (status === "pending" ? 0 : 20 * 60000),
    ).toISOString(),
    items,
    subtotal,
    delivery,
    discount,
    total: subtotal + delivery - discount,
    history:
      status === "pending"
        ? [{ status: "pending" as OrderStatus, at: created }]
        : [
            { status: "pending" as OrderStatus, at: created },
            {
              status,
              at: new Date(Date.parse(created) + 20 * 60000).toISOString(),
            },
          ],
  };
});
export type PreviewOrder = (typeof orders)[number];
export function filterOrders(params: URLSearchParams) {
  const query = (params.get("q") || "").trim().toLocaleLowerCase();
  const period = params.get("period") || "all";
  const start =
    period === "today"
      ? sampleDate
      : period === "week"
        ? "2026-11-03"
        : period === "month"
          ? "2026-11-01"
          : period === "custom"
            ? params.get("start") || ""
            : "";
  const end =
    period === "custom"
      ? params.get("end") || ""
      : period === "all"
        ? ""
        : sampleDate;
  return orders
    .filter((o) => {
      const date = o.created.slice(0, 10);
      return (
        (!query ||
          `${o.id} ${o.customer} ${o.merchant}`
            .toLocaleLowerCase()
            .includes(query)) &&
        (!start || date >= start) &&
        (!end || date <= end) &&
        ["status", "merchant", "pickup"].every(
          (key) =>
            !params.get(key) ||
            o[key as "status" | "merchant" | "pickup"] === params.get(key),
        ) &&
        (!params.get("delivery") ||
          o.deliveryZone === params.get("delivery")) &&
        (!params.get("driver") ||
          (o.driver || "unassigned") === params.get("driver"))
      );
    })
    .sort(
      (a, b) =>
        (params.get("sort") === "oldest" ? 1 : -1) *
          a.created.localeCompare(b.created) || a.id.localeCompare(b.id),
    );
}

import { orders, merchants, drivers } from "./orders-data";
export type Directory = "restaurants" | "drivers" | "customers";
export function entities(kind: Directory) {
  const names =
    kind === "restaurants"
      ? merchants
      : kind === "drivers"
        ? drivers
        : orders.map((o) => o.customer);
  return names.map((name, i) => ({
    id: String(i + 1),
    name,
    orders: orders.filter((o) =>
      kind === "restaurants"
        ? o.merchant === name
        : kind === "drivers"
          ? o.driver === name
          : o.customer === name,
    ),
  }));
}
export const notices = orders
  .filter((o) => o.status === "cancelled" || o.status === "pickedup")
  .map((o, i) => ({ id: String(i + 1), order: o }));

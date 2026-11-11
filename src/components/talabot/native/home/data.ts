import { tables, text, type Row, type Tables } from "../domain";
import { snapshotTime } from "../order-operations";

// This is a view of the saved synthetic fixture, not a server reporting contract.
export const snapshot = new Date(snapshotTime + 5 * 3600000)
  .toISOString()
  .slice(0, 10);
export const firstDay = snapshot.slice(0, 7) + "-01";
export function periodRange(period: string) {
  return {
    start:
      period === "today"
        ? snapshot
        : period === "week"
          ? new Date(Date.parse(snapshot) - 6 * 86400000)
              .toISOString()
              .slice(0, 10)
          : firstDay,
    end: snapshot,
  };
}
export function validHomeRange(start: string, end: string) {
  const valid = (value: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value;
  return (
    valid(start) &&
    valid(end) &&
    start >= firstDay &&
    start <= end &&
    end <= snapshot
  );
}
export function homeRankings(
  start: string,
  end: string,
  source: Tables = tables,
  scope?: { category: string; merchant: string; query: string },
) {
  const loaded = source.orders.filter((o) => !o._hist).slice(0, 300);
  const storeMatches = (store: Row | undefined) =>
    !!store &&
    (!scope ||
      ((scope.category === "all" || store.category === scope.category) &&
        (!scope.merchant || String(store.id) === scope.merchant) &&
        (!scope.query ||
          text(store, "name")
            .toLowerCase()
            .includes(scope.query.trim().toLowerCase()))));
  const delivered = loaded.filter((o) => {
    const created = Date.parse(text(o, "created_at"));
    return (
      o.status === "delivered" &&
      (!scope ||
        storeMatches(source.stores.find((s) => s.id === o.store_id))) &&
      Number.isFinite(created) &&
      created >= Date.parse(start + "T00:00:00+05:00") &&
      created < Date.parse(end + "T00:00:00+05:00") + 86400000
    );
  });
  const restaurants = source.stores
    .filter((s) => (scope ? storeMatches(s) : s.category === "rest"))
    .flatMap((store) => {
      const orders = delivered.filter((o) => o.store_id === store.id);
      if (!orders.length) return [];
      const values = orders.map((o) =>
        o.total == null ? NaN : Number(o.total),
      );
      return [
        {
          id: text(store, "id"),
          name: text(store, "name"),
          completed: orders.length,
          sales: values.every(Number.isFinite)
            ? values.reduce((a, b) => a + b, 0)
            : null,
        },
      ];
    })
    .sort(
      (a, b) =>
        Number(a.sales === null) - Number(b.sales === null) ||
        (b.sales ?? 0) - (a.sales ?? 0) ||
        b.completed - a.completed ||
        a.id.localeCompare(b.id),
    );
  const orderMap = new Map(delivered.map((o) => [text(o, "id"), o]));
  const items = new Map<
    string,
    {
      id: string;
      storeId: string;
      storeName: string;
      name: string;
      quantity: number;
    }
  >();
  let omittedItems = 0;
  for (const item of source.order_items) {
    const order: Row | undefined = orderMap.get(text(item, "order_id"));
    if (!order) continue;
    const id = text(item, "item_id"),
      storeId = text(order, "store_id"),
      qty = Number(item.qty);
    const store = source.stores.find((s) => s.id === storeId);
    const catalog = source.menu_items.find(
      (i) => i.id === id && i.store_id === storeId,
    );
    if (!id || !catalog || !store || !Number.isFinite(qty) || qty <= 0) {
      omittedItems++;
      continue;
    }
    const key = JSON.stringify([storeId, id]);
    const current = items.get(key) || {
      id,
      storeId,
      storeName: text(store, "name"),
      name: text(item, "name") || text(catalog, "name"),
      quantity: 0,
    };
    current.quantity += qty;
    items.set(key, current);
  }
  return {
    restaurants,
    items: [...items.values()].sort(
      (a, b) =>
        b.quantity - a.quantity ||
        a.storeId.localeCompare(b.storeId) ||
        a.id.localeCompare(b.id),
    ),
    omittedItems,
    loaded: loaded.length,
    completed: delivered.length,
  };
}

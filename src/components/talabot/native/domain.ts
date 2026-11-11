import fixture from "./fixture.json";
export type Row = Record<string, unknown>;
export type Tables = Record<string, Row[]>;
export const tables: Tables = fixture as unknown as Tables;
export const text = (row: Row, key: string) =>
  row[key] == null ? "" : String(row[key]);
export const number = (row: Row, key: string) => Number(row[key] || 0);
export const statuses = [
  "pending",
  "preparing",
  "ready",
  "pickedup",
  "delivered",
  "rejected",
  "cancelled",
];
export function metrics(orders = tables.orders) {
  const latest = orders.filter((o) => !o._hist).slice(0, 300),
    delivered = latest.filter((o) => o.status === "delivered");
  return {
    orders: latest.length,
    revenue: delivered.reduce((sum, o) => sum + number(o, "total"), 0),
    commission: delivered.reduce((sum, o) => sum + number(o, "commission"), 0),
    active: latest.filter((o) =>
      ["pending", "preparing", "ready", "pickedup"].includes(text(o, "status")),
    ).length,
  };
}
export function searchOrders(
  query: string,
  status = "all",
  source = tables.orders,
  profiles = tables.profiles,
) {
  const q = query.trim().toLowerCase().replace(/^#/, ""),
    digits = q.replace(/\D/g, "");
  return source.filter(
    (o) =>
      !o._hist &&
      (status === "all" || o.status === status) &&
      (!q ||
        text(o, "id").toLowerCase() === q ||
        (q.length >= 2 &&
          contacts(o, profiles).customer.name.toLowerCase().includes(q)) ||
        (digits.length >= 4 &&
          contacts(o, profiles)
            .customer.phone.replace(/\D/g, "")
            .includes(digits))),
  );
}
export type ReadResult<T> =
  | { data: T; error: null }
  | { data: null; error: "not_allowed" | "unavailable" };
export async function readOrders(
  query: string,
  status: string,
  mode = "normal",
): Promise<ReadResult<Row[]>> {
  if (mode === "denied") return { data: null, error: "not_allowed" };
  if (mode === "error") return { data: null, error: "unavailable" };
  return {
    data: mode === "empty" ? [] : searchOrders(query, status),
    error: null,
  };
}
export function findOrder(id: string) {
  return tables.orders.find((o) => o.id === id);
}
export function finance(order: Row) {
  const delivered = order.status === "delivered",
    dead = ["cancelled", "rejected"].includes(text(order, "status")),
    cash = /^(cash|Cash|Наличн)/.test(text(order, "payment")),
    wallet = order.payment === "wallet";
  return {
    delivered,
    dead,
    cash,
    wallet,
    online: !cash && !wallet,
    collected: order.cash_collected ?? null,
    settled: !!order.cash_settled_at,
    walletUsed: number(order, "wallet_used"),
    walletReturned: order.wallet_returned_at ?? null,
    commission: number(order, "commission"),
    commissionRecognized: delivered,
  };
}
export function parseLocation(message: string) {
  const match = /^LOC:(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/.exec(message);
  if (!match) return null;
  const lat = Number(match[1]),
    lng = Number(match[2]);
  return Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? { lat, lng } : null;
}
export function listState(search: string) {
  const p = new URLSearchParams(search);
  return {
    section: p.get("section") || "home",
    query: p.get("q") || "",
    status: p.get("status") || "all",
    id: p.get("id") || "",
  };
}
export function previewWrite() {
  return {
    data: null,
    error: { code: "PREVIEW", message: "preview_readonly" },
  } as const;
}
export const eventLabels: Record<string, string> = {
  pending: "aeP",
  preparing: "aeA",
  driver_assigned: "aeD",
  ready: "aeR",
  pickedup: "aeU",
  delivered: "aeV",
  rejected: "aeX",
  cancelled: "aeC",
  at_store: "zAtS",
  at_customer: "zAtC",
};
export function contacts(order: Row, profiles = tables.profiles) {
  const person = (kind: "driver" | "customer") => {
    const id = order[kind + "_id"],
      profile = profiles.find((p) => p.id === id) || {};
    return {
      name: text(profile, "name") || text(order, kind + "_name"),
      phone: text(profile, "phone"),
      image: text(profile, "avatar_url"),
    };
  };
  return { driver: person("driver"), customer: person("customer") };
}
export function secondaryFilter(
  rows: Row[],
  filter: {
    store?: string;
    payment?: string;
    start?: string;
    end?: string;
    sort?: string;
  },
) {
  if (filter.start && filter.end && filter.start > filter.end)
    return { rows, error: "invalid_range" };
  let out = rows.filter(
    (o) =>
      (!filter.store || o.store_id === filter.store) &&
      (!filter.payment || o.payment === filter.payment) &&
      (!filter.start ||
        Date.parse(text(o, "created_at")) >=
          Date.parse(filter.start + "T00:00:00+05:00")) &&
      (!filter.end ||
        Date.parse(text(o, "created_at")) <
          Date.parse(filter.end + "T00:00:00+05:00") + 86400000),
  );
  if (filter.sort)
    out = [...out].sort(
      (a, b) =>
        (Date.parse(text(a, "created_at")) -
          Date.parse(text(b, "created_at"))) *
        (filter.sort === "oldest" ? 1 : -1),
    );
  return { rows: out, error: null };
}

export function elapsedSeconds(end: string, start: string) {
  return Math.max(
    0,
    Math.floor(Date.parse(end) / 1000) - Math.floor(Date.parse(start) / 1000),
  );
}

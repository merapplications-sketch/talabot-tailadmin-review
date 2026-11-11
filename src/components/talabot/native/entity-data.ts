import { tables, text, type Row } from "./domain";
import { isLive, snapshotTime } from "./order-operations";
// The isolated fixture uses `active` for these two tables. A's contract is
// `is_active`. Adapt the read boundary only; never alter fixture or write keys.
export function entityRecord(section: string, row: Row): Row {
  return ["banners", "promotions"].includes(section) &&
    row.is_active == null &&
    typeof row.active === "boolean"
    ? { ...row, is_active: row.active }
    : row;
}
type Status = {
  label: string;
  color: "success" | "warning" | "error" | "info" | "gray";
};
export function entityStatus(
  section: string,
  source: Row,
  now = snapshotTime,
  orders = tables.orders,
): Status {
  const row = entityRecord(section, source);
  if (section === "customers")
    return row.banned_at
      ? { label: "xBanned", color: "error" }
      : { label: "—", color: "gray" };
  if (section === "banners" || section === "promotions") {
    if (row.is_active == null) return { label: "—", color: "gray" };
    if (!row.is_active) return { label: "aBOffS", color: "gray" };
    if (row.starts_at && Date.parse(text(row, "starts_at")) > now)
      return { label: "aBSched", color: "warning" };
    if (row.ends_at && Date.parse(text(row, "ends_at")) <= now)
      return { label: "aBExp", color: "error" };
    // A promoUsed: loaded orders only; cancelled/rejected uses do not count.
    if (
      section === "promotions" &&
      row.max_uses &&
      orders.filter(
        (o) =>
          !o._hist &&
          text(o, "promo_code") === text(row, "code").toUpperCase() &&
          !["rejected", "cancelled"].includes(text(o, "status")),
      ).length >= Number(row.max_uses)
    )
      return { label: "aBExp", color: "error" };
    return { label: "aBNow", color: "success" };
  }
  const value = text(row, section === "drivers" ? "driver_status" : "status");
  if (value) {
    const colors: Record<string, Status["color"]> = {
      approved: "success",
      pending: "warning",
      suspended: "error",
      rejected: "error",
      open: "warning",
      in_progress: "info",
      resolved: "success",
    };
    return {
      label: section === "support" ? "xs_" + value : value,
      color: colors[value] || "gray",
    };
  }
  return typeof row.is_active === "boolean"
    ? {
        label: row.is_active ? "aOn" : "aOff",
        color: row.is_active ? "success" : "gray",
      }
    : { label: "—", color: "gray" };
}
export function filterDrivers(rows: Row[], query: string, filter: string) {
  const q = query.trim().toLowerCase();
  return rows
    .filter(
      (r) =>
        (filter === "all" || (filter === "on" ? isLive(r) : !isLive(r))) &&
        (!q ||
          [text(r, "name"), text(r, "phone")].some((value) =>
            value.toLowerCase().includes(q),
          )),
    )
    .sort(
      (a, b) =>
        Number(isLive(b)) - Number(isLive(a)) ||
        text(a, "name").localeCompare(text(b, "name")),
    );
}
export function cashExceeded(row: Row, balance: number | undefined) {
  return balance != null && balance >= Number(row.cash_limit || 1000);
}

export function activeMerchantBanner(
  storeId: unknown,
  banners = tables.banners,
  now = snapshotTime,
) {
  if (storeId == null) return undefined;
  return banners
    .filter(
      (b) =>
        b.link_type === "store" &&
        b.link_value != null &&
        String(b.link_value) === String(storeId) &&
        entityStatus("banners", b, now).label === "aBNow",
    )
    .sort((a, b) => Number(a.sort || 0) - Number(b.sort || 0))[0];
}
// Read-only identity cues; use the same banner schedule/status rules as its list.
export function identityCues(
  section: string,
  row: Row,
  banners = tables.banners,
  now = snapshotTime,
) {
  return {
    closed:
      section === "restaurants"
        ? row.is_open === false || row.is_active === false
        : section === "customers"
          ? !!row.banned_at
          : false,
    promoted:
      section === "restaurants" &&
      row.id != null &&
      banners.some(
        (b) =>
          b.link_type === "store" &&
          b.link_value != null &&
          String(b.link_value) === String(row.id) &&
          entityStatus("banners", b, now).label === "aBNow",
      ),
  };
}

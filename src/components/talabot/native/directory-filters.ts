import { tables, text, type Row } from "./domain";
import {
  filterDrivers,
  cashExceeded,
  activeMerchantBanner,
} from "./entity-data";
import { isBusy } from "./order-operations";
import { needsRatingFollowup } from "./ratings-data";
import { syntheticCash } from "./scenario-responses";
export const merchantCategories = [
  "rest",
  "grocery",
  "pharmacy",
  "beauty",
  "flowers",
  "gifts",
  "shops",
  "sweets",
];
export const emptyDirectoryFilters = {
  category: "all",
  merchant: "",
  account: "all",
  availability: "all",
  cash: "all",
  banner: "all",
  stars: "all",
  target: "all",
  start: "",
  end: "",
  sort: "default",
};
export type DirectoryFilters = typeof emptyDirectoryFilters;
export function filterDirectoryRows(
  section: string,
  source: Row[],
  query: string,
  status: string,
  filters: DirectoryFilters,
  stores = tables.stores,
) {
  const q = query.trim().toLowerCase();
  const rows = (
    section === "drivers"
      ? filterDrivers(source, q, status)
      : source.filter((row) => {
          const searchable =
            section === "customers"
              ? [row.name, row.phone]
              : Object.values(row);
          if (
            q &&
            !searchable
              .filter((v) => typeof v === "string")
              .join(" ")
              .toLowerCase()
              .includes(q)
          )
            return false;
          if (section === "ratings")
            return status === "need"
              ? needsRatingFollowup(row)
              : status === "done"
                ? !!row.handled_at
                : true;
          if (section === "restaurants")
            return status === "open"
              ? row.is_open === true
              : status === "closed"
                ? row.is_open === false
                : true;
          return status === "all" || text(row, "status") === status;
        })
  ).filter((row) => {
    const store =
      section === "restaurants"
        ? row
        : stores.find((s) => s.id === row.store_id);
    if (["restaurants", "ratings"].includes(section)) {
      if (filters.category !== "all" && store?.category !== filters.category)
        return false;
      if (filters.merchant && String(store?.id) !== filters.merchant)
        return false;
    }
    if (section === "restaurants") {
      if (
        filters.account !== "all" &&
        row.is_active !== (filters.account === "active")
      )
        return false;
      if (
        filters.banner !== "all" &&
        !!activeMerchantBanner(row.id) !== (filters.banner === "yes")
      )
        return false;
    }
    if (section === "drivers") {
      if (filters.account !== "all" && row.driver_status !== filters.account)
        return false;
      if (filters.availability === "busy" && !isBusy(row)) return false;
      if (
        filters.availability === "free" &&
        (isBusy(row) || row.accept_blocked)
      )
        return false;
      if (filters.availability === "paused" && !row.accept_blocked)
        return false;
      if (
        filters.cash === "exceeded" &&
        !cashExceeded(row, syntheticCash[text(row, "id")])
      )
        return false;
    }
    if (
      section === "customers" &&
      filters.account !== "all" &&
      !!row.banned_at !== (filters.account === "blocked")
    )
      return false;
    if (section === "ratings" && filters.stars !== "all") {
      const fields =
        filters.target === "driver"
          ? ["driver_stars"]
          : filters.target === "store"
            ? ["store_stars"]
            : ["driver_stars", "store_stars"];
      if (
        !fields.some(
          (key) =>
            row[key] != null && Number(row[key]) === Number(filters.stars),
        )
      )
        return false;
    }
    if (filters.start || filters.end) {
      const at = Date.parse(text(row, "created_at"));
      if (!Number.isFinite(at)) return false;
      if (filters.start && at < Date.parse(filters.start + "T00:00:00+05:00"))
        return false;
      if (
        filters.end &&
        at >= Date.parse(filters.end + "T00:00:00+05:00") + 86400000
      )
        return false;
    }
    return true;
  });
  return filters.sort === "name"
    ? rows.sort((a, b) => text(a, "name").localeCompare(text(b, "name")))
    : ["newest", "oldest"].includes(filters.sort)
      ? rows.sort(
          (a, b) =>
            (Date.parse(text(a, "created_at")) -
              Date.parse(text(b, "created_at"))) *
            (filters.sort === "newest" ? -1 : 1),
        )
      : rows;
}

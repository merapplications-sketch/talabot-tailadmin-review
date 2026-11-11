import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { OrderStatusBadge } from "../../integrated-review/order-status";
import type { OrderStatus } from "../../orders-data";
import { IdentityImage } from "../../integrated-review/identity";
import { Action } from "../primitives";
import { tables, text, number, statuses, contacts, type Row } from "../domain";
import { formatDate } from "../format";
const panel =
  "rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3";
// B OrdersList complete presentation (orders.tsx): outer layout, search/filter
// panel, quick filters, closed secondary filters, result table/cards and notice.
// Only data/handlers are adapted to the existing native A controller.
const input =
  "mt-2 block min-h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-base text-gray-800 focus:outline-brand-500 dark:border-gray-700 dark:text-gray-200 dark:[color-scheme:dark]";
type Filters = {
  store: string;
  payment: string;
  start: string;
  end: string;
  sort: string;
};
export function OrdersPresentation({
  rows: source,
  t: nativeT,
  onDetails,
  query,
  onSearch,
  status,
  onStatus,
  filters,
  onFilters,
  filterError,
  resultCount,
  loading,
  error,
  onRetry,
  hasMore,
  onMore,
  onReset,
}: {
  rows: Row[];
  query: string;
  onSearch: (query: string) => void;
  status: string;
  onStatus: (status: string) => void;
  filters: Filters;
  onFilters: (filters: Filters) => void;
  filterError: string | null;
  resultCount: number;
  loading: boolean;
  error: string;
  onRetry: () => void;
  hasMore: boolean;
  onMore: () => void;
  onReset: () => void;
  t: (key: string) => string;
  onDetails: (id: string) => void;
}) {
  const t = useTranslations("talabotOrders"),
    locale = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", focusSearch);
    return () => document.removeEventListener("keydown", focusSearch);
  }, []);
  const date = (value: string) => formatDate(value, locale);
  const money = (value: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "TJS",
    }).format(value);
  const rows = source.map((o) => ({
    id: text(o, "id"),
    status: text(o, "status") as OrderStatus,
    created: text(o, "created_at"),
    updated: text(o, "updated_at"),
    customer: contacts(o).customer.name || "—",
    merchantImage: text(
      tables.stores.find((s) => s.id === o.store_id) || {},
      "logo_url",
    ),
    driverImage: contacts(o).driver.image,
    merchant:
      text(tables.stores.find((s) => s.id === o.store_id) || {}, "name") || "—",
    store: false,
    pickup: text(o, "pickup_address") || "—",
    deliveryZone: text(o, "address") || "—",
    driver: contacts(o).driver.name || (o.driver_id ? String(o.driver_id) : ""),
    total: number(o, "total"),
    extra:
      nativeT(text(o, "payment")) +
      " · " +
      tables.order_items
        .filter((i) => i.order_id === o.id)
        .reduce((sum, i) => sum + number(i, "qty"), 0) +
      " " +
      nativeT("aItems") +
      " · " +
      nativeT("aDel") +
      " " +
      number(o, "delivery_fee") +
      " TJS",
  }));
  const details = (o: { id: string }) => (
    <Action
      kind="details"
      label={nativeT("nativeDetails") + " " + o.id}
      onClick={() => onDetails(o.id)}
    />
  );
  const filterValues = {
    q: query,
    status: status === "all" ? "" : status,
    ...filters,
  };
  const filterLabel = (key: string) =>
    key === "q"
      ? t("search")
      : key === "status"
        ? t("statusLabel")
        : key === "store"
          ? t("merchant")
          : key === "payment"
            ? nativeT("uFinM")
            : t(key);
  function resetFilter(key: string) {
    if (key === "q") onSearch("");
    else if (key === "status") onStatus("all");
    else onFilters({ ...filters, [key]: "" });
  }
  return (
    <div
      className="space-y-4 text-gray-800 dark:text-gray-200"
      data-testid="orders-list"
    >
      <section className={panel} aria-label={t("filters")}>
        {/* B basic-tables/table-three header: title and search share one row
            when space allows; the existing B panel owns the padding. */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-title-sm font-semibold">{t("title")}</h1>
            <p role="status" data-testid="result-count" className="text-sm">
              {t("results", { count: resultCount })}
            </p>
          </div>
          <form
            className="tp-order-search flex w-full items-end gap-3 sm:w-auto"
            onSubmit={(e) => {
              e.preventDefault();
              onSearch(query.trim());
            }}
          >
            <label className="min-w-0 flex-1 text-sm sm:w-75">
              {t("search")}
              <input
                className={input}
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => onSearch(e.target.value)}
                placeholder={nativeT("uOq")}
              />
            </label>
            <Button type="submit" size="lg">
              {t("search")}
            </Button>
          </form>
        </div>
        <div className="tp-quick" data-testid="order-quick-filters">
          {["all", "pending", "preparing", "delivered"].map((value) => (
            <Button
              variant="outline"
              size={value === "all" ? "icon-lg" : "lg"}
              type="button"
              key={value}
              aria-pressed={status === value}
              onClick={() => onStatus(value)}
            >
              {value === "all" ? t("all") : t(`status.${value}`)}
            </Button>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <details className="tp-secondary-filters min-w-0 sm:flex-1">
            <summary className="cursor-pointer py-2 text-sm font-medium text-brand-500">
              <span>{t("moreFilters")}</span> · {t(filters.sort || "newest")}
            </summary>
            <div className="tp-filter-grid mt-4 grid gap-3">
              {(["start", "end"] as const).map((key) => (
                <label className="min-w-0 text-sm" key={key}>
                  {t(key)}
                  <input
                    className={input}
                    type="date"
                    value={filters[key]}
                    onChange={(e) =>
                      onFilters({ ...filters, [key]: e.target.value })
                    }
                  />
                </label>
              ))}
            </div>
            <label className="w-full min-w-0 text-sm sm:w-56">
              {t("sort")}
              <select
                className={`${input} pr-10`}
                aria-label={t("sort")}
                value={filters.sort}
                onChange={(e) =>
                  onFilters({ ...filters, sort: e.target.value })
                }
              >
                <option value="">—</option>
                <option value="newest">{t("newest")}</option>
                <option value="oldest">{t("oldest")}</option>
              </select>
            </label>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <label className="min-w-0 text-sm">
                {t("statusLabel")}
                <select
                  className={input}
                  aria-label={t("statusLabel")}
                  value={status}
                  onChange={(e) => onStatus(e.target.value)}
                >
                  <option value="all">{t("all")}</option>
                  {statuses.map((value) => (
                    <option key={value} value={value}>
                      {nativeT(value)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="min-w-0 text-sm">
                {t("merchant")}
                <select
                  className={input}
                  aria-label={t("merchant")}
                  value={filters.store}
                  onChange={(e) =>
                    onFilters({ ...filters, store: e.target.value })
                  }
                >
                  <option value="">{t("all")}</option>
                  {tables.stores.map((row) => (
                    <option key={text(row, "id")} value={text(row, "id")}>
                      {text(row, "name")}
                    </option>
                  ))}
                </select>
              </label>
              <label className="min-w-0 text-sm">
                {nativeT("uFinM")}
                <select
                  className={input}
                  aria-label={nativeT("uFinM")}
                  value={filters.payment}
                  onChange={(e) =>
                    onFilters({ ...filters, payment: e.target.value })
                  }
                >
                  <option value="">{t("all")}</option>
                  {["cash", "wallet", "apple"].map((value) => (
                    <option key={value} value={value}>
                      {nativeT(value)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p className="text-sm">
              {locale === "en"
                ? "Local sample only. Zone data is unavailable in A."
                : "Только локальная выборка. Данные зон отсутствуют в A."}
            </p>
            {filterError && (
              <p role="alert" className="w-full text-red-500">
                {t("invalidRange")}
              </p>
            )}
          </details>
          <Button size="lg" variant="outline" onClick={onReset}>
            {t("reset")}
          </Button>
        </div>
        <div
          className="tp-active-filters flex flex-wrap gap-2"
          aria-label={t("activeFilters")}
        >
          {Object.entries(filterValues)
            .filter(([, value]) => value)
            .map(([key, value]) => (
              <button
                key={key}
                className="max-w-full rounded-lg bg-gray-100 px-3 py-2 text-sm break-words dark:bg-gray-800"
                onClick={() => resetFilter(key)}
              >
                {filterLabel(key)}:{" "}
                {key === "status" || key === "payment"
                  ? nativeT(value)
                  : key === "sort"
                    ? t(value)
                    : key === "store"
                      ? text(
                          tables.stores.find((row) => row.id === value) || {},
                          "name",
                        ) || value
                      : value}{" "}
                ×
              </button>
            ))}
        </div>
      </section>
      {loading ? (
        <div className={panel} role="status">
          {nativeT("uOqBusy")}
        </div>
      ) : error ? (
        <div className={panel} role="alert">
          <p>
            {error === "not_allowed"
              ? nativeT("uOqDeny")
              : locale === "en"
                ? "Could not load orders. Your filters are preserved."
                : "Не удалось загрузить заказы. Фильтры сохранены."}
          </p>
          <Button size="lg" variant="outline" onClick={onRetry}>
            {nativeT("nativeRetry")}
          </Button>
        </div>
      ) : rows.length === 0 ? (
        <div className={panel} data-testid="empty-orders">
          {nativeT("aNo")}
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-gray-200 bg-white xl:block dark:border-gray-800 dark:bg-white/3">
            {/* B basic-tables/table-three cell rhythm; retain full text and
                existing 44px actions instead of truncating long locales. */}
            <table
              className="w-full text-left text-sm"
              data-testid="orders-table"
            >
              <caption className="sr-only">{t("title")}</caption>
              <thead className="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <tr>
                  {[
                    "order",
                    "customer",
                    "merchant",
                    "route",
                    "driver",
                    "statusLabel",
                    "total",
                    "details",
                  ].map((k) => (
                    <th scope="col" key={k} className="px-4 py-3 font-medium">
                      {t(k)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {rows.map((o) => (
                  <tr key={o.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{o.id}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {date(o.created)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">{o.extra}</p>
                    </td>
                    <td className="px-4 py-3">{o.customer}</td>
                    <td className="px-4 py-3">
                      <div className="tp-identity">
                        <IdentityImage
                          name={o.merchant}
                          src={o.merchantImage}
                        />
                        <span>{o.merchant}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {t("merchant")}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {o.pickup}
                      <span className="block text-gray-500">
                        → {o.deliveryZone}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="tp-identity">
                        <IdentityImage
                          name={o.driver || t("unassigned")}
                          person
                          src={o.driverImage || undefined}
                        />
                        <span>{o.driver || t("unassigned")}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge value={o.status} />
                      <p className="mt-2 text-xs text-gray-500">
                        {date(o.updated)}
                      </p>
                    </td>
                    <td className="px-4 py-3 tabular-nums">{money(o.total)}</td>
                    <td className="px-4 py-3">{details(o)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className="grid gap-4 md:grid-cols-2 xl:hidden"
            data-testid="orders-cards"
          >
            {rows.map((o) => (
              <article className={panel} key={o.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold">{o.id}</h2>
                  <OrderStatusBadge value={o.status} />
                </div>
                <div className="tp-identity mt-3">
                  <IdentityImage name={o.merchant} src={o.merchantImage} />
                  <p className="font-medium">{o.merchant}</p>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {date(o.created)} · {t("merchant")}
                </p>
                <dl className="mt-5 space-y-3 text-sm">
                  {[
                    [t("pickup"), o.pickup],
                    [t("delivery"), o.deliveryZone],
                    [t("driver"), o.driver || t("unassigned")],
                    [t("customer"), o.customer],
                    [t("total"), money(o.total)],
                    [nativeT("uFinM"), o.extra],
                  ].map(([k, v]) => (
                    <div
                      className="flex flex-wrap justify-between gap-2"
                      key={k}
                    >
                      <dt className="text-gray-500 dark:text-gray-400">{k}</dt>
                      <dd className="break-words">
                        {k === t("driver") ? (
                          <span className="tp-identity">
                            <IdentityImage
                              name={v}
                              person
                              src={o.driverImage || undefined}
                            />
                            <span>{v}</span>
                          </span>
                        ) : (
                          v
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-4 border-t border-gray-100 pt-2 dark:border-gray-800">
                  {details(o)}
                </div>
              </article>
            ))}
          </div>
        </>
      )}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {nativeT("nativeNotice")} {t("languageNote")}
      </p>
      {hasMore && (
        <Button size="lg" variant="outline" onClick={onMore}>
          {nativeT("aMore")}
        </Button>
      )}
      <p className="text-xs text-gray-500">{nativeT("nativeOrderTime")}</p>
    </div>
  );
}

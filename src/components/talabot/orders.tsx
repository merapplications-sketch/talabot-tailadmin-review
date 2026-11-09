"use client";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  orders,
  orderStatuses,
  merchants,
  zones,
  drivers,
  filterOrders,
  sampleDate,
  type PreviewOrder,
  type OrderStatus,
} from "./orders-data";
const panel =
  "rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3";
const input =
  "mt-2 block min-h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-base text-gray-800 focus:outline-brand-500 dark:border-gray-700 dark:text-gray-200 dark:[color-scheme:dark]";
import {
  IdentityImage,
  demoMerchantImage,
  demoPersonImage,
} from "./integrated-review/identity";
import {
  CheckCircleIcon,
  XIcon,
  TruckDeliveryIcon,
  BoxIcon,
  ClockIcon,
} from "@/icons";
import { entities } from "./directories-data";
const STORE = "talabot-orders-return-v1";
function useFormat() {
  const locale = useLocale();
  return {
    money: (c: number) =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "TJS",
      }).format(c / 100),
    date: (s: string) =>
      new Intl.DateTimeFormat(locale === "tg" ? "en-GB" : locale, {
        timeZone: "Asia/Dushanbe",
        month: locale === "tg" ? "2-digit" : "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date(s)),
  };
}
function Status({ value }: { value: OrderStatus }) {
  const t = useTranslations("talabotOrders");
  const Icon =
    value === "delivered"
      ? CheckCircleIcon
      : value === "cancelled" || value === "rejected"
        ? XIcon
        : value === "pickedup"
          ? TruckDeliveryIcon
          : value === "ready"
            ? BoxIcon
            : ClockIcon;
  return (
    <span className="tp-status" data-status={value}>
      <Icon aria-hidden="true" />
      {t(`status.${value}`)}
    </span>
  );
}
function Notice() {
  const t = useTranslations("talabotOrders");
  return (
    <p className="text-sm text-gray-500 dark:text-gray-400">
      {t("notice")} {t("languageNote")}
    </p>
  );
}
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className={panel}>
      <h2 className="mb-5 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}
export function OrdersList() {
  const t = useTranslations("talabotOrders"),
    router = useRouter(),
    search = useSearchParams(),
    locale = useLocale();
  const { money, date } = useFormat();
  const qs = search.toString();
  const params = useMemo(() => {
    const p = new URLSearchParams(qs);
    const allowed: Record<string, readonly string[]> = {
      status: orderStatuses,
      merchant: merchants,
      driver: [...drivers, "unassigned"],
      pickup: zones,
      delivery: zones,
      period: ["all", "today", "week", "month", "custom"],
      sort: ["newest", "oldest"],
    };
    Object.entries(allowed).forEach(([key, values]) => {
      if (p.has(key) && !values.includes(p.get(key)!)) p.delete(key);
    });
    return p;
  }, [qs]);
  const [draft, setDraft] = useState(params.get("q") || "");
  const [rangeError, setRangeError] = useState(false);
  useEffect(() => setDraft(params.get("q") || ""), [params]);
  const filtered = useMemo(() => filterOrders(params), [params]);
  const pages = Math.max(1, Math.ceil(filtered.length / 10));
  const rawPage = Number(params.get("page"));
  const page = Math.min(
    pages,
    Math.max(1, Number.isFinite(rawPage) ? Math.floor(rawPage) : 1),
  );
  const rows = filtered.slice((page - 1) * 10, page * 10);
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE) || "null");
      if (saved?.restore && saved.locale === locale && saved.query === qs) {
        saved.restore = false;
        sessionStorage.setItem(STORE, JSON.stringify(saved));
        requestAnimationFrame(() =>
          requestAnimationFrame(() => window.scrollTo(0, saved.y)),
        );
      }
    } catch {}
  }, [qs, locale]);
  function update(values: Record<string, string>, reset = true) {
    const next = new URLSearchParams(qs);
    Object.entries(values).forEach(([k, v]) =>
      v ? next.set(k, v) : next.delete(k),
    );
    if (reset) next.delete("page");
    router.replace(`/orders${next.size ? "?" + next.toString() : ""}`, {
      scroll: false,
    });
  }
  function remember() {
    try {
      sessionStorage.setItem(
        STORE,
        JSON.stringify({ query: qs, y: window.scrollY, locale, restore: true }),
      );
    } catch {}
  }
  const details = (o: PreviewOrder) => (
    <Link
      data-testid="order-details"
      href={`/orders/${o.id}${qs ? "?" + qs : ""}`}
      onClick={remember}
      className="inline-flex min-h-11 items-center font-medium text-brand-500 underline-offset-4 hover:underline"
    >
      {t("details")}
      <span className="sr-only"> {o.id}</span>
    </Link>
  );
  function select(key: string, options: string[]) {
    return (
      <label className="min-w-0 text-sm">
        {t(key === "status" ? "statusLabel" : key)}
        <select
          aria-label={t(key === "status" ? "statusLabel" : key)}
          className={input}
          value={params.get(key) || ""}
          onChange={(e) => update({ [key]: e.target.value })}
        >
          <option value="">{t("all")}</option>
          {options.map((v) => (
            <option value={v} key={v}>
              {key === "status"
                ? t(`status.${v}`)
                : v === "unassigned"
                  ? t("unassigned")
                  : v}
            </option>
          ))}
        </select>
      </label>
    );
  }
  return (
    <div
      className="space-y-6 text-gray-800 dark:text-gray-200"
      data-testid="orders-list"
    >
      <div>
        <h1 className="mb-2 text-title-sm font-semibold">{t("title")}</h1>
        <Notice />
      </div>
      <section className={panel} aria-label={t("filters")}>
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            update({ q: draft.trim() });
          }}
        >
          <label className="min-w-0 flex-1 basis-64 text-sm">
            {t("search")}
            <input
              className={input}
              type="search"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t("searchHint")}
            />
          </label>
          <Button type="submit" size="lg">
            {t("search")}
          </Button>
        </form>
        <div className="tp-quick" data-testid="order-quick-filters">
          {["all", "pending", "preparing", "delivered"].map((value) => (
            <button
              type="button"
              key={value}
              aria-pressed={(params.get("status") || "all") === value}
              onClick={() => update({ status: value === "all" ? "" : value })}
            >
              {value === "all" ? t("all") : t(`status.${value}`)}
            </button>
          ))}
        </div>
        <div className="tp-filter-grid mt-4 grid gap-3">
          <label className="text-sm">
            {t("period")}
            <select
              className={input}
              aria-label={t("period")}
              value={params.get("period") || "all"}
              onChange={(e) => {
                setRangeError(false);
                update({ period: e.target.value, start: "", end: "" });
              }}
            >
              {["all", "today", "week", "month", "custom"].map((k) => (
                <option key={k} value={k}>
                  {t(k)}
                </option>
              ))}
            </select>
          </label>
        </div>
        {params.get("period") === "custom" && (
          <form
            className="mt-4 flex flex-wrap items-end gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget),
                start = String(f.get("start")),
                end = String(f.get("end"));
              if (start > end) {
                setRangeError(true);
                return;
              }
              setRangeError(false);
              update({ start, end });
            }}
          >
            <label className="min-w-0 text-sm">
              {t("start")}
              <input
                key={"s" + qs}
                className={input}
                type="date"
                name="start"
                required
                defaultValue={params.get("start") || sampleDate}
              />
            </label>
            <label className="min-w-0 text-sm">
              {t("end")}
              <input
                key={"e" + qs}
                className={input}
                type="date"
                name="end"
                required
                defaultValue={params.get("end") || sampleDate}
              />
            </label>
            <Button variant="outline" type="submit">
              {t("apply")}
            </Button>
            {rangeError && (
              <p role="alert" className="w-full text-red-500">
                {t("invalidRange")}
              </p>
            )}
          </form>
        )}
        <details className="mt-5">
          <summary className="cursor-pointer py-2 text-sm font-medium text-brand-500">
            {t("moreFilters")}
          </summary>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {select("status", [...orderStatuses])}
            {select("merchant", merchants)}
            {select("driver", [...drivers, "unassigned"])}
            {select("pickup", zones)}
            {select("delivery", zones)}
          </div>
        </details>
        <div
          className="mt-4 flex flex-wrap gap-2"
          aria-label={t("activeFilters")}
        >
          {[
            "q",
            "period",
            "status",
            "merchant",
            "driver",
            "pickup",
            "delivery",
            "start",
            "end",
          ]
            .filter((k) => params.get(k) && params.get(k) !== "all")
            .map((k) => (
              <button
                key={k}
                className="max-w-full rounded-lg bg-gray-100 px-3 py-2 text-sm break-words dark:bg-gray-800"
                onClick={() => {
                  update({
                    [k]: "",
                    ...(k === "period" ? { start: "", end: "" } : {}),
                  });
                  setRangeError(false);
                }}
              >
                {t(k === "q" ? "search" : k === "status" ? "statusLabel" : k)}:{" "}
                {k === "status"
                  ? t(`status.${params.get(k)}`)
                  : k === "period"
                    ? t(params.get(k)!)
                    : params.get(k) === "unassigned"
                      ? t("unassigned")
                      : params.get(k)}{" "}
                ×
              </button>
            ))}
        </div>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <p role="status" data-testid="result-count" className="text-sm">
            {t("results", { count: filtered.length })}
          </p>
          <label className="w-full min-w-0 text-sm sm:w-56">
            {t("sort")}
            <select
              className={`${input} pr-10`}
              aria-label={t("sort")}
              value={params.get("sort") || "newest"}
              onChange={(e) => update({ sort: e.target.value })}
            >
              <option value="newest">{t("newest")}</option>
              <option value="oldest">{t("oldest")}</option>
            </select>
          </label>
          <Button
            variant="outline"
            onClick={() => {
              setRangeError(false);
              setDraft("");
              router.replace("/orders", { scroll: false });
            }}
          >
            {t("reset")}
          </Button>
        </div>
      </section>
      {rows.length === 0 ? (
        <div className={panel} data-testid="empty-orders">
          {t("empty")}
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-gray-200 bg-white xl:block dark:border-gray-800 dark:bg-white/3">
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
                    <th scope="col" key={k} className="px-4 py-5 font-medium">
                      {t(k)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {rows.map((o) => (
                  <tr key={o.id}>
                    <td className="px-4 py-5">
                      <p className="font-medium">{o.id}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {date(o.created)}
                      </p>
                    </td>
                    <td className="px-4 py-5">{o.customer}</td>
                    <td className="px-4 py-5">
                      <div className="tp-identity">
                        <IdentityImage
                          name={o.merchant}
                          src={demoMerchantImage}
                        />
                        <span>{o.merchant}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {t(o.store ? "store" : "restaurant")}
                      </p>
                    </td>
                    <td className="px-4 py-5">
                      {o.pickup}
                      <span className="block text-gray-500">
                        → {o.deliveryZone}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <div className="tp-identity">
                        <IdentityImage
                          name={o.driver || t("unassigned")}
                          person
                          src={o.driver ? demoPersonImage : undefined}
                        />
                        <span>{o.driver || t("unassigned")}</span>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <Status value={o.status} />
                      <p className="mt-2 text-xs text-gray-500">
                        {date(o.updated)}
                      </p>
                    </td>
                    <td className="px-4 py-5 tabular-nums">{money(o.total)}</td>
                    <td className="px-4 py-5">{details(o)}</td>
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
                  <Status value={o.status} />
                </div>
                <div className="tp-identity mt-3">
                  <IdentityImage name={o.merchant} src={demoMerchantImage} />
                  <p className="font-medium">{o.merchant}</p>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {date(o.created)} · {t(o.store ? "store" : "restaurant")}
                </p>
                <dl className="mt-5 space-y-3 text-sm">
                  {[
                    [t("customer"), o.customer],
                    [t("pickup"), o.pickup],
                    [t("delivery"), o.deliveryZone],
                    [t("driver"), o.driver || t("unassigned")],
                    [t("total"), money(o.total)],
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
                              src={o.driver ? demoPersonImage : undefined}
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
      <nav
        aria-label={t("pagination")}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => update({ page: String(page - 1) }, false)}
        >
          {t("previous")}
        </Button>
        <span data-testid="page-number" className="text-sm">
          {t("page", { page, pages })}
        </span>
        <Button
          variant="outline"
          disabled={page === pages}
          onClick={() => update({ page: String(page + 1) }, false)}
        >
          {t("next")}
        </Button>
      </nav>
      <p className="text-xs text-gray-500">{t("timezone")}</p>
    </div>
  );
}
export function OrderDetails({ id }: { id: string }) {
  const t = useTranslations("talabotOrders"),
    search = useSearchParams(),
    workspace = useTranslations("workspace");
  const { money, date } = useFormat();
  const [copy, setCopy] = useState("");
  const o = orders.find((x) => x.id === id);
  const qs = search.toString();
  const returnTo =
    /^\/(restaurants|drivers|customers|notifications)\/[a-zA-Z0-9-]+(?:\?.*)?$/.test(
      search.get("returnTo") || "",
    )
      ? search.get("returnTo")
      : null;
  const back = (
    <Link
      href={returnTo || `/orders${qs ? "?" + qs : ""}`}
      scroll={false}
      className="inline-flex min-h-11 items-center text-sm font-medium text-brand-500"
    >
      ← {returnTo ? workspace("return") : t("back")}
    </Link>
  );
  if (!o)
    return (
      <div className="space-y-6 text-gray-800 dark:text-gray-200">
        {back}
        <div className={panel}>
          <h1 className="text-title-sm">{t("notFound")}</h1>
          <Notice />
        </div>
      </div>
    );
  return (
    <div
      className="space-y-6 text-gray-800 dark:text-gray-200"
      data-testid="order-detail"
    >
      {back}
      <Notice />
      <section className={panel}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm text-gray-500">{t("order")}</p>
            <h1 className="text-title-sm font-semibold">{o.id}</h1>
          </div>
          <Status value={o.status} />
        </div>
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <p>
            {t("created")}: {date(o.created)}
          </p>
          <p>
            {t("updated")}: {date(o.updated)}
          </p>
          <p>
            {t("payment")}: {t("notProvided")}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(o.id);
                setCopy(t("copied"));
              } catch {
                setCopy(t("copyFailed"));
              }
            }}
          >
            {t("copy")}
          </Button>
          <span role="status" className="text-sm">
            {copy}
          </span>
        </div>
      </section>
      <div className="grid items-start gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Section title={t("customer")}>
            <Link
              className="font-medium text-brand-500"
              href={`/customers/${entities("customers").find((e) => e.name === o.customer)?.id}`}
            >
              {o.customer}
            </Link>
            <p className="mt-3 text-sm">
              {t("delivery")}: {o.deliveryZone}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {t("address", { number: 24 })}
            </p>
            <p className="mt-3 text-sm text-gray-500">
              {t("notes")}: {t("notProvided")}
            </p>
          </Section>
          <Section title={t("merchant")}>
            <p className="font-medium">
              <Link
                className="text-brand-500"
                href={`/restaurants/${entities("restaurants").find((e) => e.name === o.merchant)?.id}`}
              >
                {o.merchant}
              </Link>{" "}
              · {t(o.store ? "store" : "restaurant")}
            </p>
            <p className="mt-3 text-sm">
              {t("pickup")}: {o.pickup}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {t("address", { number: 12 })}
            </p>
            <p className="mt-3 text-sm text-gray-500">
              {t("prep")}: {t("notProvided")}
            </p>
          </Section>
          <Section title={t("items")}>
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {o.items.map((item) => (
                <li
                  className="flex flex-wrap justify-between gap-4 py-4"
                  key={item.key}
                >
                  <div>
                    <p className="font-medium">{t(`item.${item.key}`)}</p>
                    <p className="mt-2 text-sm text-gray-500">
                      {item.quantity} × {money(item.unit)} · {t("standard")}
                    </p>
                  </div>
                  <p className="tabular-nums">
                    {money(item.unit * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap justify-between gap-3 font-semibold">
              <span>{t("total")}</span>
              <span>{money(o.total)}</span>
            </div>
            <details
              className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-800"
              data-testid="amount-breakdown"
            >
              <summary className="cursor-pointer py-2 text-sm font-medium text-brand-500">
                {t("amounts")}
              </summary>
              <dl className="mt-4 space-y-4 text-sm">
                {[
                  [t("subtotal"), money(o.subtotal)],
                  [t("deliveryFee"), money(o.delivery)],
                  [t("discount"), `−${money(o.discount)}`],
                  [t("total"), money(o.total)],
                ].map(([k, v]) => (
                  <div className="flex flex-wrap justify-between gap-3" key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs text-gray-500">{t("amountNote")}</p>
            </details>
          </Section>
        </div>
        <div className="space-y-6">
          <Section title={t("route")}>
            <dl className="space-y-5">
              <div>
                <dt className="text-sm text-gray-500">{t("pickup")}</dt>
                <dd className="mt-2">
                  {o.pickup} · {o.merchant}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">{t("delivery")}</dt>
                <dd className="mt-2">
                  {o.deliveryZone} · {o.customer}
                </dd>
              </div>
            </dl>
            <p className="mt-5 text-sm text-gray-500">{t("noTracking")}</p>
          </Section>
          <Section title={t("driver")}>
            <p>
              {o.driver ? (
                <Link
                  className="text-brand-500"
                  href={`/drivers/${entities("drivers").find((e) => e.name === o.driver)?.id}`}
                >
                  {o.driver}
                </Link>
              ) : (
                t("unassigned")
              )}
            </p>
            <p className="mt-3 text-sm text-gray-500">
              {t("assignment")}: {t("notProvided")}
            </p>
          </Section>
          <Section title={t("history")}>
            <p className="mb-5 text-xs text-gray-500">{t("historyNote")}</p>
            <ol className="space-y-6 border-l border-gray-200 pl-4 dark:border-gray-700">
              {o.history.map((event, i) => (
                <li key={i}>
                  <Status value={event.status} />
                  <p className="mt-2 text-sm text-gray-500">{date(event.at)}</p>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-xs text-gray-500">{t("timezone")}</p>
          </Section>
        </div>
      </div>
    </div>
  );
}

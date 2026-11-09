"use client";
import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { useTheme } from "@/context/theme-context";
import { entities, notices, type Directory } from "./directories-data";
import { orderStatuses, zones } from "./orders-data";
import {
  dates,
  selectOrders,
  totals,
  expenses,
  SNAPSHOT,
  merchants as historicalMerchants,
} from "./analytics-data";
import { useReadNotices } from "./notification-state";
import { PreviewNotice } from "./preview";
const panel =
  "rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3";
const input =
  "mt-2 block min-h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-base dark:border-gray-700 dark:[color-scheme:dark]";
const button =
  "inline-flex min-h-11 items-center rounded-lg border border-gray-300 px-4 py-2 disabled:opacity-40 dark:border-gray-700";
type Row = { id: string; name: string; values: string[]; href: string };
function useListing() {
  const params = useSearchParams(),
    router = useRouter(),
    path = usePathname(),
    locale = useLocale();
  const qs = params.toString();
  const latest = useRef(qs);
  useEffect(() => {
    latest.current = qs;
  }, [qs]);
  const key = `talabot-list:${locale}:${path}?${qs}`;
  useEffect(() => {
    const y = sessionStorage.getItem(key);
    if (y !== null) {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => window.scrollTo(0, Number(y))),
      );
    }
  }, [key]);
  return {
    params,
    qs,
    remember: () => sessionStorage.setItem(key, String(window.scrollY)),
    set: (k: string, v: string) => {
      const p = new URLSearchParams(latest.current);
      if (v) p.set(k, v);
      else p.delete(k);
      if (!k.startsWith("history") && k !== "page") p.delete("page");
      if (k.startsWith("history") && k !== "historyPage")
        p.delete("historyPage");
      latest.current = p.toString();
      router.replace(`${path}?${p}`, { scroll: false });
    },
  };
}
function Shell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("workspace");
  return (
    <div className="space-y-6 text-gray-800 dark:text-gray-200">
      <PreviewNotice />
      <h1 className="text-title-sm font-semibold">{title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">{t("notice")}</p>
      {children}
    </div>
  );
}
function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="block min-w-0 text-sm">
      {label}
      <select
        aria-label={label}
        className={`${input} pe-10`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(([v, n]) => (
          <option key={v} value={v}>
            {n}
          </option>
        ))}
      </select>
    </label>
  );
}
function Grid({
  rows,
  headers,
  remember,
  firstHeader,
}: {
  firstHeader?: string;
  rows: Row[];
  headers: string[];
  remember: () => void;
}) {
  const t = useTranslations("workspace");
  return (
    <>
      <div className="hidden overflow-x-auto xl:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              {[firstHeader || t("name"), ...headers, t("details")].map(
                (h, i) => (
                  <th className="px-4 py-4" key={i}>
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-t border-gray-200 dark:border-gray-800"
              >
                <td className="p-4 font-medium">{r.name}</td>
                {r.values.map((v, i) => (
                  <td key={i} className="p-4">
                    {v}
                  </td>
                ))}
                <td className="p-4">
                  <Link
                    className="text-brand-500"
                    href={r.href}
                    onClick={remember}
                  >
                    {t("details")}
                    <span className="sr-only"> {r.name}</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:hidden">
        {rows.map((r) => (
          <article className={panel} key={r.id}>
            <h2 className="mb-5 text-lg font-semibold break-words">{r.name}</h2>
            <dl className="space-y-3">
              {r.values.map((v, i) => (
                <div className="flex flex-wrap justify-between gap-2" key={i}>
                  <dt className="text-gray-500 dark:text-gray-400">
                    {headers[i]}
                  </dt>
                  <dd className="break-words">{v}</dd>
                </div>
              ))}
            </dl>
            <Link
              className="mt-5 inline-flex min-h-11 items-center text-brand-500"
              href={r.href}
              onClick={remember}
            >
              {t("details")}
            </Link>
          </article>
        ))}
      </div>
      {!rows.length && (
        <p role="status" className="p-6">
          {t("empty")}
        </p>
      )}
    </>
  );
}
function Pages({
  count,
  page,
  set,
}: {
  count: number;
  page: number;
  set: (k: string, v: string) => void;
}) {
  const t = useTranslations("workspace"),
    pages = Math.max(1, Math.ceil(count / 8));
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
      <p>
        {t("count", { count })} · {t("page", { page, pages })}
      </p>
      <div className="flex gap-3">
        <button
          className={button}
          disabled={page <= 1}
          onClick={() => set("page", String(page - 1))}
        >
          {t("previous")}
        </button>
        <button
          className={button}
          disabled={page >= pages}
          onClick={() => set("page", String(page + 1))}
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
}
function pageNumber(value: string | null, count: number) {
  return Math.min(
    Math.max(1, Math.floor(Number(value)) || 1),
    Math.max(1, Math.ceil(count / 8)),
  );
}
export function DirectoryPage({ kind, id }: { kind: Directory; id?: string }) {
  const t = useTranslations("workspace"),
    nav = useTranslations("talabot"),
    st = useTranslations("talabotOrders"),
    { params, qs, set, remember } = useListing(),
    locale = useLocale();
  const money = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "TJS",
    }).format(n / 100);
  const all = entities(kind),
    entity = all.find((e) => e.id === id);
  const history =
    entity?.orders.filter(
      (o) =>
        (!params.get("historyStatus") ||
          o.status === params.get("historyStatus")) &&
        o.id
          .toLowerCase()
          .includes((params.get("historyQ") || "").toLowerCase()),
    ) || [];
  const historyPage = pageNumber(params.get("historyPage"), history.length);
  const historySet = (key: string, value: string) =>
    set(key === "page" ? "historyPage" : key, value);
  if (id)
    return (
      <Shell title={entity?.name || t("notfound")}>
        <Link
          className={button}
          href={`/${kind}?${new URLSearchParams([...params].filter(([k]) => !k.startsWith("history")))}`}
          scroll={false}
        >
          {t("back")}
        </Link>
        {entity && (
          <>
            <section className={panel}>
              <h2 className="text-lg font-semibold">{entity.name}</h2>
              <p className="mt-4 text-gray-500">{t("missing")}</p>
              <p className="mt-4">
                {t("area")}:{" "}
                {[
                  ...new Set(
                    entity.orders.flatMap((o) => [o.pickup, o.deliveryZone]),
                  ),
                ].join(", ")}
              </p>
            </section>
            <section className={panel}>
              <h2 className="mb-5 text-lg font-semibold">{t("history")}</h2>
              <div className="mb-6 grid gap-5 md:grid-cols-2">
                <label>
                  {t("search")}
                  <input
                    className={input}
                    value={params.get("historyQ") || ""}
                    onChange={(e) => set("historyQ", e.target.value)}
                  />
                </label>
                <Select
                  label={t("status")}
                  value={params.get("historyStatus") || ""}
                  onChange={(v) => set("historyStatus", v)}
                  options={[
                    ["", t("all")],
                    ...orderStatuses.map(
                      (status) =>
                        [status, st(`status.${status}`)] as [string, string],
                    ),
                  ]}
                />
              </div>
              <Grid
                headers={[t("status"), t("pickup"), t("delivery"), t("total")]}
                remember={remember}
                rows={history
                  .slice((historyPage - 1) * 8, historyPage * 8)
                  .map((o) => ({
                    id: o.id,
                    name: o.id,
                    values: [
                      st(`status.${o.status}`),
                      o.pickup,
                      o.deliveryZone,
                      money(o.total),
                    ],
                    href: `/orders/${o.id}?returnTo=${encodeURIComponent(`/${kind}/${id}?${qs}`)}`,
                  }))}
              />
              <Pages
                count={history.length}
                page={historyPage}
                set={historySet}
              />
            </section>
          </>
        )}
      </Shell>
    );
  const q = (params.get("q") || "").toLowerCase(),
    area = params.get("area") || "",
    type = params.get("type") || "";
  const filtered = all
    .filter(
      (e) =>
        e.name.toLowerCase().includes(q) &&
        (!area ||
          e.orders.some((o) => o.pickup === area || o.deliveryZone === area)) &&
        (!type ||
          e.orders.some((o) => (o.store ? "store" : "restaurant") === type)),
    )
    .sort(
      (a, b) =>
        a.name.localeCompare(b.name) * (params.get("sort") === "desc" ? -1 : 1),
    );
  const page = pageNumber(params.get("page"), filtered.length);
  return (
    <Shell title={nav(kind)}>
      <section className={panel}>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <label>
            {t("search")}
            <input
              className={input}
              value={params.get("q") || ""}
              onChange={(e) => set("q", e.target.value)}
            />
          </label>
          <Select
            label={t("area")}
            value={area}
            onChange={(v) => set("area", v)}
            options={[
              ["", t("all")],
              ...zones.map((z) => [z, z] as [string, string]),
            ]}
          />
          {kind === "restaurants" && (
            <Select
              label={t("type")}
              value={type}
              onChange={(v) => set("type", v)}
              options={[
                ["", t("all")],
                ["restaurant", t("restaurant")],
                ["store", t("store")],
              ]}
            />
          )}
          <Select
            label={t("sort")}
            value={params.get("sort") || "asc"}
            onChange={(v) => set("sort", v)}
            options={[
              ["asc", t("ascending")],
              ["desc", t("descending")],
            ]}
          />
        </div>
      </section>
      <section className={panel}>
        <Grid
          headers={[t("orders"), t("area")]}
          remember={remember}
          rows={filtered.slice((page - 1) * 8, page * 8).map((e) => ({
            id: e.id,
            name: e.name,
            values: [
              String(e.orders.length),
              [
                ...new Set(
                  e.orders.map((o) =>
                    kind === "customers" ? o.deliveryZone : o.pickup,
                  ),
                ),
              ].join(", "),
            ],
            href: `/${kind}/${e.id}?${qs}`,
          }))}
        />
        <Pages count={filtered.length} page={page} set={set} />
      </section>
    </Shell>
  );
}
export function AnalyticsPage({
  kind,
  id,
}: {
  kind: "finance" | "reports";
  id?: string;
}) {
  const t = useTranslations("workspace"),
    nav = useTranslations("talabot"),
    { params, qs, set, remember } = useListing(),
    locale = useLocale();
  const at = useTranslations("talabotAnalytics");
  const period = params.get("period") || "month";
  const start =
      period === "today"
        ? SNAPSHOT
        : period === "week"
          ? "2026-11-03"
          : period === "month"
            ? "2026-11-01"
            : params.get("start") || "2026-11-01",
    end = period === "custom" ? params.get("end") || SNAPSHOT : SNAPSHOT;
  const validDate = (value: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value + "T00:00:00Z")) &&
    new Date(value + "T00:00:00Z").toISOString().slice(0, 10) === value;
  const valid =
    validDate(start) &&
    validDate(end) &&
    start >= "2026-09-01" &&
    end <= SNAPSHOT &&
    start <= end;
  const days = valid ? dates(start, end) : [];
  const validId =
    !id ||
    (validDate(id) &&
      id >= "2026-09-01" &&
      id <= SNAPSHOT &&
      new Date(id + "T00:00:00Z").toISOString().slice(0, 10) === id);
  const selected = valid && validId ? selectOrders(id || start, id || end) : [],
    sum = totals(selected),
    cost =
      valid && validId ? expenses(id || start, id || end) : { recorded: 0 };
  const money = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "TJS",
    }).format(n);
  const page = pageNumber(params.get("page"), days.length);
  const metrics =
    kind === "finance"
      ? [
          [t("sales"), money(sum.sales)],
          [t("revenue"), money(sum.revenue)],
          [t("expenses"), money(cost.recorded)],
        ]
      : [
          [t("orders"), String(sum.orders)],
          [t("completed"), String(sum.completed)],
          [t("cancelled"), String(sum.cancelled)],
          [t("delayed"), String(sum.delayed)],
          [t("other"), String(sum.orders - sum.completed - sum.cancelled)],
        ];
  return (
    <Shell title={nav(kind) + (id ? ` · ${id}` : "")}>
      <p className="text-sm text-gray-500">{t("historical")}</p>
      {id ? (
        <Link className={button} href={`/${kind}?${qs}`} scroll={false}>
          {t("back")}
        </Link>
      ) : (
        <section className={`${panel} grid gap-5 sm:grid-cols-2`}>
          <Select
            label={t("date")}
            value={period}
            onChange={(v) => set("period", v)}
            options={["today", "week", "month", "custom"].map(
              (v) => [v, at(v)] as [string, string],
            )}
          />
          {period === "custom" &&
            ["start", "end"].map((k) => (
              <label key={k}>
                {t(k)}
                <input
                  type="date"
                  min="2026-09-01"
                  max={SNAPSHOT}
                  className={input}
                  value={k === "start" ? start : end}
                  onChange={(e) => set(k, e.target.value)}
                />
              </label>
            ))}
        </section>
      )}
      {!valid || !validId ? (
        <p role="alert">{t("invalid")}</p>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {metrics.map(([label, value]) => (
              <section className={panel} key={label}>
                <h2 className="text-gray-500">{label}</h2>
                <p className="mt-4 text-2xl font-semibold">{value}</p>
              </section>
            ))}
          </div>
          {kind === "finance" && <p>{t("profit")}</p>}
          {id && (
            <section className={panel}>
              <h2 className="mb-5 text-lg font-semibold">{at("merchants")}</h2>
              <div className="grid gap-5 md:grid-cols-2">
                {historicalMerchants.map((merchant, index) => {
                  const subtotal = totals(
                    selected.filter((o) => o.merchant === index),
                  );
                  return (
                    <article
                      className="rounded-xl border border-gray-200 p-5 dark:border-gray-800"
                      key={merchant.name}
                    >
                      <h3 className="font-semibold">{merchant.name}</h3>
                      <p className="mt-2 text-sm">
                        {at(merchant.type)} ·{" "}
                        {at(["north", "south", "east", "west"][merchant.zone])}
                      </p>
                      <dl className="mt-4 space-y-3">
                        {[
                          [t("orders"), subtotal.orders],
                          [t("sales"), money(subtotal.sales)],
                          [t("revenue"), money(subtotal.revenue)],
                        ].map(([label, value]) => (
                          <div
                            className="flex flex-wrap justify-between gap-2"
                            key={label}
                          >
                            <dt>{label}</dt>
                            <dd>{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
          {!id && (
            <section className={panel}>
              <Grid
                firstHeader={t("date")}
                headers={[
                  t("completed"),
                  kind === "finance" ? t("sales") : t("orders"),
                ]}
                remember={remember}
                rows={days
                  .slice()
                  .reverse()
                  .slice((page - 1) * 8, page * 8)
                  .map((d) => {
                    const s = totals(selectOrders(d, d));
                    return {
                      id: d,
                      name: d,
                      values: [
                        String(s.completed),
                        kind === "finance" ? money(s.sales) : String(s.orders),
                      ],
                      href: `/${kind}/${d}?${qs}`,
                    };
                  })}
              />
              <Pages count={days.length} page={page} set={set} />
            </section>
          )}
        </>
      )}
    </Shell>
  );
}
export function NotificationsPage({ id }: { id?: string }) {
  const t = useTranslations("workspace"),
    nav = useTranslations("talabot"),
    st = useTranslations("talabotOrders"),
    { params, qs, set, remember } = useListing(),
    { read, mark } = useReadNotices();
  const item = notices.find((n) => n.id === id);
  const filtered = notices.filter(
    (n) =>
      `${n.order.id} ${n.order.merchant}`
        .toLowerCase()
        .includes((params.get("q") || "").toLowerCase()) &&
      (!params.get("state") ||
        (params.get("state") === "read") === read.includes(n.id)),
  );
  const page = pageNumber(params.get("page"), filtered.length);
  return (
    <Shell title={nav("notifications")}>
      <p>{t("local")}</p>
      {id ? (
        <>
          <Link className={button} href={`/notifications?${qs}`} scroll={false}>
            {t("back")}
          </Link>
          <section className={panel}>
            {item ? (
              <>
                <h2 className="text-lg font-semibold">
                  {t("notification")} · {item.order.id}
                </h2>
                <p className="my-4">
                  {item.order.merchant} · {st(`status.${item.order.status}`)}
                </p>
                <p className="mb-4">{item.order.updated}</p>
                <button
                  className={button}
                  disabled={read.includes(id)}
                  onClick={() => mark(id)}
                >
                  {read.includes(id) ? t("read") : t("mark")}
                </button>
                <Link
                  className="ms-4 text-brand-500"
                  href={`/orders/${item.order.id}?returnTo=${encodeURIComponent(`/notifications/${id}?${qs}`)}`}
                  onClick={remember}
                >
                  {t("details")}
                </Link>
              </>
            ) : (
              t("notfound")
            )}
          </section>
        </>
      ) : (
        <>
          <section className={`${panel} grid gap-5 md:grid-cols-2`}>
            <label>
              {t("search")}
              <input
                className={input}
                value={params.get("q") || ""}
                onChange={(e) => set("q", e.target.value)}
              />
            </label>
            <Select
              label={t("status")}
              value={params.get("state") || ""}
              onChange={(v) => set("state", v)}
              options={[
                ["", t("all")],
                ["read", t("read")],
                ["unread", t("unread")],
              ]}
            />
          </section>
          <section className={panel}>
            <Grid
              headers={[t("name"), t("status")]}
              remember={remember}
              rows={filtered.slice((page - 1) * 8, page * 8).map((n) => ({
                id: n.id,
                name: n.order.id,
                values: [
                  n.order.merchant,
                  t(read.includes(n.id) ? "read" : "unread"),
                ],
                href: `/notifications/${n.id}?${qs}`,
              }))}
            />
            <Pages count={filtered.length} page={page} set={set} />
          </section>
        </>
      )}
    </Shell>
  );
}
export function SettingsPage() {
  const t = useTranslations("workspace"),
    nav = useTranslations("talabot"),
    locale = useLocale(),
    router = useRouter(),
    { themeMode, setThemeMode } = useTheme();
  return (
    <Shell title={nav("settings")}>
      <section className={`${panel} grid gap-6 md:grid-cols-2`}>
        <Select
          label={t("language")}
          value={locale}
          onChange={(v) => router.replace("/settings", { locale: v })}
          options={[
            ["en", "English"],
            ["ru", "Русский"],
            ["tg", "Тоҷикӣ"],
          ]}
        />
        <Select
          label={t("theme")}
          value={themeMode}
          onChange={(v) => setThemeMode(v as "light" | "dark" | "auto")}
          options={[
            ["light", t("light")],
            ["dark", t("dark")],
            ["auto", t("auto")],
          ]}
        />
      </section>
      <fieldset disabled className={panel}>
        <p>{t("disabled")}</p>
      </fieldset>
    </Shell>
  );
}

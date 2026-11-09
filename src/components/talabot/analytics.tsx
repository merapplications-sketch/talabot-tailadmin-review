"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import type { ApexOptions } from "apexcharts";
import { useTheme } from "@/context/theme-context";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import * as data from "./analytics-data";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const card =
  "text-gray-800 dark:text-gray-200 min-w-0 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-white/3";
const input =
  "min-w-0 rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-base dark:border-gray-700";
function Card({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section className={card} data-testid={id}>
      <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        {title}
      </h2>
      {children}
    </section>
  );
}
function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="my-3 text-sm text-gray-500 dark:text-gray-400">{children}</p>
  );
}
function Choices({
  values,
  value,
  onChange,
  label,
}: {
  values: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="mb-4 flex flex-wrap gap-2">
      {values.map((v) => (
        <button
          key={v.value}
          type="button"
          aria-pressed={value === v.value}
          onClick={() => onChange(v.value)}
          className={`rounded-lg border px-3 py-2 text-sm font-medium ${value === v.value ? "border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400" : "border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300"}`}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}
function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="max-w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-y border-gray-100 dark:border-gray-800">
            {headers.map((h) => (
              <TableCell
                key={h}
                isHeader
                className="px-3 py-3 text-start text-xs font-medium whitespace-nowrap text-gray-500"
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow
              key={i}
              className="border-b border-gray-100 dark:border-gray-800"
            >
              {row.map((v, j) => (
                <TableCell
                  key={j}
                  className="px-3 py-4 text-sm whitespace-nowrap text-gray-700 dark:text-gray-300"
                >
                  {v}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
function Plot({
  categories,
  series,
  height = 200,
  type = "bar",
  onSelect,
}: {
  categories: string[];
  series: { name: string; data: (number | null)[] }[];
  height?: number;
  type?: "bar" | "area";
  onSelect?: (index: number) => void;
}) {
  const { theme } = useTheme();
  const options: ApexOptions = {
    colors: ["#F36831", "#98A2B3"],
    chart: {
      background: "transparent",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
      animations: { enabled: false },
      events: {
        dataPointSelection: (_e, _ctx, config) => {
          if (config && config.dataPointIndex >= 0)
            onSelect?.(config.dataPointIndex);
        },
      },
    },
    theme: { mode: theme === "dark" ? "dark" : "light" },
    plotOptions: { bar: { columnWidth: "38%", borderRadius: 8 } },
    stroke: { curve: "smooth", width: type === "area" ? 2 : 0 },
    dataLabels: { enabled: false },
    fill: {
      type: type === "area" ? "gradient" : "solid",
      opacity: type === "area" ? 0.25 : 1,
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      labels: {
        formatter: (v) => (Number.isInteger(v) ? String(v) : v.toFixed(1)),
      },
    },
    grid: { borderColor: theme === "dark" ? "#1E2640" : "#F3F4F6" },
    tooltip: {
      y: {
        formatter: (v) =>
          v == null
            ? "—"
            : v.toLocaleString("en-US", { maximumFractionDigits: 1 }),
      },
    },
    legend: { show: series.length > 1 },
    noData: { text: "—" },
  };
  return (
    <div className="max-w-full overflow-x-auto">
      <div className="min-w-162.5 xl:min-w-full">
        <Chart options={options} series={series} type={type} height={height} />
      </div>
    </div>
  );
}
export default function AnalyticsDashboard() {
  const t = useTranslations("talabotAnalytics");
  const locale = useLocale();
  const [period, setPeriod] = useState("month");
  const [range, setRange] = useState({
    start: "2026-11-01",
    end: data.SNAPSHOT,
  });
  const [draft, setDraft] = useState(range);
  const [error, setError] = useState(false);
  const [metric, setMetric] = useState<"completed" | "sales">("completed");
  const [ranking, setRanking] = useState<"completed" | "sales">("completed");
  const [day, setDay] = useState<number | null>(null);
  const [qualityBy, setQualityBy] = useState("merchant");
  const source = useMemo(
    () => data.selectOrders(range.start, range.end),
    [range],
  );
  const total = data.totals(source);
  const prev = data.previousRange(range.start, range.end);
  const previous = data.selectOrders(prev.start, prev.end);
  const previousTotal = data.totals(previous);
  const fmt = (n: number | null) =>
    n === null
      ? "—"
      : new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(n);
  const zones = ["north", "south", "east", "west"].map((k) => t(k));
  const weekdays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((k) =>
    t(k),
  );
  const choosePeriod = (value: string) => {
    setPeriod(value);
    setError(false);
    if (value !== "custom") {
      const next = {
        start:
          value === "today"
            ? data.SNAPSHOT
            : value === "week"
              ? data.shift(data.SNAPSHOT, -6)
              : "2026-11-01",
        end: data.SNAPSHOT,
      };
      setRange(next);
      setDraft(next);
    }
  };
  const targetCompleted = data.totals(
    data.selectOrders(data.MONTH + "-01", data.SNAPSHOT),
  ).completed;
  const expense = data.expenses(range.start, range.end);
  const compare = previousTotal[metric]
    ? `${fmt((total[metric] / previousTotal[metric] - 1) * 100)}%`
    : t("noComparison");
  const targetOptions: ApexOptions = {
    colors: ["#F36831"],
    chart: { fontFamily: "Outfit, sans-serif", animations: { enabled: false } },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: { size: "80%" },
        track: { background: "#98A2B333" },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "36px",
            fontWeight: 600,
            offsetY: -35,
            formatter: (v) => `${v.toFixed(1)}%`,
          },
        },
      },
    },
    stroke: { lineCap: "round" },
  };
  return (
    <div
      className="col-span-12 grid min-w-0 grid-cols-12 gap-4 md:gap-6"
      data-testid="analytics"
    >
      <div className="col-span-12">
        <Card title={t("title")}>
          <Note>{t("sample")}</Note>
          {locale === "tg" && <Note>{t("languageNote")}</Note>}
          <Choices
            label={t("custom")}
            values={["today", "week", "month", "custom"].map((v) => ({
              value: v,
              label: t(v),
            }))}
            value={period}
            onChange={choosePeriod}
          />
          {period === "custom" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (data.validRange(draft.start, draft.end)) {
                  setRange(draft);
                  setError(false);
                } else setError(true);
              }}
              className="flex flex-wrap items-end gap-3"
            >
              <label className="grid gap-1 text-sm">
                {t("start")}
                <input
                  className={input}
                  type="date"
                  min="2026-10-01"
                  max={data.SNAPSHOT}
                  value={draft.start}
                  onChange={(e) =>
                    setDraft({ ...draft, start: e.target.value })
                  }
                />
              </label>
              <label className="grid gap-1 text-sm">
                {t("end")}
                <input
                  className={input}
                  type="date"
                  min="2026-10-01"
                  max={data.SNAPSHOT}
                  value={draft.end}
                  onChange={(e) => setDraft({ ...draft, end: e.target.value })}
                />
              </label>
              <button
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm text-white"
                type="submit"
              >
                {t("apply")}
              </button>
            </form>
          )}
          {error && (
            <p role="alert" className="text-error-600 mt-2 text-sm">
              {t("rangeError")}
            </p>
          )}
          <Note>
            {t("current")}:{" "}
            <span data-testid="period-range">
              {range.start} — {range.end}
            </span>
          </Note>
        </Card>
      </div>
      <div className="col-span-12 xl:col-span-7">
        <Card title={t("performance")}>
          <Choices
            label={t("performance")}
            values={["completed", "sales"].map((v) => ({
              value: v,
              label: t(v),
            }))}
            value={metric}
            onChange={(v) => setMetric(v as typeof metric)}
          />
          <p className="text-3xl font-semibold" data-testid="performance-total">
            {fmt(total[metric])}
          </p>
          <Note>
            {t("previous")}: {prev.start} — {prev.end} ·{" "}
            {fmt(previousTotal[metric])}
            <br />
            {t("change")}: {compare}
          </Note>
          <Plot
            categories={data.dates(range.start, range.end)}
            series={[
              {
                name: t("current"),
                data: data.daily(source, range.start, range.end, metric),
              },
              {
                name: t("previous"),
                data: data.daily(previous, prev.start, prev.end, metric),
              },
            ]}
          />
        </Card>
      </div>
      <div className="col-span-12 xl:col-span-5">
        <Card title={t("target")} id="monthly-target">
          <Note>{t("example")}</Note>
          <div className="max-h-45 overflow-hidden">
            <Chart
              options={targetOptions}
              series={[
                Math.min(100, (targetCompleted / data.EXAMPLE_TARGET) * 100),
              ]}
              type="radialBar"
              height={330}
            />
          </div>
          <Note>{t("independent")}</Note>
          <DataTable
            headers={[t("completed"), t("goal"), t("remaining")]}
            rows={[
              [
                fmt(targetCompleted),
                fmt(data.EXAMPLE_TARGET),
                fmt(Math.max(0, data.EXAMPLE_TARGET - targetCompleted)),
              ],
            ]}
          />
        </Card>
      </div>
      <div className="col-span-12">
        <Card title={t("finance")}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {(
              [
                ["sales", total.sales],
                ["revenue", total.revenue],
                ["expenses", expense.recorded],
              ] as const
            ).map(([key, value]) => (
              <div key={key}>
                <Note>{t(key)}</Note>
                <p className="text-2xl font-semibold">{fmt(value)}</p>
              </div>
            ))}
          </div>
          <p
            className="mt-4 text-sm text-amber-700 dark:text-amber-400"
            data-testid="profit-status"
          >
            {t("profit")}
          </p>
          <Note>{t("financeNote")}</Note>
          <Plot
            height={310}
            type="area"
            categories={data.dates(range.start, range.end)}
            series={[
              {
                name: t("revenue"),
                data: data.daily(source, range.start, range.end, "revenue"),
              },
            ]}
          />
        </Card>
      </div>
      <div className="col-span-12 xl:col-span-5">
        <Card title={t("regions")}>
          <Note>
            {t("allOrders")} · {t("zones")}
          </Note>
          {zones.map((zone, i) => {
            const n = source.filter((o) => o.delivery === i).length;
            return (
              <div key={zone} className="mb-6">
                <div className="mb-2 flex justify-between gap-3 text-sm">
                  <span>{zone}</span>
                  <span>
                    {fmt(n)} ·{" "}
                    {fmt(source.length ? (n / source.length) * 100 : 0)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-2 rounded-full bg-brand-500"
                    style={{
                      width: `${source.length ? (n / source.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </Card>
      </div>
      <div className="col-span-12 xl:col-span-7">
        <Card title={t("flows")}>
          <Note>{t("allOrders")}</Note>
          <DataTable
            headers={[t("pickup"), t("delivery"), t("count")]}
            rows={zones.flatMap((z, i) =>
              zones.map((d, j) => [
                z,
                d,
                source.filter((o) => o.pickup === i && o.delivery === j).length,
              ]),
            )}
          />
        </Card>
      </div>
      <div className="col-span-12">
        <Card title={t("merchants")}>
          <Choices
            label={t("ranking")}
            values={["completed", "sales"].map((v) => ({
              value: v,
              label: t(v),
            }))}
            value={ranking}
            onChange={(v) => setRanking(v as typeof ranking)}
          />
          <DataTable
            headers={[
              t("name"),
              t("type"),
              t("area"),
              t("completed"),
              t("sales"),
            ]}
            rows={data.merchants
              .map((m, i) => ({
                ...m,
                totals: data.totals(source.filter((o) => o.merchant === i)),
              }))
              .sort((a, b) => b.totals[ranking] - a.totals[ranking])
              .map((m) => [
                m.name,
                t(m.type),
                zones[m.zone],
                fmt(m.totals.completed),
                fmt(m.totals.sales),
              ])}
          />
        </Card>
      </div>
      <div className="col-span-12">
        <Card title={t("days")} id="weekday-orders">
          <Note>{t("average")}</Note>
          <Choices
            label={t("days")}
            values={[
              { value: "all", label: t("allDays") },
              ...weekdays.map((label, i) => ({ value: String(i), label })),
            ]}
            value={day === null ? "all" : String(day)}
            onChange={(v) => setDay(v === "all" ? null : Number(v))}
          />
          <Plot
            categories={weekdays}
            series={[
              {
                name: t("count"),
                data: data.weekdayMeans(range.start, range.end),
              },
            ]}
            onSelect={setDay}
          />
        </Card>
      </div>
      <div className="col-span-12">
        <Card
          title={`${t("hours")} — ${day === null ? t("allDays") : weekdays[day]}`}
          id="hourly-orders"
        >
          <Note>{t("hourNote")}</Note>
          <Plot
            categories={Array.from(
              { length: 24 },
              (_, i) => String(i).padStart(2, "0") + ":00",
            )}
            series={[{ name: t("count"), data: data.hours(source, day) }]}
          />
          <p
            className="text-sm text-gray-500"
            aria-live="polite"
            data-testid="hourly-total"
          >
            {t("count")}:{" "}
            {fmt(data.hours(source, day).reduce((s, n) => s + n, 0))}
          </p>
        </Card>
      </div>
      <div className="col-span-12">
        <Card title={t("coverage")}>
          <Note>{t("coverageNote")}</Note>
          <DataTable
            headers={[
              t("pickup"),
              t("count"),
              t("available"),
              t("assignment"),
              t("pickupWait"),
            ]}
            rows={zones.map((z, i) => {
              const sample = source.filter(
                (o) => o.pickup === i && !o.cancelled,
              );
              return [
                z,
                source.filter((o) => o.pickup === i).length,
                fmt(data.availability(range.start, range.end, i)),
                fmt(data.mean(sample.map((o) => o.assignment))),
                fmt(data.mean(sample.map((o) => o.pickupWait))),
              ];
            })}
          />
        </Card>
      </div>
      <div className="col-span-12">
        <Card title={t("quality")}>
          <Choices
            label={t("quality")}
            values={[
              { value: "merchant", label: t("name") },
              { value: "area", label: t("delivery") },
            ]}
            value={qualityBy}
            onChange={setQualityBy}
          />
          <Note>{t("qualityNote")}</Note>
          <DataTable
            headers={[
              qualityBy === "merchant" ? t("name") : t("delivery"),
              t("count"),
              t("delayed"),
              t("cancelled"),
              t("reason"),
            ]}
            rows={(qualityBy === "merchant"
              ? data.merchants.map((m) => m.name)
              : zones
            ).map((name, i) => {
              const sample = source.filter(
                (o) =>
                  (qualityBy === "merchant" ? o.merchant : o.delivery) === i,
              );
              const sums = data.totals(sample);
              return [
                name,
                sums.orders,
                sums.delayed,
                sums.cancelled,
                [0, 1, 2]
                  .map(
                    (r) =>
                      `${t(`reason${r}`)}: ${sample.filter((o) => o.cancelled && o.reason === r).length}`,
                  )
                  .join(" · "),
              ];
            })}
          />
        </Card>
      </div>
    </div>
  );
}

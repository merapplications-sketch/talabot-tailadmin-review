/** Deterministic fictional observations. Local date/hour keys are Asia/Dushanbe. */
export const SNAPSHOT = "2026-11-09";
export const FIRST_DATE = "2026-09-01";
export const MONTH = "2026-11";
export const EXAMPLE_TARGET = 2400;
export const merchants = [
  { name: "Demo Kitchen A", type: "restaurant", zone: 0 },
  { name: "Demo Market B", type: "store", zone: 1 },
  { name: "Demo Kitchen C", type: "restaurant", zone: 2 },
  { name: "Demo Market D", type: "store", zone: 3 },
] as const;
export type Order = {
  date: string;
  hour: number;
  merchant: number;
  pickup: number;
  delivery: number;
  completed: boolean;
  cancelled: boolean;
  delayed: boolean;
  reason: number;
  sales: number;
  revenue: number;
  assignment: number;
  pickupWait: number;
};
export function shift(date: string, days: number) {
  const d = new Date(date + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export function dates(start: string, end: string) {
  const out: string[] = [];
  for (let d = start; d <= end; d = shift(d, 1)) out.push(d);
  return out;
}
export function weekday(date: string) {
  return (new Date(date + "T00:00:00Z").getUTCDay() + 6) % 7;
}
export function previousRange(start: string, end: string) {
  const n = dates(start, end).length;
  return { start: shift(start, -n), end: shift(start, -1) };
}
export function validRange(start: string, end: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(start) &&
    /^\d{4}-\d{2}-\d{2}$/.test(end) &&
    start >= "2026-10-01" &&
    end <= SNAPSHOT &&
    start <= end &&
    previousRange(start, end).start >= FIRST_DATE
  );
}
export const orders: Order[] = dates(FIRST_DATE, SNAPSHOT).flatMap(
  (date, day) =>
    Array.from({ length: 65 + ((day * 17) % 59) }, (_, i) => {
      const merchant = (i + day) % 4;
      const cancelled = (i + day * 3) % 13 === 0;
      const completed = !cancelled && (i + day) % 17 !== 0;
      return {
        date,
        hour: [8, 10, 12, 12, 13, 14, 17, 18, 18, 19, 20, 22][(i + day) % 12],
        merchant,
        pickup: merchants[merchant].zone,
        delivery: (i * 3 + Math.floor(i / 4) + day) % 4,
        completed,
        cancelled,
        delayed: !cancelled && (i + day) % 9 === 0,
        reason: (i + day) % 3,
        sales: completed ? (25 + ((i * 7 + day) % 150)) * 100 : 0,
        revenue: completed ? (3 + ((i + day) % 12)) * 100 : 0,
        assignment: 2 + ((i + day) % 18),
        pickupWait: 3 + ((i * 3 + day) % 22),
      };
    }),
);
export function selectOrders(start: string, end: string, source = orders) {
  return source.filter((o) => o.date >= start && o.date <= end);
}
export function totals(source: Order[]) {
  return {
    orders: source.length,
    completed: source.filter((o) => o.completed).length,
    sales: source.reduce((s, o) => s + o.sales, 0) / 100,
    revenue: source.reduce((s, o) => s + o.revenue, 0) / 100,
    cancelled: source.filter((o) => o.cancelled).length,
    delayed: source.filter((o) => o.delayed).length,
  };
}
export function weekdayMeans(start: string, end: string, source = orders) {
  const counts = Array(7).fill(0) as number[];
  dates(start, end).forEach((d) => counts[weekday(d)]++);
  const sums = Array(7).fill(0) as number[];
  selectOrders(start, end, source).forEach((o) => sums[weekday(o.date)]++);
  return counts.map((n, i) => (n ? sums[i] / n : null));
}
export function hours(source: Order[], day: number | null) {
  const values = Array(24).fill(0) as number[];
  source
    .filter((o) => day === null || weekday(o.date) === day)
    .forEach((o) => values[o.hour]++);
  return values;
}
export function daily(
  source: Order[],
  start: string,
  end: string,
  metric: "completed" | "sales" | "revenue",
) {
  return dates(start, end).map(
    (d) => totals(source.filter((o) => o.date === d))[metric],
  );
}
// Independent expense/availability fixtures, not a commission formula or allocation rule.
export function expenses(start: string, end: string) {
  return {
    recorded: dates(start, end).reduce(
      (s, d) => s + 120 + ((Number(d.slice(-2)) * 31) % 90),
      0,
    ),
    complete: false as const,
    profit: null,
  };
}
export function availability(start: string, end: string, zone: number) {
  const observations = dates(start, end).flatMap((d) =>
    [8, 12, 18, 22].map((h) => 3 + ((Number(d.slice(-2)) + h + zone) % 8)),
  );
  return observations.reduce((s, n) => s + n, 0) / observations.length;
}
export function mean(values: number[]) {
  return values.length
    ? values.reduce((s, n) => s + n, 0) / values.length
    : null;
}

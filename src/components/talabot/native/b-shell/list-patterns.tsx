import { useLocale, useTranslations } from "next-intl";
import { OrderStatusBadge } from "../../integrated-review/order-status";
import type { OrderStatus } from "../../orders-data";
import { IdentityImage } from "../../integrated-review/identity";
import { Action } from "../primitives";
import { tables, text, number, type Row } from "../domain";
import { formatDate } from "../format";
const panel =
  "rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3";
// Exact B OrdersList table/cards + polish hooks; A fields remain visible.
export function OrdersPresentation({
  rows: source,
  t: nativeT,
  onDetails,
}: {
  rows: Row[];
  t: (key: string) => string;
  onDetails: (id: string) => void;
}) {
  const t = useTranslations("talabotOrders"),
    locale = useLocale();
  const date = (value: string) => formatDate(value, locale);
  const money = (value: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "TJS",
    }).format(value);
  const demoMerchantImage = undefined,
    demoPersonImage = undefined;
  const rows = source.map((o) => ({
    id: text(o, "id"),
    status: text(o, "status") as OrderStatus,
    created: text(o, "created_at"),
    updated: text(o, "updated_at"),
    customer: text(o, "customer_name") || "—",
    merchant:
      text(tables.stores.find((s) => s.id === o.store_id) || {}, "name") || "—",
    store: false,
    pickup: text(o, "pickup_address") || "—",
    deliveryZone: text(o, "address") || "—",
    driver:
      text(o, "driver_name") ||
      text(tables.profiles.find((p) => p.id === o.driver_id) || {}, "name") ||
      (o.driver_id ? String(o.driver_id) : ""),
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
  return (
    <>
      <div className="hidden overflow-x-auto rounded-2xl border border-gray-200 bg-white xl:block dark:border-gray-800 dark:bg-white/3">
        <table className="w-full text-left text-sm" data-testid="orders-table">
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
                  <p className="mt-1 text-xs text-gray-500">{o.extra}</p>
                </td>
                <td className="px-4 py-5">{o.customer}</td>
                <td className="px-4 py-5">
                  <div className="tp-identity">
                    <IdentityImage name={o.merchant} src={demoMerchantImage} />
                    <span>{o.merchant}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{t("merchant")}</p>
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
                  <OrderStatusBadge value={o.status} />
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
              <OrderStatusBadge value={o.status} />
            </div>
            <div className="tp-identity mt-3">
              <IdentityImage name={o.merchant} src={demoMerchantImage} />
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
                <div className="flex flex-wrap justify-between gap-2" key={k}>
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
  );
}

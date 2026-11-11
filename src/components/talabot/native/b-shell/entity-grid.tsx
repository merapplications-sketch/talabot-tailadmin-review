import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import NativeIdentity from "./identity";
import { OrderStatusBadge } from "../../integrated-review/order-status";
import type { OrderStatus } from "../../orders-data";
import { Action } from "../primitives";
const panel =
  "rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3";
// B workspace Grid markup unchanged; native routing and optional source identity injected.
export function NativeGrid({
  rows,
  headers,
  firstHeader,
  onDetails,
}: {
  rows: {
    id: string;
    name: string;
    values: ReactNode[];
    identity?: "person" | "merchant";
    image?: string;
    presence?: boolean;
    presenceLabel?: string;
    closed?: boolean;
    promoted?: boolean;
    closedLabel?: string;
    promotedLabel?: string;
    compactValues?: number[];
    event?: string;
    unread?: boolean;
    updated?: string;
    orderStatus?: OrderStatus;
  }[];
  headers: string[];
  firstHeader?: string;
  onDetails: (id: string) => void;
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
                <td className="p-4 font-medium">
                  <div className="tp-identity">
                    {r.identity && (
                      <NativeIdentity
                        name={r.name}
                        person={r.identity === "person"}
                        src={r.image}
                        presence={r.presence}
                        presenceLabel={r.presenceLabel}
                        closed={r.closed}
                        promoted={r.promoted}
                        closedLabel={r.closedLabel}
                        promotedLabel={r.promotedLabel}
                      />
                    )}
                    <span>
                      {r.event && (
                        <span className="block">
                          {r.unread && (
                            <span
                              className="tp-unread"
                              aria-label={t("unread")}
                            />
                          )}
                          {r.event}
                        </span>
                      )}
                      {r.orderStatus && (
                        <span className="my-2 block">
                          <OrderStatusBadge value={r.orderStatus} />
                        </span>
                      )}
                      {r.name}
                      {r.updated && (
                        <small className="block text-gray-500">
                          {r.updated}
                        </small>
                      )}
                    </span>
                  </div>
                </td>
                {r.values.map((v, i) => (
                  <td key={i} className="p-4">
                    {v}
                  </td>
                ))}
                <td className="p-4">
                  <Action
                    kind="details"
                    label={t("details") + " " + r.name}
                    onClick={() => onDetails(r.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:hidden">
        {rows.map((r) => (
          <article
            className={`${panel} ${r.event ? "tp-event" : ""}`}
            data-unread={r.unread}
            key={r.id}
            onClick={(e) => {
              if (
                !(e.target as HTMLElement).closest("button, a, input, select")
              )
                onDetails(r.id);
            }}
          >
            {r.event && (
              <h3 className="tp-event-heading mb-3">
                {r.unread && (
                  <span className="tp-unread" aria-label={t("unread")} />
                )}
                {r.event}
              </h3>
            )}
            {r.orderStatus && (
              <div className="mb-3">
                <OrderStatusBadge value={r.orderStatus} />
              </div>
            )}
            <div className="tp-identity mb-2">
              {r.identity && (
                <NativeIdentity
                  name={r.name}
                  person={r.identity === "person"}
                  src={r.image}
                  presence={r.presence}
                  presenceLabel={r.presenceLabel}
                  closed={r.closed}
                  promoted={r.promoted}
                  closedLabel={r.closedLabel}
                  promotedLabel={r.promotedLabel}
                />
              )}
              <h2
                className="line-clamp-2 min-w-0 flex-1 text-base! font-semibold break-words"
                title={r.name}
              >
                {r.name}
              </h2>{" "}
              <Action
                kind="details"
                label={t("details") + " " + r.name}
                onClick={() => onDetails(r.id)}
              />
            </div>
            {r.updated && (
              <p className="mb-3 text-sm text-gray-500">{r.updated}</p>
            )}
            <dl className="space-y-2 text-sm">
              {r.values.map(
                (v, i) =>
                  (r.compactValues || [0, 1, 2]).includes(i) && (
                    <div
                      className="flex flex-wrap justify-between gap-2"
                      key={i}
                    >
                      <dt className="text-gray-500 dark:text-gray-400">
                        {headers[i]}
                      </dt>
                      <dd className="min-w-0 text-end font-medium break-words text-gray-800 dark:text-gray-200">
                        {v}
                      </dd>
                    </div>
                  ),
              )}
            </dl>
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

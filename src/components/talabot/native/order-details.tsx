import { actionColors } from "./action-colors";
import { useLocale, useTranslations } from "next-intl";
import { formatDate } from "./format";
import { CallIcon, MapIcon, ClockIcon } from "@/icons";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { OrderStatusBadge } from "../integrated-review/order-status";
import type { OrderStatus } from "../orders-data";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AssignmentDialog from "./assignment-dialog";
import { canAssign } from "./order-operations";
import { Card } from "./primitives";
import {
  Card as BCard,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import type { ReactNode } from "react";
// B invoice/description row: muted label, prominent saved value. No calculation changes.
function Pair({
  label,
  children,
  emphasis = false,
}: {
  label: string;
  children: ReactNode;
  emphasis?: boolean;
}) {
  return (
    <dl
      className={
        emphasis
          ? "mt-5 flex items-start justify-between gap-4 border-t border-gray-200 pt-5 text-lg dark:border-gray-800"
          : "flex items-start justify-between gap-4 text-sm"
      }
    >
      <dt
        className={
          emphasis
            ? "font-semibold text-gray-800 dark:text-white/90"
            : "text-gray-500 dark:text-gray-400"
        }
      >
        {label}
      </dt>
      <dd
        className={
          emphasis
            ? "font-bold text-brand-600 tabular-nums dark:text-brand-400"
            : "min-w-0 text-end font-medium text-gray-800 tabular-nums dark:text-gray-200"
        }
      >
        {children}
      </dd>
    </dl>
  );
}
function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <Accordion>
        <AccordionItem value="details">
          <AccordionTrigger>{title}</AccordionTrigger>
          <AccordionContent keepMounted>
            <div className="space-y-3">{children}</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
import {
  tables,
  text,
  number,
  finance,
  parseLocation,
  contacts,
  eventLabels,
  elapsedSeconds,
  type Row,
} from "./domain";
type Props = {
  order: Row;
  t: (key: string) => string;
  hideBack?: boolean;
  back: () => void;
};
const money = (n: number) => n.toFixed(2) + " TJS";
export default function OrderDetails({
  order: o,
  t,
  back,
  hideBack = false,
}: Props) {
  const locale = useLocale(),
    ownerT = useTranslations("ownerRound"),
    orderT = useTranslations("talabotOrders");
  const [assigning, setAssigning] = useState(false);
  const f = finance(o),
    store = tables.stores.find((s) => s.id === o.store_id),
    driver = contacts(o).driver,
    client = contacts(o).customer,
    items = tables.order_items.filter((i) => i.order_id === o.id),
    events = tables.order_events.filter((e) => e.order_id === o.id),
    chat = tables.order_chat.filter((e) => e.order_id === o.id);
  const duration = (a: string, b: string) => {
    const sec = elapsedSeconds(a, b),
      min = Math.floor(sec / 60);
    return (
      (min ? min + " " + t("aMin") + " " : "") + (sec % 60) + " " + t("aSec")
    );
  };
  const party = (label: string, row: Row | undefined, name?: string) => (
    <BCard size="sm" className="gap-1 rounded-2xl shadow-theme-xs">
      <CardDescription>{label}</CardDescription>
      <CardContent className="flex items-start justify-between gap-3">
        <p className="min-w-0 text-sm font-semibold break-words text-gray-800 dark:text-gray-200">
          {name || text(row || {}, "name") || "—"}
        </p>
        {row?.phone ? (
          <Button
            variant="ghost"
            size="icon-lg"
            nativeButton={false}
            className="shrink-0 text-green-600! hover:bg-green-50 dark:text-green-400! dark:hover:bg-green-500/15"
            aria-label={t("aCall") + ": " + text(row, "phone")}
            title={t("aCall") + ": " + text(row, "phone")}
            render={<a href={"tel:" + text(row, "phone")} />}
          >
            <CallIcon className={actionColors.phone} aria-hidden="true" />
          </Button>
        ) : (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {t("aDrvNoPh")}
          </span>
        )}
      </CardContent>
    </BCard>
  );
  return (
    <div className="space-y-3 sm:space-y-4">
      {assigning && (
        <AssignmentDialog order={o} t={t} close={() => setAssigning(false)} />
      )}
      {!hideBack && (
        <Button variant="outline" onClick={back} size="lg">
          ← {t("aBack")}
        </Button>
      )}
      <Card title={"#" + text(o, "id")}>
        <Pair label={t("status")}>
          <OrderStatusBadge value={text(o, "status") as OrderStatus} />
        </Pair>
        <p>{formatDate(text(o, "created_at"), locale)}</p>
        {!!o.arrived_store_at && (
          <Pair label={t("zAtS")}>
            {formatDate(text(o, "arrived_store_at"), locale)}
          </Pair>
        )}
        {!!o.arrived_cust_at && (
          <Pair label={t("zAtC")}>
            {formatDate(text(o, "arrived_cust_at"), locale)}
          </Pair>
        )}
        {!!o.cancel_reason && (
          <p>
            {t("zRj")}: {t("cr_" + text(o, "cancel_reason"))}{" "}
            {text(o, "cancel_note")}
          </p>
        )}
        {!!o.scheduled_for && (
          <Pair label={t("ySched")}>{formatDate(text(o, "scheduled_for"), locale)}</Pair>
        )}
        {!!o.group_id && <Pair label={t("yGrp")}>{text(o, "group_id")}</Pair>}
        {canAssign(o) ? (
          <Button
            size="lg"
            variant="outline"
            onClick={() => setAssigning(true)}
          >
            {t("aAssign")}
          </Button>
        ) : (
          <p className="mt-3 text-sm text-gray-500">
            {t(o.driver_id ? "nativeAssignAlready" : "nativeAssignStatus")}
          </p>
        )}
        {!!o.delivery_photo && (
          <p>
            {t("zPhO")}: {t("nativeProofMissing")}
          </p>
        )}
      </Card>
      <section data-testid="order-journey">
        <DetailSection title={ownerT("journey")}>
          {events.length ? (
            <ol className="space-y-5 border-s-2 border-brand-500 ps-5">
              {events.map((e, i) => (
                <li key={text(e, "id")} className="relative">
                  <ClockIcon
                    className="absolute -start-8 top-0 size-5 rounded-full bg-white text-brand-500 dark:bg-gray-900"
                    aria-hidden="true"
                  />
                  <Pair
                    label={
                      eventLabels[text(e, "kind")]
                        ? t(eventLabels[text(e, "kind")])
                        : t("aeUnk") + ": " + text(e, "kind")
                    }
                  >
                    {formatDate(text(e, "at"), locale)}
                    {i > 0 && (
                      <span className="block text-sm font-normal text-gray-500 dark:text-gray-400">
                        (+{duration(text(e, "at"), text(events[i - 1], "at"))})
                      </span>
                    )}
                  </Pair>
                </li>
              ))}
            </ol>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {ownerT("noEvents")}
              </p>
              <Pair label={ownerT("created")}>
                {formatDate(text(o, "created_at"), locale)}
              </Pair>
            </div>
          )}
          {events.length > 1 && (
            <Pair label={t("aTotalT")}>
              {duration(
                text(events[events.length - 1], "at"),
                text(events[0], "at"),
              )}
            </Pair>
          )}
        </DetailSection>
      </section>
      <div className="grid gap-4 lg:grid-cols-3">
        {party(t("aStoreL"), store)}
        {party(t("aDrvL"), driver)}
        {party(t("aClient"), client)}
      </div>
      <DetailSection title={t("address")}>
        <Pair label={orderT("pickup")}>{text(o, "pickup_address") || "—"}</Pair>
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 font-medium break-words">
            {text(o, "address")}
          </p>
          {o.lat != null && o.lng != null && (
            <Button
              variant="ghost"
              size="icon-lg"
              className="shrink-0 text-brand-500"
              nativeButton={false}
              aria-label={t("aOnMap")}
              title={t("aOnMap")}
              render={
                <a
                  href={`https://www.google.com/maps?q=${o.lat},${o.lng}`}
                  target="_blank"
                  rel="noreferrer"
                />
              }
            >
              <MapIcon aria-hidden="true" />
            </Button>
          )}
        </div>
        {!!o.leave_at_door && <p>{t("yDoor")}</p>}
        {!!o.is_gift && (
          <p>
            {t("yGift")}{" "}
            {tables.order_recipient
              .filter((r) => r.order_id === o.id)
              .map((r) => text(r, "name") + " " + text(r, "phone"))
              .join(", ")}
          </p>
        )}
        {!!o.substitution && (
          <p>
            {text(o, "substitution") === "call"
              ? ownerT("subCall")
              : t("ySub_" + text(o, "substitution"))}
          </p>
        )}
      </DetailSection>
      <section data-testid="order-invoice">
        <DetailSection title={ownerT("invoice")}>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {ownerT("amounts")} · #{text(o, "id")}
          </p>
          {items.map((i) => (
            <div
              key={text(i, "id")}
              className="border-b border-gray-200 py-3 dark:border-gray-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {text(i, "name")}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {number(i, "qty")} × {money(number(i, "price"))}
                  </p>
                </div>
                <p className="shrink-0 font-semibold whitespace-nowrap tabular-nums">
                  {money(number(i, "qty") * number(i, "price"))}
                </p>
              </div>
              <p>
                {((i.options as Row[]) || [])
                  .map((x) => text(x, "n"))
                  .join(", ")}
              </p>
              <p>{text(i, "note")}</p>
            </div>
          ))}
          {[
            ["subtotal", "aSub"],
            ["discount", "aDisc"],
            ["promo_discount", "aPromo"],
            ["hh_discount", "yHhIn"],
            ["points_value", "yPtsUsed"],
          ]
            .filter(
              ([k]) =>
                ["subtotal", "tip", "total"].includes(k) || number(o, k) > 0,
            )
            .map(([k, label]) => (
              <Pair
                key={k}
                label={
                  t(label) +
                  (k === "promo_discount" ? " " + text(o, "promo_code") : "")
                }
              >
                {[
                  "discount",
                  "promo_discount",
                  "hh_discount",
                  "points_value",
                ].includes(k)
                  ? "−"
                  : ""}
                {money(number(o, k))}
                {k === "delivery_extra" && number(o, "delivery_km") > 0
                  ? " (" + number(o, "delivery_km") + " km)"
                  : ""}
              </Pair>
            ))}
          {number(o, "fee_waived") > 0 ? (
            <>
              <Pair label={t("uDelCust")}>0.00 TJS</Pair>
              <Pair label={t("uDelRest")}>
                {money(number(o, "fee_waived"))}
              </Pair>
            </>
          ) : null}
          {number(o, "delivery_extra") > 0 ? (
            <>
              <Pair label={t("aDelBase")}>
                {money(number(o, "delivery_base"))}
              </Pair>
              <Pair
                label={t("aDelFar") + " (" + number(o, "delivery_km") + " km)"}
              >
                {money(number(o, "delivery_extra"))}
              </Pair>
            </>
          ) : number(o, "fee_waived") === 0 ? (
            <Pair label={t("aDelF")}>{money(number(o, "delivery_fee"))}</Pair>
          ) : null}
          <Pair label={t("aTip")}>{money(number(o, "tip"))}</Pair>
          <Pair label={t("aTot")} emphasis>
            {money(number(o, "total"))}
          </Pair>
          {number(o, "points_used") > 0 && (
            <Pair label={t("yPtsUsed")}>{number(o, "points_used")}</Pair>
          )}
          {(number(o, "points_earned") > 0 || number(o, "cashback") > 0) && (
            <Pair label={t("yGiven")}>
              {number(o, "points_earned")} · {money(number(o, "cashback"))}
            </Pair>
          )}
        </DetailSection>
      </section>
      <DetailSection title={t("uFinT")}>
        <Pair label={t("uFinM")}>{t(text(o, "payment"))}</Pair>
        <Pair
          label={
            f.wallet
              ? ownerT("walletRecorded")
              : f.cash
                ? t("uFinGot")
                : t("uFinM")
          }
        >
          {f.cash
            ? f.delivered
              ? f.collected == null
                ? "—"
                : money(Number(f.collected))
              : t(f.dead ? "uFinCashNo" : "uFinCashWait")
            : f.wallet
              ? f.walletUsed > 0
                ? money(f.walletUsed)
                : t("uFinWalPayNo")
              : t("uFinOnl")}
        </Pair>
        {f.cash && f.delivered && (
          <Pair label={t("uFinT")}>
            {t(f.settled ? "aSettled" : "aNotSet")}
          </Pair>
        )}
        {!!o.cash_note && (
          <Pair label={t("aCashNote")}>{text(o, "cash_note")}</Pair>
        )}
        {f.walletUsed > 0 && !f.wallet && (
          <Pair label={t("uFinWalUse")}>{"−" + money(f.walletUsed)}</Pair>
        )}
        {f.dead && f.walletUsed > 0 && (
          <Pair label={t("uFinWalBack")}>
            {f.walletReturned
              ? money(f.walletUsed) + " · " + f.walletReturned
              : t("uFinWalNo")}
          </Pair>
        )}
        {number(o, "points_used") > 0 && (
          <Pair label={t("uFinPts")}>
            {number(o, "points_used")} ({money(number(o, "points_value"))})
          </Pair>
        )}
        {f.dead && number(o, "points_used") > 0 && (
          <Pair label={t("uFinPtsBack")}>
            {text(o, "points_returned_at") || t("uFinPtsNo")}
          </Pair>
        )}
        {f.dead && f.online && <p>{t("uFinCardNo")}</p>}
        {number(o, "tip") > 0 && (
          <Pair label={t("uFinTip")}>
            {money(number(o, "tip"))}
            <span className="block text-xs font-normal text-gray-500 dark:text-gray-400">
              {t(
                f.delivered
                  ? "uFinTipOk"
                  : f.dead
                    ? "uFinTipNo"
                    : "uFinTipWait",
              )}
            </span>
          </Pair>
        )}
        <Pair label={t("uFinCom") + " (" + number(o, "commission_pct") + "%)"}>
          {money(f.commission)}
          <span className="block text-xs font-normal text-gray-500 dark:text-gray-400">
            {t(
              f.delivered ? "uFinComOk" : f.dead ? "uFinComNo" : "uFinComWait",
            )}
          </span>
        </Pair>
      </DetailSection>
      <Card>
        <Accordion>
          <AccordionItem value="aChatL">
            <AccordionTrigger>{t("aChatL")}</AccordionTrigger>
            <AccordionContent>
              {chat.length ? (
                chat.map((m) => {
                  const loc = parseLocation(text(m, "body"));
                  return (
                    <article
                      key={text(m, "id")}
                      className="border-b border-gray-200 py-3 break-words dark:border-gray-700"
                    >
                      <small>
                        {m.sender_id === o.customer_id
                          ? t("aClient")
                          : t("aDrvL")}{" "}
                        · {formatDate(text(m, "created_at"), locale)}
                      </small>
                      <p>
                        {loc ? (
                          <Button
                            variant="outline"
                            size="icon-lg"
                            nativeButton={false}
                            aria-label={t("aOnMap")}
                            title={t("aOnMap")}
                            render={
                              <a
                                href={`https://www.google.com/maps?q=${loc.lat},${loc.lng}`}
                                target="_blank"
                                rel="noreferrer"
                              />
                            }
                          >
                            <MapIcon aria-hidden="true" />
                          </Button>
                        ) : (
                          text(m, "body")
                        )}
                      </p>
                    </article>
                  );
                })
              ) : (
                <p>{t("aNoChat")}</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}

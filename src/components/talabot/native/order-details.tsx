import { CallIcon, MapIcon } from "@/icons";
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
import { Card, Pair } from "./primitives";
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
type Props = { order: Row; t: (key: string) => string; back: () => void };
const money = (n: number) => n.toFixed(2) + " TJS";
export default function OrderDetails({ order: o, t, back }: Props) {
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
    <Card title={label}>
      <p className="font-medium break-words">
        {name || text(row || {}, "name") || "—"}
      </p>
      {row?.phone ? (
        <>
          <span>{text(row, "phone")}</span>
          <Button
            variant="outline"
            size="icon-lg"
            nativeButton={false}
            aria-label={t("aCall") + ": " + text(row, "phone")}
            title={t("aCall") + ": " + text(row, "phone")}
            render={<a href={"tel:" + text(row, "phone")} />}
          >
            <CallIcon aria-hidden="true" />
          </Button>
        </>
      ) : (
        <p>{t("aDrvNoPh")}</p>
      )}
    </Card>
  );
  return (
    <div className="space-y-4">
      {assigning && (
        <AssignmentDialog order={o} t={t} close={() => setAssigning(false)} />
      )}
      <Button variant="outline" onClick={back}>
        ← {t("aBack")}
      </Button>
      <Card title={"#" + text(o, "id")}>
        <Pair label={t("status")}>
          <OrderStatusBadge value={text(o, "status") as OrderStatus} />
        </Pair>
        <p>
          {new Date(text(o, "created_at")).toLocaleString("en-GB", {
            timeZone: "Asia/Dushanbe",
          })}
        </p>
        {!!o.arrived_store_at && (
          <Pair label={t("zAtS")}>{text(o, "arrived_store_at")}</Pair>
        )}
        {!!o.arrived_cust_at && (
          <Pair label={t("zAtC")}>{text(o, "arrived_cust_at")}</Pair>
        )}
        {!!o.cancel_reason && (
          <p>
            {t("zRj")}: {t("cr_" + text(o, "cancel_reason"))}{" "}
            {text(o, "cancel_note")}
          </p>
        )}
        {!!o.scheduled_for && (
          <Pair label={t("ySched")}>{text(o, "scheduled_for")}</Pair>
        )}
        {!!o.group_id && <Pair label={t("yGrp")}>{text(o, "group_id")}</Pair>}
        {canAssign(o) ? (
          <Button variant="outline" onClick={() => setAssigning(true)}>
            {t("aAssign")}
          </Button>
        ) : (
          <p className="mt-3 text-sm text-gray-500">
            {t(o.driver_id ? "nativeAssignAlready" : "nativeAssignStatus")}
          </p>
        )}
        <p className="text-sm">{t("nativeWriteBlocked")}</p>
        {!!o.delivery_photo && (
          <p>
            {t("zPhO")}: {t("nativeProofMissing")}
          </p>
        )}
      </Card>
      <div className="grid gap-4 lg:grid-cols-3">
        {party(t("aStoreL"), store)}
        {party(t("aDrvL"), driver)}
        {party(t("aClient"), client, text(o, "customer_name"))}
      </div>
      <Card title={t("address")}>
        <p className="break-words">{text(o, "address")}</p>
        {o.lat != null && o.lng != null && (
          <Button
            variant="outline"
            size="icon-lg"
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
        {!!o.substitution && <p>{t("ySub_" + text(o, "substitution"))}</p>}
      </Card>
      <Card title={t("aItemsL")}>
        {items.map((i) => (
          <div
            key={text(i, "id")}
            className="border-b border-gray-200 py-3 dark:border-gray-700"
          >
            <Pair label={number(i, "qty") + " × " + text(i, "name")}>
              {money(number(i, "qty") * number(i, "price"))}
            </Pair>
            <p>
              {((i.options as Row[]) || []).map((x) => text(x, "n")).join(", ")}
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
            <Pair label={t("uDelRest")}>{money(number(o, "fee_waived"))}</Pair>
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
        <Pair label={t("aTot")}>{money(number(o, "total"))}</Pair>
        {number(o, "points_used") > 0 && (
          <Pair label={t("yPtsUsed")}>{number(o, "points_used")}</Pair>
        )}
        {(number(o, "points_earned") > 0 || number(o, "cashback") > 0) && (
          <Pair label={t("yGiven")}>
            {number(o, "points_earned")} · {money(number(o, "cashback"))}
          </Pair>
        )}
      </Card>
      <Card title={t("uFinT")}>
        <Pair label={t("uFinM")}>{t(text(o, "payment"))}</Pair>
        <Pair label={t("uFinGot")}>
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
            {money(number(o, "tip"))} —{" "}
            {t(
              f.delivered ? "uFinTipOk" : f.dead ? "uFinTipNo" : "uFinTipWait",
            )}
          </Pair>
        )}
        <Pair label={t("uFinCom") + " (" + number(o, "commission_pct") + "%)"}>
          {money(f.commission)} —{" "}
          {t(f.delivered ? "uFinComOk" : f.dead ? "uFinComNo" : "uFinComWait")}
        </Pair>
      </Card>
      <Card>
        <Accordion>
          <AccordionItem value="aTimeL">
            <AccordionTrigger>{t("aTimeL")}</AccordionTrigger>
            <AccordionContent>
              {events.length ? (
                <ol className="space-y-6 border-l border-brand-500 pl-4">
                  {events.map((e, i) => (
                    <li key={text(e, "id")}>
                      <Pair
                        label={
                          eventLabels[text(e, "kind")]
                            ? t(eventLabels[text(e, "kind")])
                            : t("aeUnk") + ": " + text(e, "kind")
                        }
                      >
                        {text(e, "at")}
                        {i > 0
                          ? " (+" +
                            duration(text(e, "at"), text(events[i - 1], "at")) +
                            ")"
                          : ""}
                      </Pair>
                    </li>
                  ))}
                </ol>
              ) : (
                <p>{text(o, "created_at")}</p>
              )}
              {events.length > 1 && (
                <Pair label={t("aTotalT")}>
                  {duration(
                    text(events[events.length - 1], "at"),
                    text(events[0], "at"),
                  )}
                </Pair>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
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
                        · {text(m, "created_at")}
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

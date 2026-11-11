"use client";
import { Badge } from "@/components/ui/badge";
import { entityStatus } from "./entity-data";
import { useLocale } from "next-intl";
import { formatDate } from "./format";
import { CallIcon } from "@/icons";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import { syntheticRefundRooms } from "./scenario-responses";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { tables, text, number, type Row } from "./domain";
import { Card, Pair } from "./primitives";
import NativeForm from "./native-form";
import { mutations } from "./mutation-service";
interface Props {
  ticket: Row;
  t: (key: string) => string;
  back: () => void;
  openOrder: (id: string) => void;
}
export default function TicketDetails({
  ticket: k,
  t,
  back,
  openOrder,
}: Props) {
  const locale = useLocale();
  const room = syntheticRefundRooms[text(k, "id")];
  const key = "ux02-native:ticket:" + k.id,
    person = tables.profiles.find((p) => p.id === k.customer_id) || {},
    closed = ["resolved", "rejected"].includes(text(k, "status"));
  const [draft, setDraft] = useState<{ note: string; refund: string }>(() => {
      try {
        return (
          JSON.parse(sessionStorage.getItem(key) || "null") || {
            note: "",
            refund: "",
          }
        );
      } catch {
        return { note: "", refund: "" };
      }
    }),
    [error, setError] = useState(""),
    [pending, setPending] = useState(false),
    [confirm, setConfirm] = useState(false);
  const update = (patch: Partial<typeof draft>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    sessionStorage.setItem(key, JSON.stringify(next));
  };
  async function decide(status: string, confirmed = false) {
    if (pending) return;
    setError("");
    if (status === "rejected" && draft.note.trim().length < 3) {
      setError(t("xRejNote"));
      return;
    }
    const refund = status === "resolved" ? Number(draft.refund) || 0 : 0;
    if (refund > 0 && !k.order_id) {
      setError(t("xRefNoOrder"));
      return;
    }
    if (refund > 0 && room && refund > room.room + 0.009) {
      setError(t("xRefHigh").replace("{r}", String(room.room)));
      return;
    }
    if (refund > 0 && !confirmed) {
      setConfirm(true);
      return;
    }
    setPending(true);
    try {
      const r = await mutations.ticketSetStatus(
        k.id,
        status,
        draft.note,
        status === "resolved" ? draft.refund : null,
      );
      if (r.error) {
        const msg = typeof r.error === "string" ? r.error : r.error.message;
        setError(
          msg === "preview_readonly"
            ? t("nativeWriteBlocked")
            : t("err_" + msg),
        );
      } else if ("ok" in r && r.ok === true) {
        update({ note: "", refund: "" });
        if (status === "resolved" || status === "rejected") back();
      }
    } catch {
      setError(t("err_generic"));
    } finally {
      setPending(false);
      setConfirm(false);
    }
  }
  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={back} size="lg">
        {t("aBack")}
      </Button>
      <Card title={t("rs_" + text(k, "reason"))}>
        <Pair label={t("status")}>
          <Badge color={entityStatus("support", k).color}>
            {t(entityStatus("support", k).label)}
          </Badge>
        </Pair>
        <p>{text(person, "name") || "—"}</p>
        {!!person.phone && (
          <>
            <span>{text(person, "phone")}</span>
            <Button
              variant="outline"
              size="icon-lg"
              nativeButton={false}
              aria-label={t("aCall") + ": " + text(person, "phone")}
              title={t("aCall") + ": " + text(person, "phone")}
              render={<a href={"tel:" + text(person, "phone")} />}
            >
              <CallIcon aria-hidden="true" />
            </Button>
          </>
        )}
        {!!k.order_id && (
          <Button
            size="lg"
            variant="outline"
            onClick={() => openOrder(text(k, "order_id"))}
          >
            #{text(k, "order_id")}
          </Button>
        )}
        {number(k, "refund_amount") > 0 && (
          <Pair label={t("xRefundL")}>{number(k, "refund_amount")} TJS</Pair>
        )}
        {!!k.admin_note && <p>{text(k, "admin_note")}</p>}
      </Card>
      <Card title={t("aChatL")}>
        {tables.ticket_messages
          .filter((m) => m.ticket_id === k.id)
          .map((m) => (
            <article className="my-3 break-words" key={text(m, "id")}>
              <small>
                {m.from_staff ? t("aStfT") : text(person, "name")} ·{" "}
                {formatDate(text(m, "created_at"), locale)}
              </small>
              <p>{text(m, "body")}</p>
            </article>
          ))}
      </Card>
      {closed ? (
        <Card title={t("xClosedT")}>
          <Button
            size="lg"
            variant="outline"
            disabled={pending}
            onClick={() => decide("open")}
          >
            {t("xReopen")}
          </Button>
        </Card>
      ) : (
        <>
          <NativeForm
            title={t("xSend")}
            resetAfterSuccess
            fields={[
              {
                key: "body",
                label: "xReplyPh",
                type: "textarea",
                maxLength: 500,
              },
            ]}
            t={t}
            operation={(r) => mutations.ticketStaffReply(k.id, r.body)}
          />
          <Card title={t("xDecision")}>
            <label>
              {t("xNotePh")}
              <Textarea
                maxLength={300}
                value={draft.note}
                onChange={(e) => update({ note: e.target.value })}
              />
            </label>
            {k.order_id ? (
              <>
                <label>
                  {t("xRefundPh")}
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    value={draft.refund}
                    onChange={(e) => update({ refund: e.target.value })}
                  />
                </label>
                <p>
                  {room
                    ? t("xRefMax")
                        .replace("{r}", String(room.room))
                        .replace("{t}", String(room.total))
                        .replace("{d}", String(room.refunded))
                    : t("nativeRefundMissing")}
                </p>
                <p>{t("xRefundS")}</p>
              </>
            ) : (
              <p>{t("xRefNoOrder")}</p>
            )}
            <div className="my-3 flex flex-wrap gap-2">
              {k.status === "open" && (
                <Button
                  size="lg"
                  variant="outline"
                  disabled={pending}
                  onClick={() => decide("in_progress")}
                >
                  {t("xInProg")}
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                disabled={pending}
                onClick={() => decide("resolved")}
              >
                {t("xResolve")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                disabled={pending}
                onClick={() => decide("rejected")}
              >
                {t("xReject")}
              </Button>
            </div>
            <p>{t("xDecHelp")}</p>
          </Card>
        </>
      )}
      {error && <p role="alert">{error}</p>}
      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent showCloseButton={false}>
          <DialogTitle>{t("xDecision")}</DialogTitle>
          <DialogDescription>
            {t("xRefundConfirm")
              .replace("{n}", draft.refund)
              .replace("{name}", text(person, "name"))}
          </DialogDescription>
          <Button
            size="lg"
            variant="outline"
            disabled={pending}
            onClick={() => decide("resolved", true)}
          >
            {t("xResolve")}
          </Button>
          <Button
            size="lg"
            variant="outline"
            disabled={pending}
            onClick={() => setConfirm(false)}
          >
            {t("aClose2")}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

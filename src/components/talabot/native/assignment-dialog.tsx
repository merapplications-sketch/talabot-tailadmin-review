"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { text, type Row } from "./domain";
import { assignmentCandidates } from "./order-operations";
import { mutations } from "./mutation-service";
interface Props {
  order: Row;
  t: (key: string) => string;
  close: () => void;
  drivers?: Row[];
}
export default function AssignmentDialog({ order, t, close, drivers }: Props) {
  const [pending, setPending] = useState(false),
    [error, setError] = useState("");
  const candidates = assignmentCandidates(order, drivers);
  async function assign(driver: Row) {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const result = await mutations.assignDriver(order.id, driver.id);
      if (result.error) setError(t("nativeWriteBlocked"));
      else close();
    } catch {
      setError(t("err_generic"));
    } finally {
      setPending(false);
    }
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !pending) close();
      }}
    >
      <DialogContent showCloseButton={false}>
        <DialogTitle>
          {t("aPickC")} · #{text(order, "id")}
        </DialogTitle>
        <DialogDescription>{t("nativeWriteBlocked")}</DialogDescription>
        {candidates.length ? (
          candidates.map(({ driver, distance }) => (
            <div
              key={text(driver, "id")}
              className="flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <strong>
                  {text(driver, "name") || text(driver, "id").slice(0, 8)}
                </strong>
                <p>
                  {distance == null
                    ? t("aNoLoc")
                    : distance.toFixed(1) + " " + t("aKmAway")}
                </p>
              </div>
              <Button
                size="lg"
                variant="outline"
                disabled={pending}
                onClick={() => assign(driver)}
              >
                {t("aAssign")}
              </Button>
            </div>
          ))
        ) : (
          <p>{t("aNoOnlineC")}</p>
        )}
        {error && <p role="alert">{error}</p>}
        <Button variant="outline" disabled={pending} onClick={close} size="lg">
          {t("aClose2")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

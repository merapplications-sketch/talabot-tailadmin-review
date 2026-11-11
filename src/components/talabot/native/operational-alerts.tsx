"use client";
import { Button } from "@/components/ui/button";
import { syntheticCash } from "./scenario-responses";
import MutationAction from "./mutation-action";
import { mutations } from "./mutation-service";
import { useState } from "react";
import { tables, text, type Row } from "./domain";
import { operationalAlerts, isLive } from "./order-operations";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card } from "./primitives";
import AssignmentDialog from "./assignment-dialog";
interface Props {
  compact?: boolean;
  t: (key: string) => string;
  navigate: (patch: { section?: string; id?: string; query?: string }) => void;
}
export default function OperationalAlerts({
  t,
  navigate,
  compact = false,
}: Props) {
  const [assignment, setAssignment] = useState<Row | null>(null),
    alerts = operationalAlerts(),
    approved = tables.profiles.filter((d) => d.driver_status === "approved"),
    activeStores = tables.stores.filter((s) => s.is_active);
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          size="lg"
          variant="outline"
          onClick={() => navigate({ section: "drivers", id: "" })}
        >
          {approved.filter((d) => isLive(d)).length}/{approved.length}{" "}
          {t("aCourL")} {t("aOnLine")}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => navigate({ section: "restaurants", id: "" })}
        >
          {activeStores.filter((s) => s.is_open).length}/{activeStores.length}{" "}
          {t("aStoreL2")} {t("aOpenL")}
        </Button>
        {alerts.tickets.length > 0 && (
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate({ section: "support", id: "" })}
          >
            {t("aTkWait").replace("{n}", String(alerts.tickets.length))}
          </Button>
        )}
      </div>
      {alerts.unassigned.length > 0 && (
        <Card title={t("aNoCourier")}>
          {(compact ? alerts.unassigned.slice(0, 5) : alerts.unassigned).map(
            (o) => (
              <div
                key={text(o, "id")}
                className="flex flex-wrap justify-between gap-2"
              >
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() =>
                    navigate({ section: "orders", id: text(o, "id") })
                  }
                >
                  #{text(o, "id")}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setAssignment(o)}
                >
                  {t("aAssign")}
                </Button>
              </div>
            ),
          )}
        </Card>
      )}
      {alerts.ratings.length > 0 && (
        <Card title={t("aLowRate")}>
          <p>{t("aLowHelp")}</p>
          {alerts.ratings.slice(0, 5).map((r) => (
            <div
              key={text(r, "id")}
              className="flex flex-wrap justify-between gap-2 py-2"
            >
              <span>
                #{text(r, "order_id")} · {text(r, "store_stars")} /{" "}
                {text(r, "driver_stars")} ★
              </span>
              <Button
                size="lg"
                variant="outline"
                onClick={() =>
                  navigate({ section: "ratings", id: text(r, "id") })
                }
              >
                {t("aResolve")}
              </Button>
            </div>
          ))}
          {alerts.ratings.length > 5 && (
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate({ section: "ratings", id: "" })}
            >
              +{alerts.ratings.length - 5}
            </Button>
          )}
        </Card>
      )}
      {tables.profiles
        .filter(
          (d) =>
            syntheticCash[text(d, "id")] != null &&
            syntheticCash[text(d, "id")] >= Number(d.cash_limit || 1000),
        )
        .map((d) => (
          <Alert key={text(d, "id")} variant="warning">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <AlertTitle>{t("aOver")}</AlertTitle>
                <AlertDescription>
                  {text(d, "name")} · {syntheticCash[text(d, "id")].toFixed(2)}{" "}
                  / {Number(d.cash_limit || 1000)} TJS
                </AlertDescription>
              </div>
              {d.accept_blocked ? (
                <p>{t("aBlocked")}</p>
              ) : (
                <MutationAction
                  label={t("aBlock")}
                  t={t}
                  operation={() => mutations.setDriverBlocked(d.id, true)}
                />
              )}
            </div>
          </Alert>
        ))}
      {assignment && (
        <AssignmentDialog
          order={assignment}
          t={t}
          close={() => setAssignment(null)}
        />
      )}
    </>
  );
}

import { useState } from "react";
import type { CopyKey } from "./copy";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
interface Props {
  t: (key: CopyKey) => string;
}
export default function SecurityPanel({ t }: Props) {
  const [acknowledged, setAcknowledged] = useState(false);
  const actions: CopyKey[] = [
    "restaurants",
    "campaigns",
    "adjustment",
    "returns",
    "finance",
    "users",
  ];
  return (
    <section className="op-card">
      <h3>{t("permissions")}</h3>
      <p>{t("accessNote")}</p>
      <div className="op-permissions op-desktop">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>{t("permissions")}</TableCell>
              <TableCell isHeader>DEMO-ADMIN</TableCell>
              <TableCell isHeader>DEMO-FINANCE</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actions.map((action) => (
              <TableRow key={action}>
                <TableCell>{t(action)}</TableCell>
                <TableCell>{t("pending")}</TableCell>
                <TableCell>{t("pending")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="op-mobile">
        {actions.map((action) => (
          <article className="op-card" key={action}>
            <h3>{t(action)}</h3>
            <p>DEMO-ADMIN · {t("pending")}</p>
            <p>DEMO-FINANCE · {t("pending")}</p>
          </article>
        ))}
      </div>
      <section className="op-notice">
        <h3>{t("alerts")}</h3>
        <p>DEMO-ALERT01 · {t("offline")}</p>
        <button disabled={acknowledged} onClick={() => setAcknowledged(true)}>
          {t(acknowledged ? "acknowledged" : "acknowledge")}
        </button>
      </section>
      <h3>{t("audit")}</h3>
      <dl className="op-fields">
        <div>
          <dt>{t("reference")}</dt>
          <dd>DEMO-AUDIT01 · DEMO-ADMIN</dd>
        </div>
        <div>
          <dt>{t("timestamp")}</dt>
          <dd>2026-11-09 12:00 · Asia/Dushanbe</dd>
        </div>
        <div>
          <dt>{t("status")}</dt>
          <dd>
            {t("draft")} → {t("pending")}
          </dd>
        </div>
        <div>
          <dt>{t("reason")}</dt>
          <dd>{t("demo")}</dd>
        </div>
      </dl>
    </section>
  );
}

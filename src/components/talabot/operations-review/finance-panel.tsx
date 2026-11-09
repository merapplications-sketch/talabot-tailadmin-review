import { useState } from "react";
import type { ReviewRecord } from "./data";
import { tr, type CopyKey } from "./copy";
import { financeCopy } from "./finance-copy";
interface Props {
  row: ReviewRecord;
  locale: string;
  t: (key: CopyKey) => string;
}
export default function FinancePanel({ row, locale, t }: Props) {
  const c = (key: keyof typeof financeCopy) => tr(financeCopy[key], locale);
  const [amount, setAmount] = useState(""),
    [reference, setReference] = useState(""),
    [reason, setReason] = useState(""),
    [draft, setDraft] = useState<{
      amount: string;
      reference: string;
      reason: string;
    } | null>(null);
  const expense = row.id === "DEMO-F08";
  const receipt = row.id === "DEMO-F06";
  return (
    <div>
      <div className="op-notice">
        <strong>{c("unverified")}</strong>
        <p>{t("definition")}</p>
        <p>{t("profit")}</p>
      </div>
      <section className="op-card" aria-label={c("document")}>
        <div className="op-row">
          <h3>{receipt ? c("receipt") : c("document")}</h3>
          <strong>{c("watermark")}</strong>
        </div>
        <dl className="op-fields">
          <div>
            <dt>{t("reference")}</dt>
            <dd>
              {row.id} / {row.reference}
            </dd>
          </div>
          <div>
            <dt>{t("actual")}</dt>
            <dd>
              {tr(
                row.fields.find(([key]) => key === "actual")?.[1] || [
                  "—",
                  "—",
                  "—",
                ],
                locale,
              )}
            </dd>
          </div>
          <div>
            <dt>{c("source")}</dt>
            <dd>{c("fixture")}</dd>
          </div>
          <div>
            <dt>{c("payer")}</dt>
            <dd>{c("unknown")}</dd>
          </div>
          <div>
            <dt>{c("recipient")}</dt>
            <dd>{c("unknown")}</dd>
          </div>
          <div>
            <dt>{c("evidence")}</dt>
            <dd>{c("missing")}</dd>
          </div>
        </dl>
        <p>{c("independent")}</p>
      </section>
      {expense && (
        <form
          className="op-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (
              !/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(amount) ||
              Number(amount) <= 0 ||
              !reason.trim()
            )
              return;
            setDraft({ amount, reference, reason });
          }}
        >
          <h3>{c("expenseDraft")}</h3>
          <label>
            {t("actual")} · TJS
            <input
              required
              inputMode="decimal"
              pattern="(?:0|[1-9][0-9]*)(?:\.[0-9]{1,2})?"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </label>
          <label>
            {t("reference")}
            <input
              required
              value={reference}
              onChange={(event) => setReference(event.target.value)}
            />
          </label>
          <label>
            {t("reason")}
            <textarea
              required
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </label>
          <button>{c("preview")}</button>
          <p>{c("notPosted")}</p>
          {draft && (
            <div className="op-notice" role="status">
              <h3>{c("expenseDraft")}</h3>
              <p>
                {draft.amount} TJS · {draft.reference}
              </p>
              <p>{draft.reason}</p>
              <p>{c("notPosted")}</p>
            </div>
          )}
        </form>
      )}
      <h3>{t("audit")}</h3>
      <p>{c("audit")}</p>
    </div>
  );
}

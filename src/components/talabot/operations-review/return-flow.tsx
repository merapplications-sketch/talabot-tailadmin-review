import { useState } from "react";
import type { CopyKey } from "./copy";
interface Props {
  t: (key: CopyKey) => string;
}
export default function ReturnFlow({ t }: Props) {
  const [consent, setConsent] = useState(false),
    [returned, setReturned] = useState(false),
    [amount, setAmount] = useState(""),
    [refund, setRefund] = useState<number | null>(null),
    [receipt, setReceipt] = useState(""),
    [confirmed, setConfirmed] = useState<number | null>(null),
    [error, setError] = useState(false),
    [reason, setReason] = useState(""),
    [audit, setAudit] = useState<string[]>([]);
  const log = (action: CopyKey, detail: string) =>
    setAudit((a) => [
      `${new Date().toISOString()} · ${t(action)} · ${detail}`,
      ...a,
    ]);
  const cents = (value: string) =>
    /^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(value) && Number(value) <= 80
      ? Math.round(Number(value) * 100)
      : null;
  return (
    <section className="op-card">
      <h3>{t("returns")}</h3>
      <p>{t("returnRule")}</p>
      <label className="op-check">
        <input
          type="checkbox"
          checked={consent}
          disabled={returned}
          onChange={(e) => setConsent(e.target.checked)}
        />
        {t("consent")}
      </label>
      <label>
        {t("reason")}
        <textarea
          required
          value={reason}
          disabled={returned}
          onChange={(e) => setReason(e.target.value)}
        />
      </label>
      <ol className="op-timeline">
        <li>{t("requested")}</li>
        <li>
          <button
            disabled={!consent || !reason.trim() || returned}
            onClick={() => {
              setReturned(true);
              log("returnMeal", reason);
            }}
          >
            {t("returnMeal")}
          </button>
          {returned && " ✓"}
        </li>
        <li>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const n = cents(amount);
              if (n === null) {
                setError(true);
                return;
              }
              log(
                "refunded",
                `DEMO-M01 · ${refund === null ? "—" : refund / 100} → ${n / 100} TJS`,
              );
              setRefund(n);
              setConfirmed(null);
              setError(false);
            }}
          >
            <label>
              {t("refunded")}
              <input
                aria-label={t("actual")}
                inputMode="decimal"
                required
                value={amount}
                disabled={!returned}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
            <button disabled={!returned}>{t("save")}</button>
          </form>
        </li>
        <li>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const n = cents(receipt);
              if (n === null) {
                setError(true);
                return;
              }
              log(
                "confirmed",
                `DEMO-DRIVER01 · ${confirmed === null ? "—" : confirmed / 100} → ${n / 100} TJS`,
              );
              setConfirmed(n);
              setError(false);
            }}
          >
            <label>
              {t("confirmed")}
              <input
                aria-label={t("confirmed")}
                inputMode="decimal"
                required
                disabled={refund === null}
                value={receipt}
                onChange={(e) => setReceipt(e.target.value)}
              />
            </label>
            <button disabled={refund === null}>{t("save")}</button>
          </form>
        </li>
      </ol>
      {error && <p role="alert">{t("invalidAmount")}</p>}
      <dl className="op-fields">
        <div>
          <dt>{t("paid")}</dt>
          <dd>80.00 TJS</dd>
        </div>
        <div>
          <dt>{t("refunded")}</dt>
          <dd>{refund === null ? "—" : (refund / 100).toFixed(2) + " TJS"}</dd>
        </div>
        <div>
          <dt>{t("confirmed")}</dt>
          <dd>
            {confirmed === null
              ? t("awaiting")
              : (confirmed / 100).toFixed(2) + " TJS"}
          </dd>
        </div>
        <div>
          <dt>{t("claim")}</dt>
          <dd>
            {confirmed === null
              ? t("awaiting")
              : ((8000 - confirmed) / 100).toFixed(2) + " TJS"}
          </dd>
        </div>
        <div>
          <dt>{t("status")}</dt>
          <dd>
            {confirmed === null
              ? t("awaiting")
              : confirmed !== refund
                ? t("mismatch")
                : confirmed < 8000
                  ? t("partial")
                  : t("fullRecovery")}
          </dd>
        </div>
        <div>
          <dt>{t("delivery")}</dt>
          <dd>{t("feePending")}</dd>
        </div>
      </dl>
      <h3>{t("audit")}</h3>
      {audit.length ? (
        <ul>
          {audit.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      ) : (
        <p>{t("noHistory")}</p>
      )}
    </section>
  );
}

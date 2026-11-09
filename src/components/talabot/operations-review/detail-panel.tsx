import { useState } from "react";
import Image from "next/image";
import { tr, type CopyKey } from "./copy";
import type { ReviewRecord, Section } from "./data";
import ReturnFlow from "./return-flow";
import FinancePanel from "./finance-panel";
interface Props {
  row: ReviewRecord;
  section: Section;
  locale: string;
  t: (key: CopyKey) => string;
  onClose: () => void;
}
export default function DetailPanel({
  row,
  section,
  locale,
  t,
  onClose,
}: Props) {
  const field = (key: CopyKey, fallback = "") => {
    const f = row.fields.find(([k]) => k === key);
    return f ? tr(f[1], locale) : fallback;
  };
  const [saved, setSaved] = useState(false),
    [history, setHistory] = useState<string[]>([]),
    [permission, setPermission] = useState(false),
    [balance, setBalance] = useState(row.id === "DEMO-U01" ? 250 : 0),
    [delta, setDelta] = useState(""),
    [error, setError] = useState("");
  const [title, setTitle] = useState(tr(row.name, locale)),
    [status, setStatus] = useState(row.status),
    [reason, setReason] = useState(""),
    [price, setPrice] = useState(row.id === "DEMO-M01" ? "35.00" : "12.00"),
    [hours, setHours] = useState(field("hours").split(" · ")[0]),
    [start, setStart] = useState("2026-11-10T12:00"),
    [end, setEnd] = useState("2026-11-10T14:00"),
    [branch, setBranch] = useState(field("branch", row.reference)),
    [menu, setMenu] = useState(field("menu").split(" / ")[1] || "DEMO-I01"),
    [extras, setExtras] = useState(field("extras")),
    [category, setCategory] = useState(field("menu").split(" / ")[0]),
    [target, setTarget] = useState("DEMO-M01 / DEMO-I01"),
    [placement, setPlacement] = useState("pending"),
    [showImage, setShowImage] = useState(row.id === "DEMO-M01");
  const snapshot =
    section === "loyalty"
      ? `${t("balance")}: ${balance}`
      : `${t("name")}: ${title} · ${t("status")}: ${t(status)} · ${section === "restaurants" ? `${branch} / ${category} / ${menu} / ${extras} / ${hours} / ${price} TJS / ${t(showImage ? "demo" : "missing")}` : section === "campaigns" ? `${target} / ${start} / ${end} / ${placement === "pending" ? t("pending") : `${t("placementDemo")}: ${t(placement === "home" ? "home" : "restaurants")}`}` : row.reference}`;
  const [previous, setPrevious] = useState(snapshot);
  function save() {
    setSaved(true);
    setHistory((h) => [
      `${new Intl.DateTimeFormat(locale, { timeStyle: "medium", timeZone: "Asia/Dushanbe" }).format(new Date())} · DEMO-ADMIN · ${previous} → ${section === "loyalty" ? `${t("balance")}: ${balance + Number(delta)}` : snapshot} · ${reason}`,
      ...h,
    ]);
    setPrevious(
      section === "loyalty"
        ? `${t("balance")}: ${balance + Number(delta)}`
        : snapshot,
    );
    setReason("");
  }
  return (
    <section className="op-detail op-card" aria-label={t("details")}>
      <header className="op-row">
        <div>
          <p>{row.id}</p>
          <h2 tabIndex={-1}>{tr(row.name, locale)}</h2>
        </div>
        <button onClick={onClose}>{t("close")}</button>
      </header>
      <dl className="op-fields">
        {row.fields.map(([key, value], i) => (
          <div key={`${key}-${i}`}>
            <dt>{t(key)}</dt>
            <dd>{tr(value, locale)}</dd>
          </div>
        ))}
      </dl>
      {section === "restaurants" && (
        <div className="op-image">
          {showImage ? (
            <Image
              unoptimized
              src="/images/cards/card-01.png"
              alt={t("demo")}
              width={400}
              height={240}
            />
          ) : (
            <span>{t("missing")}</span>
          )}
        </div>
      )}
      {section === "returns" ? (
        <ReturnFlow t={t} />
      ) : section === "finance" ? (
        <FinancePanel row={row} locale={locale} t={t} />
      ) : (
        <form
          className="op-form"
          onSubmit={(e) => {
            e.preventDefault();
            setError("");
            if (!reason.trim()) {
              setError(t("reason"));
              return;
            }
            if (section === "campaigns" && end <= start) {
              setError(t("scheduleError"));
              return;
            }
            if (section === "loyalty") {
              const n = Number(delta);
              if (
                !permission ||
                !Number.isSafeInteger(n) ||
                !n ||
                !Number.isSafeInteger(balance + n)
              )
                return;
              setBalance(balance + n);
            }
            save();
          }}
        >
          <h3>{t(section === "loyalty" ? "adjustment" : "edit")}</h3>
          {section === "loyalty" ? (
            <>
              <p>
                <strong>
                  {t("balance")}: {balance}
                </strong>
              </p>
              <label className="op-check">
                <input
                  type="checkbox"
                  checked={permission}
                  onChange={(e) => setPermission(e.target.checked)}
                />
                {t("permission")}
              </label>
              <p>{t(permission ? "allowed" : "denied")}</p>
              <label>
                {t("delta")}
                <input
                  type="number"
                  step="1"
                  required
                  value={delta}
                  onChange={(e) => setDelta(e.target.value)}
                  disabled={!permission}
                />
              </label>
            </>
          ) : (
            <>
              <label>
                {t("name")}
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <label>
                {t("status")}
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as ReviewRecord["status"])
                  }
                >
                  {(section === "restaurants" || section === "security"
                    ? ["active", "paused", "draft", "pending"]
                    : ["draft", "pending"]
                  ).map((s) => (
                    <option key={s} value={s}>
                      {t(s as CopyKey)}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}
          {section === "restaurants" && (
            <>
              <label>
                {t("image")}
                <select
                  value={showImage ? "sample" : "none"}
                  onChange={(e) => setShowImage(e.target.value === "sample")}
                >
                  <option value="sample">{t("demo")}</option>
                  <option value="none">{t("missing")}</option>
                </select>
              </label>
              <label>
                {t("hours")}
                <input
                  required
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                />
              </label>
              <label>
                {t("price")}
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </label>
              <label>
                {t("branch")}
                <input
                  required
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                />
              </label>
              <label>
                {t("category")}
                <input
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </label>
              <label>
                {t("item")}
                <input
                  required
                  value={menu}
                  onChange={(e) => setMenu(e.target.value)}
                />
              </label>
              <label>
                {t("extras")}
                <input
                  value={extras}
                  onChange={(e) => setExtras(e.target.value)}
                />
              </label>
            </>
          )}
          {section === "campaigns" && (
            <>
              <label>
                {t("placement")}
                <select
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value)}
                >
                  <option value="pending">{t("pending")}</option>
                  <option value="home">
                    {t("placementDemo")} · {t("home")}
                  </option>
                  <option value="restaurant">
                    {t("placementDemo")} · {t("restaurants")}
                  </option>
                </select>
              </label>
              <label>
                {t("targets")}
                <select
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                >
                  <option>DEMO-M01 / DEMO-I01</option>
                  <option>DEMO-M02 / DEMO-I02</option>
                </select>
              </label>
              <label>
                {t("start")}
                <input
                  required
                  type="datetime-local"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
              </label>
              <label>
                {t("end")}
                <input
                  required
                  type="datetime-local"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                />
              </label>
              <div className="op-campaign">
                <small>{t("preview")}</small>
                <p>
                  {placement === "pending" ? t("pending") : t("placementDemo")}
                </p>
                <h3>{title}</h3>
                <p>{target}</p>
                <p>
                  {start.replace("T", " ")} — {end.replace("T", " ")}
                </p>
                <span>{t("draft")}</span>
              </div>
            </>
          )}
          <label>
            {t("reason")}
            <textarea
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
            />
          </label>
          {error && <p role="alert">{error}</p>}
          <button disabled={section === "loyalty" && !permission}>
            {t("save")}
          </button>
        </form>
      )}
      {saved && (
        <p role="status" className="op-notice">
          {t("saved")}
        </p>
      )}
      <section>
        <h3>{t("history")}</h3>
        {history.length ? (
          <ul>
            {history.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        ) : (
          <p>{t("noHistory")}</p>
        )}
      </section>
    </section>
  );
}

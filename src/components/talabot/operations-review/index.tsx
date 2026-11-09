"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import { useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useTheme } from "@/context/theme-context";
import TalabotLogo from "@/components/talabot/logo";
import { copy, tr, type CopyKey } from "./copy";
import { records, sections, type Section } from "./data";
import RecordList from "./record-list";
import DetailPanel from "./detail-panel";
import SecurityPanel from "./security-panel";
import "./review.css";
export default function OperationsReview() {
  const router = useRouter();
  const locale = useLocale(),
    { theme, toggleTheme } = useTheme();
  const t = (key: CopyKey) => tr(copy[key], locale);
  const [section, setSection] = useState<Section>("restaurants"),
    [query, setQuery] = useState(""),
    [status, setStatus] = useState("all"),
    [sort, setSort] = useState("asc"),
    [selected, setSelected] = useState(""),
    [state, setState] = useState("normal"),
    [ready, setReady] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  const lastSelection = useRef("");
  useEffect(() => {
    if (selected) {
      const heading = document.querySelector<HTMLElement>(".op-detail h2");
      heading?.focus({ preventScroll: true });
      heading?.scrollIntoView({ block: "start" });
    } else if (lastSelection.current) {
      opener.current?.focus();
    }
    lastSelection.current = selected;
  }, [selected]);
  function selectRecord(id: string) {
    opener.current = document.activeElement as HTMLElement;
    const p = new URLSearchParams(window.location.search);
    p.set("id", id);
    window.history.pushState({ opDetail: true }, "", `?${p}`);
    setSelected(id);
  }
  function closeRecord() {
    if (window.history.state?.opDetail) window.history.back();
    else setSelected("");
  }
  useEffect(() => {
    const restore = () => {
      const p = new URLSearchParams(window.location.search),
        s = p.get("section") as Section;
      setSection(sections.includes(s) ? s : "restaurants");
      setQuery(p.get("q") || "");
      setStatus(
        ["all", "active", "paused", "draft", "pending"].includes(
          p.get("status") || "",
        )
          ? p.get("status")!
          : "all",
      );
      setSelected(p.get("id") || "");
      setSort(p.get("sort") === "desc" ? "desc" : "asc");
      setReady(true);
    };
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams();
    p.set("section", section);
    if (query) p.set("q", query);
    if (status !== "all") p.set("status", status);
    if (selected) p.set("id", selected);
    if (sort === "desc") p.set("sort", sort);
    window.history.replaceState(window.history.state, "", `?${p}`);
  }, [ready, section, query, status, selected, sort]);
  const rows = useMemo(
    () =>
      records[section]
        .filter(
          (row) =>
            (status === "all" || row.status === status) &&
            `${row.id} ${tr(row.name, locale)} ${row.reference}`
              .toLocaleLowerCase(locale)
              .includes(query.toLocaleLowerCase(locale)),
        )
        .sort(
          (a, b) =>
            tr(a.name, locale).localeCompare(tr(b.name, locale), locale) *
            (sort === "asc" ? 1 : -1),
        ),
    [section, status, query, locale, sort],
  );
  const row = records[section].find((r) => r.id === selected);
  return (
    <div className="op">
      <header className="op-header">
        <TalabotLogo />
        <div className="op-row">
          <label>
            <span className="sr-only">{t("language")}</span>
            <select
              aria-label={t("language")}
              value={locale}
              onChange={(e) => {
                document.cookie = `NEXT_LOCALE=${e.target.value};path=/;max-age=31536000;SameSite=Lax`;
                router.replace(`/operations-review${window.location.search}`, {
                  locale: e.target.value as "en" | "ru" | "tg",
                });
              }}
            >
              <option value="en">English</option>
              <option value="ru">Русский</option>
              <option value="tg">Тоҷикӣ</option>
            </select>
          </label>
          <button onClick={toggleTheme}>
            {t(theme === "light" ? "dark" : "light")}
          </button>
        </div>
      </header>
      <main className="op-main" aria-busy={!ready}>
        <div className="op-heading">
          <p>TALABOT ADMIN</p>
          <h1>{t("title")}</h1>
          <p>{t("intro")}</p>
          <div className="op-links">
            <Link href="/">{t("original")}</Link>
            <Link href="/visual-review">{t("models")}</Link>
            {/* Static asset: bypass localized client routing. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/review-gallery/index.html">{t("gallery")}</a>
            {(
              [
                ["/", "home"],
                ["/orders", "orders"],
                ["/drivers", "drivers"],
                ["/customers", "customers"],
                ["/notifications", "notifications"],
                ["/reports", "reports"],
                ["/settings", "settings"],
              ] as const
            ).map(([href, label]) => (
              <Link key={label} href={href}>
                {t(label)}
              </Link>
            ))}
          </div>
        </div>
        <div className="op-notice">
          {t("contracts")}
          {locale === "tg" && <p>{t("humanTg")}</p>}
        </div>
        <nav className="op-tabs" aria-label={t("title")}>
          {sections.map((s) => (
            <button
              key={s}
              aria-current={s === section ? "page" : undefined}
              onClick={() => {
                setSection(s);
                setSelected("");
                setQuery("");
                setStatus("all");
                setState("normal");
              }}
            >
              {t(s)}
            </button>
          ))}
        </nav>
        <div className="op-layout">
          <section className="op-card">
            <header>
              <h2>{t(section)}</h2>
              <p>
                {section === "campaigns"
                  ? t("campaignRule")
                  : section === "loyalty"
                    ? t("pointsRule")
                    : section === "finance"
                      ? t("profit")
                      : section === "security"
                        ? t("accessNote")
                        : t("intro")}
              </p>
            </header>
            <div className="op-filters">
              <label>
                {t("search")}
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <label>
                {t("status")}
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {["all", "active", "paused", "draft", "pending"].map((s) => (
                    <option key={s} value={s}>
                      {t(s as CopyKey)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t("sort")}
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="asc">A → Z</option>
                  <option value="desc">Z → A</option>
                </select>
              </label>
            </div>
            {section === "security" && (
              <label>
                {t("state")}
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  {["normal", "offline", "error", "denied", "noData"].map(
                    (s) => (
                      <option key={s} value={s}>
                        {t(s as CopyKey)}
                      </option>
                    ),
                  )}
                </select>
              </label>
            )}
            {state !== "normal" ? (
              <div className="op-empty" role="status">
                <h3>{t(state as CopyKey)}</h3>
                <p>{t("accessNote")}</p>
                <button onClick={() => setState("normal")}>{t("retry")}</button>
              </div>
            ) : rows.length ? (
              <RecordList
                rows={rows}
                locale={locale}
                t={t}
                onSelect={selectRecord}
              />
            ) : (
              <div className="op-empty">
                <p>{t("empty")}</p>
                <button
                  onClick={() => {
                    setQuery("");
                    setStatus("all");
                  }}
                >
                  {t("reset")}
                </button>
              </div>
            )}
          </section>
          {section === "security" && state === "normal" && (
            <SecurityPanel t={t} />
          )}
          {row && state === "normal" && (
            <DetailPanel
              key={`${row.id}-${locale}`}
              row={row}
              section={section}
              locale={locale}
              t={t}
              onClose={closeRecord}
            />
          )}
        </div>
      </main>
    </div>
  );
}

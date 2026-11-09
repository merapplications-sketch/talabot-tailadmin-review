"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useTheme } from "@/context/theme-context";
import {
  ArrowRightIcon,
  BellIcon,
  BoxIcon,
  CartIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  DollarIcon,
  LayoutGridIcon,
  MenuIcon,
  MoonIcon,
  TruckDeliveryIcon,
  UsersIcon,
  XIcon,
} from "@/icons";
import {
  filterOrders,
  merchants,
  drivers,
  zones,
  orderStatuses,
  type OrderStatus,
} from "../orders-data";
import { entities, notices } from "../directories-data";
import { useReadNotices } from "../notification-state";
import { selectOrders, totals, expenses } from "../analytics-data";
import { copy } from "./copy";
import "./review.css";

const MERCHANT_IMAGE = "/images/cards/card-01.png";
const PERSON_IMAGE = "/images/user/user-01.jpg";
// Intentionally invalid local data, used only by the failure example (no external request).
const INVALID_IMAGE = "data:image/png;base64,invalid";
export function ReviewAvatar({
  name,
  src,
  person = false,
  large = false,
  logo = false,
}: {
  name: string;
  src?: string;
  person?: boolean;
  large?: boolean;
  logo?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const image = imageRef.current;
    setFailed(Boolean(src && image?.complete && image.naturalWidth === 0));
  }, [src]);
  return (
    <span
      className="vr-avatar"
      data-person={person}
      data-large={large}
      data-logo={logo}
      data-fallback={!src || failed}
      role="img"
      aria-label={name}
    >
      {src && !failed ? (
        <img
          ref={imageRef}
          src={src}
          alt=""
          width={large ? 80 : 48}
          height={large ? 80 : 48}
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden="true">
          {name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((s) => [...s][0])
            .join("")}
        </span>
      )}
    </span>
  );
}
function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`vr-card ${className}`}>{children}</section>;
}
function Status({ value }: { value: OrderStatus }) {
  const t = useTranslations("talabotOrders");
  const Icon =
    value === "delivered"
      ? CheckCircleIcon
      : value === "cancelled" || value === "rejected"
        ? XIcon
        : value === "pickedup"
          ? TruckDeliveryIcon
          : value === "ready"
            ? BoxIcon
            : ClockIcon;
  return (
    <span className="vr-status" data-status={value}>
      <Icon aria-hidden="true" />
      {t(`status.${value}`)}
    </span>
  );
}
function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  options: [string, string][];
}) {
  return (
    <label>
      {label}
      <span className="vr-field">
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map(([v, text]) => (
            <option key={v} value={v}>
              {text}
            </option>
          ))}
        </select>
        <ChevronDownIcon aria-hidden="true" />
      </span>
    </label>
  );
}
function Dialog({
  title,
  close,
  children,
  footer,
}: {
  title: string;
  close: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const closeText = useTranslations("talabot");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
      if (e.key !== "Tab") return;
      const all = Array.from(
        ref.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled),a[href],input,select,[tabindex="0"]',
        ) || [],
      );
      const first = all[0],
        last = all[all.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", key);
      previous?.focus({ preventScroll: true });
    };
    // close is intentionally captured for this dialog lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      className="vr-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={ref}
        className="vr-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header>
          <h2>{title}</h2>
          <button
            className="vr-button vr-icon"
            aria-label={closeText("close")}
            onClick={close}
          >
            <XIcon />
          </button>
        </header>
        <div className="vr-scroll">{children}</div>
        {footer && <footer>{footer}</footer>}
      </div>
    </div>
  );
}
export function VisualReview() {
  const locale = useLocale(),
    c = copy[locale as keyof typeof copy] || copy.en;
  const t = useTranslations("talabotOrders"),
    n = useTranslations("talabot"),
    w = useTranslations("workspace");
  const { theme, toggleTheme } = useTheme();
  const [params, setParams] = useState(new URLSearchParams());
  const [ready, setReady] = useState(false),
    [more, setMore] = useState(false),
    [menu, setMenu] = useState(false),
    [bell, setBell] = useState(false);
  const { read, mark } = useReadNotices();
  const tab = params.get("tab") || "orders";
  useEffect(() => {
    const restore = () => {
      setParams(new URLSearchParams(window.location.search));
      setReady(true);
    };
    restore();
    window.addEventListener("popstate", restore);
    const y = Number(
      sessionStorage.getItem(
        `vr-scroll:${location.pathname}${location.search}`,
      ) || 0,
    );
    requestAnimationFrame(() =>
      requestAnimationFrame(() => window.scrollTo(0, y)),
    );
    return () => window.removeEventListener("popstate", restore);
  }, []);
  function set(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next);
    window.history.replaceState(null, "", `${location.pathname}?${next}`);
  }
  function remember() {
    sessionStorage.setItem(
      `vr-scroll:${location.pathname}${location.search}`,
      String(window.scrollY),
    );
  }
  const money = (v: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "TJS",
    }).format(v);
  const date = (v: string) =>
    new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Dushanbe",
    }).format(new Date(v));
  const invalid =
    params.get("period") === "custom" &&
    !!params.get("start") &&
    !!params.get("end") &&
    params.get("start")! > params.get("end")!;
  const filtered = invalid ? [] : filterOrders(params);
  const pages = Math.max(1, Math.ceil(filtered.length / 6)),
    page = Math.min(pages, Math.max(1, Number(params.get("page")) || 1));
  const nav = ["home", "orders", "notifications", "finance"] as const;
  const navIcons = [LayoutGridIcon, BoxIcon, BellIcon, DollarIcon];
  const sum = totals(selectOrders("2026-11-01", "2026-11-09")),
    cost = expenses("2026-11-01", "2026-11-09");
  function notification(item: (typeof notices)[number]) {
    return (
      <article className="vr-notice" key={item.id} data-notice={item.id}>
        <h3>
          {!read.includes(item.id) && (
            <span className="vr-unread" aria-label={w("unread")} />
          )}
          {n(
            item.order.status === "cancelled"
              ? "cancellationReview"
              : "deliveryIssue",
          )}
        </h3>
        <p>
          {item.order.merchant} · {item.order.id}
        </p>
        <div>
          <Status value={item.order.status} />
        </div>
        <p className="vr-secondary">
          {c.noticeTime}: {date(item.order.updated)}
        </p>
        <div className="vr-notice-actions">
          <Link
            className="vr-link"
            href={`/notifications/${item.id}`}
            onClick={remember}
          >
            {w("details")}
            <ArrowRightIcon />
          </Link>
          <button
            className="vr-button"
            disabled={read.includes(item.id)}
            onClick={() => mark(item.id)}
          >
            {w(read.includes(item.id) ? "read" : "mark")}
          </button>
        </div>
      </article>
    );
  }
  return (
    <div className="vr">
      <header className="vr-header">
        <button
          className="vr-button vr-icon"
          aria-label={c.menu}
          onClick={() => setMenu(true)}
        >
          <MenuIcon />
        </button>
        <Link href="/" aria-label="TALABOT">
          <img
            className="vr-logo"
            src="/images/logo/talabot-original.png"
            width="176"
            height="44"
            alt="TALABOT"
          />
        </Link>
        <span className="vr-spacer" />
        <button
          className="vr-button vr-icon vr-theme"
          aria-label={w(theme === "light" ? "dark" : "light")}
          onClick={toggleTheme}
        >
          <MoonIcon />
        </button>
        <button
          className="vr-button vr-icon"
          aria-label={c.bell}
          onClick={() => setBell(true)}
        >
          <BellIcon />
        </button>
      </header>
      <main className="vr-main" aria-busy={!ready}>
        <div className="vr-top">
          <div>
            <h1>{c.title}</h1>
            <p className="vr-secondary">{c.intro}</p>
          </div>
          <div className="vr-row">
            <label>
              <span className="sr-only">{w("language")}</span>
              <span className="vr-field">
                <select
                  aria-label={w("language")}
                  value={locale}
                  onChange={(e) => {
                    document.cookie = `NEXT_LOCALE=${e.target.value};path=/;max-age=31536000;SameSite=Lax`;
                    window.location.href = `${e.target.value === "en" ? "" : "/" + e.target.value}/visual-review?${params}`;
                  }}
                >
                  <option value="en">English</option>
                  <option value="ru">Русский</option>
                  <option value="tg">Тоҷикӣ</option>
                </select>
                <ChevronDownIcon />
              </span>
            </label>
            <button className="vr-button" onClick={toggleTheme}>
              {w(theme === "light" ? "dark" : "light")}
            </button>
          </div>
        </div>
        <details>
          <summary>
            <span className="vr-status">{n("preview")}</span>
            <ChevronDownIcon />
          </summary>
          <p className="vr-secondary">
            {c.scope} {locale === "tg" && c.languageNote}
          </p>
        </details>
        <div className="vr-row">
          {/* Static HTML asset: use native navigation, not the localized App Router. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className="vr-button" href="/review-gallery/index.html">
            {c.gallery}
          </a>
          <Link className="vr-button" href="/review/operations">
            {c.operations}
          </Link>
        </div>
        <nav className="vr-tabs" aria-label={c.models}>
          {[
            ["orders", n("orders")],
            ["accounts", c.accounts],
            ["notifications", n("notifications")],
            ["metrics", c.metrics],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`?tab=${id}`}
              aria-current={tab === id ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                set("tab", id);
              }}
            >
              {label}
            </a>
          ))}
        </nav>
        {tab === "orders" && (
          <>
            <Card className="vr-stack">
              <label className="vr-search">
                {t("search")}
                <input
                  type="search"
                  placeholder={c.search}
                  value={params.get("q") || ""}
                  onChange={(e) => set("q", e.target.value)}
                />
              </label>
              <div className="vr-row" aria-label={t("statusLabel")}>
                {["", "pending", "preparing", "delivered"].map((s) => (
                  <button
                    key={s}
                    className="vr-button"
                    aria-pressed={(params.get("status") || "") === s}
                    onClick={() => set("status", s)}
                  >
                    {s ? t(`status.${s}`) : t("all")}
                  </button>
                ))}
              </div>
              <details
                open={more}
                onToggle={(e) => setMore(e.currentTarget.open)}
              >
                <summary>
                  {t("moreFilters")}
                  <ChevronDownIcon />
                </summary>
                <div className="vr-filters">
                  <Select
                    label={c.more}
                    value={params.get("status") || ""}
                    onChange={(v) => set("status", v)}
                    options={[
                      ["", t("all")],
                      ...orderStatuses.map(
                        (s) => [s, t(`status.${s}`)] as [string, string],
                      ),
                    ]}
                  />
                  <Select
                    label={t("period")}
                    value={params.get("period") || "all"}
                    onChange={(v) => set("period", v)}
                    options={["all", "today", "week", "month", "custom"].map(
                      (s) => [s, t(s)],
                    )}
                  />
                  {params.get("period") === "custom" &&
                    ["start", "end"].map((k) => (
                      <label key={k}>
                        {t(k)}
                        <input
                          type="date"
                          value={params.get(k) || ""}
                          onChange={(e) => set(k, e.target.value)}
                        />
                      </label>
                    ))}
                  {(
                    [
                      ["merchant", merchants],
                      ["driver", ["unassigned", ...drivers]],
                      ["pickup", zones],
                      ["delivery", zones],
                    ] as [string, string[]][]
                  ).map(([k, values]) => (
                    <Select
                      key={k}
                      label={t(k)}
                      value={params.get(k) || ""}
                      onChange={(v) => set(k, v)}
                      options={[
                        ["", t("all")],
                        ...values.map(
                          (v) =>
                            [v, v === "unassigned" ? t(v) : v] as [
                              string,
                              string,
                            ],
                        ),
                      ]}
                    />
                  ))}
                </div>
              </details>
              <div className="vr-chips">
                {Array.from(params.entries())
                  .filter(
                    ([k, v]) =>
                      v &&
                      !["tab", "page", "sort"].includes(k) &&
                      !(k === "period" && v === "all"),
                  )
                  .map(([k, v]) => (
                    <button
                      key={k}
                      className="vr-chip"
                      aria-label={`${c.reset}: ${k === "q" ? t("search") : t(k === "status" ? "statusLabel" : k)}`}
                      onClick={() => set(k, "")}
                    >
                      {k === "status"
                        ? t(`status.${v}`)
                        : k === "period"
                          ? t(v)
                          : v}
                      <XIcon />
                    </button>
                  ))}
              </div>
              {invalid && <p role="alert">{c.dateError}</p>}
              <div className="vr-results">
                <p role="status">{t("results", { count: filtered.length })}</p>
                <div className="vr-sort">
                  <Select
                    label={t("sort")}
                    value={params.get("sort") || "newest"}
                    onChange={(v) => set("sort", v)}
                    options={[
                      ["newest", t("newest")],
                      ["oldest", t("oldest")],
                    ]}
                  />
                </div>
              </div>
            </Card>
            <div className="vr-order-grid">
              {filtered.slice((page - 1) * 6, page * 6).map((o) => (
                <Card key={o.id} className="vr-order">
                  <div className="vr-order-top">
                    <h3>{o.id}</h3>
                    <Status value={o.status} />
                  </div>
                  <div className="vr-identity">
                    <ReviewAvatar name={o.merchant} src={MERCHANT_IMAGE} />
                    <div>
                      <strong>{o.merchant}</strong>
                      <p className="vr-secondary">{date(o.created)}</p>
                    </div>
                  </div>
                  <div className="vr-route">
                    <span>
                      <small>{t("pickup")}</small>
                      <br />
                      {o.pickup}
                    </span>
                    <ArrowRightIcon aria-hidden="true" />
                    <span>
                      <small>{t("delivery")}</small>
                      <br />
                      {o.deliveryZone}
                    </span>
                  </div>
                  <div className="vr-driver-row">
                    <div className="vr-identity">
                      {o.driver && (
                        <ReviewAvatar
                          name={o.driver}
                          src={PERSON_IMAGE}
                          person
                        />
                      )}
                      <div>
                        <small>{t("driver")}</small>
                        <p>{o.driver || t("unassigned")}</p>
                      </div>
                    </div>
                  </div>
                  <div className="vr-order-footer">
                    <Link
                      className="vr-link"
                      href={`/orders/${o.id}`}
                      onClick={remember}
                    >
                      {t("details")}
                      <ArrowRightIcon />
                    </Link>
                    <span className="vr-money">{money(o.total / 100)}</span>
                  </div>
                </Card>
              ))}
            </div>
            {filtered.length === 0 && <Card>{t("empty")}</Card>}
            <div className="vr-pages">
              <button
                className="vr-button"
                disabled={page === 1}
                onClick={() => set("page", String(page - 1))}
              >
                {w("previous")}
              </button>
              <span>{w("page", { page, pages })}</span>
              <button
                className="vr-button"
                disabled={page === pages}
                onClick={() => set("page", String(page + 1))}
              >
                {w("next")}
              </button>
            </div>
            <p className="vr-secondary">
              {c.imageNote} {c.detailsNote}
            </p>
          </>
        )}
        {tab === "accounts" && (
          <>
            <h2>{c.header}</h2>
            <Card className="vr-details-head">
              <Link className="vr-button" href="/restaurants">
                {w("back")}
              </Link>
              <ReviewAvatar name="Demo Bistro" src={MERCHANT_IMAGE} large />
              <div>
                <h2>Demo Bistro</h2>
                <p className="vr-secondary">
                  {w("restaurant")} · {c.photo}
                </p>
              </div>
            </Card>
            <div className="vr-identity-grid">
              {(["restaurants", "drivers", "customers"] as const).map(
                (kind) => {
                  const e = entities(kind)[0],
                    person = kind !== "restaurants";
                  return (
                    <Card key={kind} className="vr-stack">
                      <div className="vr-identity">
                        <ReviewAvatar
                          name={e.name}
                          src={person ? PERSON_IMAGE : MERCHANT_IMAGE}
                          person={person}
                        />
                        <div>
                          <h3>{e.name}</h3>
                          <small>
                            {kind === "restaurants" ? w("restaurant") : n(kind)}
                          </small>
                        </div>
                      </div>
                      <p>{t("results", { count: e.orders.length })}</p>
                      <p className="vr-secondary">
                        {w("area")}:{" "}
                        {[
                          ...new Set(
                            e.orders.flatMap((o) => [o.pickup, o.deliveryZone]),
                          ),
                        ].join(" · ")}
                      </p>
                      <Link
                        className="vr-link"
                        href={`/${kind}/${e.id}`}
                        onClick={remember}
                      >
                        {w("details")}
                        <ArrowRightIcon />
                      </Link>
                    </Card>
                  );
                },
              )}
            </div>
            <p className="vr-secondary">{c.imageNote}</p>
            <h2>{c.samples}</h2>
            <div className="vr-identity-grid">
              {[
                {
                  name: "Demo International Restaurant & Marketplace — Ismoili Somoni Community",
                  src: MERCHANT_IMAGE,
                  label: c.long,
                  person: false,
                },
                {
                  name: "Demo Customer",
                  src: undefined,
                  label: c.missing,
                  person: true,
                },
                {
                  name: "Demo Driver",
                  src: INVALID_IMAGE,
                  label: c.failed,
                  person: true,
                },
              ].map((e) => (
                <Card key={e.label} className="vr-stack">
                  <div className="vr-identity">
                    <ReviewAvatar name={e.name} src={e.src} person={e.person} />
                    <h3>{e.name}</h3>
                  </div>
                  <p className="vr-secondary">{e.label}</p>
                </Card>
              ))}
            </div>
            <Card className="vr-details-head">
              <ReviewAvatar
                name="Demo Driver A"
                src={PERSON_IMAGE}
                person
                large
              />
              <div>
                <h2>Demo Driver A</h2>
                <small>
                  {c.photo} · {c.unknown}
                </small>
              </div>
              <Link href="/drivers/1" className="vr-link">
                {w("details")}
                <ArrowRightIcon />
              </Link>
            </Card>
          </>
        )}
        {tab === "notifications" && (
          <>
            <p className="vr-secondary">{w("local")}</p>
            <Card className="vr-notices">{notices.map(notification)}</Card>
          </>
        )}
        {tab === "metrics" && (
          <>
            <h2>{c.summary}</h2>
            <div className="vr-metrics">
              {[
                {
                  key: "activeOrders",
                  value: "24",
                  Icon: BoxIcon,
                  href: "/orders",
                },
                {
                  key: "availableDrivers",
                  value: "12",
                  Icon: TruckDeliveryIcon,
                  href: "/drivers",
                },
                {
                  key: "openRestaurants",
                  value: "18",
                  Icon: CartIcon,
                  href: "/restaurants",
                },
                {
                  key: "customers",
                  value: "3,782",
                  Icon: UsersIcon,
                  href: "/customers",
                },
              ].map(({ key, value, Icon, href }) => (
                <Link key={key} href={href} className="vr-card vr-metric">
                  <Icon aria-hidden="true" />
                  <span className="vr-value">{value}</span>
                  <span>{n(key)}</span>
                </Link>
              ))}
            </div>
            <h2>{c.financial}</h2>
            <p className="vr-secondary">{c.period}</p>
            <div className="vr-metrics vr-money-grid">
              {[
                [w("orders"), sum.orders],
                [w("completed"), sum.completed],
                [w("cancelled"), sum.cancelled],
                [w("delayed"), sum.delayed],
                [w("other"), sum.orders - sum.completed - sum.cancelled],
                [w("sales"), money(sum.sales)],
                [w("revenue"), money(sum.revenue)],
                [w("expenses"), money(cost.recorded)],
              ].map(([label, value]) => (
                <Card key={label} className="vr-metric">
                  <DollarIcon aria-hidden="true" />
                  <strong
                    className="vr-value"
                    data-wide={typeof value === "string"}
                  >
                    {value}
                  </strong>
                  <span>{label}</span>
                </Card>
              ))}
            </div>
            <p>{w("profit")}</p>
            <p className="vr-secondary">{w("historical")}</p>
          </>
        )}
        <details>
          <summary>
            {c.source}
            <ChevronDownIcon />
          </summary>
          <p className="vr-secondary">{c.sourceText}</p>
        </details>
      </main>
      <nav className="vr-bottom" aria-label={n("mobileNavigation")}>
        {nav.map((key, i) => {
          const Icon = navIcons[i];
          return (
            <Link
              key={key}
              href={key === "home" ? "/" : `/${key}`}
              aria-current={tab === key ? "page" : undefined}
            >
              <Icon />
              <span>{n(key)}</span>
            </Link>
          );
        })}
      </nav>
      {menu && (
        <Dialog title={n("navigation")} close={() => setMenu(false)}>
          <nav className="vr-menu">
            {[
              "home",
              "orders",
              "restaurants",
              "drivers",
              "customers",
              "finance",
              "reports",
              "settings",
            ].map((key) => (
              <Link
                key={key}
                className="vr-button"
                href={key === "home" ? "/" : `/${key}`}
              >
                {n(key)}
              </Link>
            ))}
          </nav>
        </Dialog>
      )}
      {bell && (
        <Dialog
          title={n("notifications")}
          close={() => setBell(false)}
          footer={
            <Link className="vr-button" href="/notifications">
              {c.allNotices}
            </Link>
          }
        >
          {notices.map(notification)}
        </Dialog>
      )}
    </div>
  );
}

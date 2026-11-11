import { actionColors } from "./action-colors";
import NativeIdentity from "./b-shell/identity";
import { CallIcon, MapIcon, StarIcon, AlertIcon, BoxIcon } from "@/icons";
import SummaryCards from "./b-shell/summary-cards";
import {
  ratingAverage,
  needsRatingFollowup,
  ratingComment,
} from "./ratings-data";
import {
  entityRecord,
  entityStatus,
  filterDrivers,
  cashExceeded,
} from "./entity-data";
import { isLive, isBusy, locationFresh } from "./order-operations";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { NativeGrid } from "./b-shell/entity-grid";
import { SettingsPresentation } from "./b-shell/settings";
import { Badge } from "@/components/ui/badge";
import { useLocale, useTranslations } from "next-intl";
import { formatDate } from "./format";
import SearchField from "./b-shell/search-field";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { syntheticCash, syntheticWallets } from "./scenario-responses";
import MutationAction from "./mutation-action";
import {
  parallelResults,
  stopOnError,
  createMerchantPayload,
  merchantPayload,
  bannerPayload,
  promoPayload,
  happyPayload,
} from "./form-contracts";
import TicketDetails from "./ticket-details";
import { mutations } from "./mutation-service";
import { permissions } from "./validation";
import {
  validateWallet,
  validatePhone,
  validateStaff,
  validateMerchant,
  validatePromo,
  validateBanner,
  validateHappy,
} from "./validation";
import { useState } from "react";
import { tables, text, number, type Row } from "./domain";
import { Card, Pair } from "./primitives";
import { readLogs, logActor, logChanges } from "./log-data";
import NativeForm from "./native-form";
import {
  merchantFields,
  bannerFields,
  promoFields,
  loyaltyFields,
  tariffFields,
  happyFields,
} from "./fields";
type Props = {
  section: string;
  query: string;
  id: string;
  t: (k: string) => string;
  onBack?: () => void;
  navigate: (patch: { section?: string; id?: string; query?: string }) => void;
};
const panel =
  "rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3";
const tableNames: Record<string, string> = {
  restaurants: "stores",
  drivers: "profiles",
  customers: "profiles",
  support: "support_tickets",
  ratings: "ratings",
  banners: "banners",
  promotions: "promo_codes",
  log: "audit_log",
  staff: "staff_members",
};
export default function EntitySections({
  section,
  query,
  id,
  t,
  navigate,
  onBack,
}: Props) {
  const locale = useLocale();
  const wt = useTranslations("workspace");
  const ft = useTranslations("ownerRound");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filter, setFilter] = useState(
      () =>
        sessionStorage.getItem("ux02-native:filter:" + section) ||
        (section === "ratings" ? "need" : "all"),
    ),
    [limit, setLimit] = useState(30),
    [historyLimit, setHistoryLimit] = useState(
      () => Number(sessionStorage.getItem("ux02-native:history:" + id)) || 50,
    ),
    [notice, setNotice] = useState(""),
    [logs, setLogs] = useState(readLogs);
  const source = (tables[tableNames[section]] || [])
    .map((r) => entityRecord(section, r))
    .filter((r) =>
      section === "drivers"
        ? r.role === "driver"
        : section === "customers"
          ? r.role === "customer"
          : true,
    );
  const rows =
    section === "drivers"
      ? filterDrivers(source, query, filter)
      : source.filter(
          (r) =>
            Object.values(r)
              .filter((v) => typeof v === "string")
              .join(" ")
              .toLowerCase()
              .includes(query.toLowerCase()) &&
            (section === "ratings"
              ? filter === "need"
                ? needsRatingFollowup(r)
                : filter === "done"
                  ? !!r.handled_at
                  : true
              : filter === "all" ||
                text(r, "status") === filter ||
                (filter === "open"
                  ? !!r.is_open
                  : filter === "closed"
                    ? !r.is_open
                    : true)),
        );
  const driverAverage = ratingAverage(source, "driver_stars"),
    storeAverage = ratingAverage(source, "store_stars"),
    needsCount = source.filter(needsRatingFollowup).length,
    handledCount = source.filter((r) => r.handled_at).length;
  const ratingStatus = (r: Row) =>
    r.handled_at ? "aHandled" : needsRatingFollowup(r) ? "aNeeds" : "uRNot";
  const ratingStore = (r: Row) =>
    text(tables.stores.find((s) => s.id === r.store_id) || {}, "name") || "—";
  const row = source.find((r) => String(r.id) === id);
  const write = () => setNotice(t("nativeWriteBlocked"));
  const back = (
    <Button
      size="lg"
      variant="outline"
      onClick={
        section === "ratings" && onBack ? onBack : () => navigate({ id: "" })
      }
    >
      ← {t("aBack")}
    </Button>
  );
  const linkOrder = (r: Row) => (
    <Button
      size="lg"
      variant="outline"
      onClick={() =>
        navigate({
          section: "orders",
          id: text(r, "order_id") || text(r, "id"),
        })
      }
    >
      #{text(r, "order_id") || text(r, "id")}
    </Button>
  );
  const history = (person: Row, key: string) => {
    const orders = tables.orders.filter((o) => o[key] === person.id),
      shown = orders.slice(0, historyLimit);
    return (
      <Card title={t(key === "driver_id" ? "aDrvHist" : "xCuHist")}>
        <p>
          {t("uCuShown")
            .replace("{n}", String(shown.length))
            .replace("{m}", String(orders.length))}
        </p>
        {shown.map((o) => (
          <Pair key={text(o, "id")} label={t(text(o, "status"))}>
            {linkOrder(o)} · {number(o, "total").toFixed(2)} TJS
          </Pair>
        ))}
        {orders.length > historyLimit && (
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              setHistoryLimit(historyLimit + 50);
              sessionStorage.setItem(
                "ux02-native:history:" + id,
                String(historyLimit + 50),
              );
            }}
          >
            {t("xMore")}
          </Button>
        )}
      </Card>
    );
  };
  const reason = [{ key: "reason", label: "xPhWhy", maxLength: 200 }];
  const blocked = null;
  if (section === "texts")
    return (
      <div className="space-y-4">
        <SettingsPresentation />

        {tables.app_pages.map((r) => (
          <NativeForm
            key={text(r, "slug")}
            title={t(r.slug === "about" ? "xTxAbout" : "xTxPriv")}
            operation={(d) =>
              stopOnError(
                ["ru", "en"].map(
                  (lang) => () =>
                    mutations.setPage(r.slug, lang, d["body_" + lang]),
                ),
              )
            }
            initial={r}
            summary={["ru", "en"].map((lang) => ({
              label: t(lang === "ru" ? "xTxRu" : "xTxEn"),
              value:
                text(r, "body_" + lang).slice(0, 160) +
                (text(r, "body_" + lang).length > 160 ? "…" : ""),
            }))}
            fields={[
              {
                key: "body_ru",
                label: "xTxRu",
                type: "textarea",
                maxLength: 20000,
              },
              {
                key: "body_en",
                label: "xTxEn",
                type: "textarea",
                maxLength: 20000,
              },
            ]}
            t={t}
          />
        ))}
      </div>
    );
  if (section === "loyalty")
    return (
      <div className="space-y-4">
        <NativeForm
          title={t("tY")}
          operation={(d) =>
            stopOnError(
              loyaltyFields
                .filter(
                  (f) =>
                    Number(d[f.key]) !==
                    Number(
                      tables.app_settings.find((s) => s.key === f.key)?.value,
                    ),
                )
                .map((f) => () => mutations.setSetting(f.key, d[f.key])),
            )
          }
          summary={loyaltyFields.map((f) => ({
            label: t(f.label),
            value:
              text(
                tables.app_settings.find((r) => r.key === f.key) || {},
                "value",
              ) || "—",
          }))}
          fields={loyaltyFields}
          initial={Object.fromEntries(
            tables.app_settings.map((r) => [text(r, "key"), r.value]),
          )}
          t={t}
        />
        {tables.stores.map((r) => (
          <NativeForm
            key={text(r, "id")}
            title={text(r, "name")}
            operation={(d) =>
              parallelResults([
                () =>
                  mutations.setStoreLoyalty(
                    r.id,
                    d.points_min_order,
                    d.cashback_pct,
                  ),
                () => mutations.setStoreFreeDelivery(r.id, d.free_delivery_min),
                () => mutations.setStoreEarn(r.id, d.earn_per_tjs),
              ])
            }
            initial={r}
            summary={[
              ["points_min_order", "yMinO"],
              ["cashback_pct", "yStoreCb"],
              ["earn_per_tjs", "yEarnS"],
              ["free_delivery_min", "yFd"],
            ].map(([key, label]) => ({
              label: t(label),
              value: text(r, key) || "—",
            }))}
            fields={[
              { key: "points_min_order", label: "yMinO", type: "number" },
              {
                key: "cashback_pct",
                label: "yStoreCb",
                type: "number",
                max: 50,
              },
              {
                key: "earn_per_tjs",
                label: "yEarnS",
                type: "number",
                max: 1000,
              },
              {
                key: "free_delivery_min",
                label: "yFd",
                type: "number",
                max: 100000,
              },
            ]}
            t={t}
          />
        ))}
        <NativeForm
          title={t("yHeAdd")}
          fields={happyFields}
          operation={(r) => mutations.saveHH(happyPayload(r))}
          validate={validateHappy}
          t={t}
        />
        {tables.happy_hours.map((r) => (
          <NativeForm
            key={text(r, "id")}
            title={text(r, "title")}
            fields={happyFields}
            summary={[
              { label: t("aDis"), value: text(r, "discount_pct") + "%" },
              { label: t("aBFrom"), value: text(r, "start_time").slice(0, 5) },
              { label: t("aBTo"), value: text(r, "end_time").slice(0, 5) },
              { label: t("uConfAct"), value: t(r.active ? "aOn" : "aOff") },
            ]}
            initial={r}
            operation={(r) => mutations.saveHH(happyPayload(r))}
            validate={validateHappy}
            t={t}
          />
        ))}
      </div>
    );
  if (section === "staff")
    return (
      <div className="space-y-4">
        <NativeForm
          title={t("aStfT")}
          operation={(r) =>
            mutations.staffSet(
              r.email,
              permissions.filter((k) => r[k]),
              true,
            )
          }
          validate={validateStaff}
          fields={[
            { key: "email", label: "aStfEmail", type: "email", maxLength: 120 },
            ...["orders", "support", "finance", "stores", "content"].map(
              (k) => ({ key: k, label: "aP_" + k, type: "checkbox" as const }),
            ),
          ]}
          t={t}
        />
        <Card>
          <p>{t("aStfNone")}</p>
          {blocked}
        </Card>
      </div>
    );
  if (section === "log")
    return (
      <Card title={t("tL")}>
        <div className="flex gap-2">
          <Button
            size="lg"
            variant="outline"
            aria-pressed={filter !== "errors"}
            onClick={() => {
              setFilter("all");
              sessionStorage.setItem("ux02-native:filter:log", "all");
            }}
          >
            {t("aTabAudit")} · {logs.audit.length}
          </Button>
          <Button
            size="lg"
            variant="outline"
            aria-pressed={filter === "errors"}
            onClick={() => {
              setFilter("errors");
              sessionStorage.setItem("ux02-native:filter:log", "errors");
            }}
          >
            {t("aTabErr")} · {logs.errors.length}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setLogs(readLogs())}
          >
            {t("uTxRetry")}
          </Button>
        </div>
        {filter === "errors" ? (
          logs.errors.length ? (
            logs.errors.map((r, i) => (
              <Card
                key={text(r, "id") || String(i)}
                title={text(r, "app") || "?"}
              >
                <p>{formatDate(text(r, "at"), locale)}</p>
                <p>{text(r, "message")}</p>
                <Pair label={t("aCtx")}>{text(r, "context")}</Pair>
                <Pair label={t("aWho")}>
                  {logActor(r.user_id)} · {text(r, "ua").slice(0, 60)}
                </Pair>
              </Card>
            ))
          ) : (
            <p>{t("aNoErr")}</p>
          )
        ) : logs.audit.length ? (
          logs.audit.map((r, i) => (
            <Card
              key={text(r, "id") || String(i)}
              title={text(r, "table_name") + " · " + text(r, "action")}
            >
              <p>{formatDate(text(r, "at"), locale)}</p>
              <Pair label={t("aWho")}>
                {logActor(r.user_id)} · {text(r, "row_id").slice(0, 12)}
              </Pair>
              {logChanges(r.details).map((c) => (
                <Pair key={c.field} label={c.field}>
                  {c.from} → {c.to}
                </Pair>
              ))}
            </Card>
          ))
        ) : (
          <p>{t("aNoAudit")}</p>
        )}
      </Card>
    );
  if (id === "new" && section === "restaurants")
    return (
      <>
        {back}
        <NativeForm
          title={t("aAddS")}
          operation={(r) => mutations.addStore(createMerchantPayload(r))}
          initial={{
            category: "rest",
            fee_type: "fixed",
            commission_pct: 10,
            discount_pct: 0,
            fee_base: "",
          }}
          fields={merchantFields.filter((f) =>
            [
              "name",
              "description",
              "phone",
              "category",
              "commission_pct",
              "fee_type",
              "fee_base",
              "discount_pct",
            ].includes(f.key),
          )}
          t={t}
          validate={(r) =>
            !text(r, "name").trim()
              ? "aFill"
              : !text(r, "phone").trim()
                ? "aPhReq"
                : r.fee_type !== "free" &&
                    (r.fee_base === "" || !(Number(r.fee_base) >= 0))
                  ? "aFeeReq"
                  : null
          }
        />
      </>
    );
  if (id === "new" && (section === "banners" || section === "promotions"))
    return (
      <>
        {back}
        <NativeForm
          title={t(section === "banners" ? "aAddB" : "aAddP")}
          operation={(r) =>
            section === "banners"
              ? mutations.addBanner(bannerPayload(r))
              : mutations.addPromo(promoPayload(r))
          }
          validate={section === "banners" ? validateBanner : validatePromo}
          fields={section === "banners" ? bannerFields : promoFields}
          t={t}
        />
      </>
    );
  if (row) {
    if (section === "restaurants")
      return (
        <div className="space-y-4">
          {back}
          <NativeForm
            title={t("aEdS")}
            operation={(r) => mutations.updateStore(row.id, merchantPayload(r))}
            fields={merchantFields}
            initial={row}
            t={t}
            validate={validateMerchant}
          />
          <Card title={t("aLoc")}>
            <p>
              {text(row, "lat")}, {text(row, "lng")}
            </p>
            <Button
              variant="outline"
              size="icon-lg"
              nativeButton={false}
              aria-label={t("aMapOpen")}
              title={t("aMapOpen")}
              render={
                <a
                  href={`https://www.google.com/maps?q=${row.lat},${row.lng}`}
                  target="_blank"
                  rel="noreferrer"
                />
              }
            >
              <MapIcon aria-hidden="true" />
            </Button>
            <Button variant="outline" onClick={write} size="lg">
              {t("aLocSet")}
            </Button>
            <Button variant="outline" onClick={write} size="lg">
              {t("aLocClr")}
            </Button>
            <Button variant="outline" onClick={write} size="lg">
              {t("aRatGet")}
            </Button>
          </Card>
          <NativeForm
            title={t("aOwn")}
            operation={(r) => mutations.assignOwner(row.id, r.owner)}
            initial={{ owner_id: row.owner_id }}
            fields={[{ key: "owner", label: "aOwnPh", type: "email" }]}
            t={t}
          />
          <Card title={t("aStoreL")}>
            <p>
              {(tables.brands.find((b) => b.id === row.brand_id)
                ?.name as string) || "—"}{" "}
              · {text(row, "branch_name")}
            </p>
            {blocked}
            <MutationAction
              label={t(row.is_active ? "aSus" : "aAc")}
              t={t}
              operation={() =>
                mutations.updateStore(row.id, { is_active: !row.is_active })
              }
            />
          </Card>
          {notice && <p role="alert">{notice}</p>}
        </div>
      );
    if (section === "drivers")
      return (
        <div className="space-y-4">
          {back}
          <Card>
            <div className="flex items-center gap-3">
              <NativeIdentity
                name={text(row, "name")}
                src={text(row, "avatar_url") || undefined}
                person
                presence={isLive(row)}
                presenceLabel={t(isLive(row) ? "aOnlineL" : "aOfflineL")}
              />
              <h2 className="min-w-0 flex-1 text-lg font-semibold text-gray-800 dark:text-white/90">
                {text(row, "name")}
              </h2>
            </div>
            <p>
              <Badge color={entityStatus(section, row).color}>
                {t(entityStatus(section, row).label)}
              </Badge>{" "}
              {isLive(row) && isBusy(row) && (
                <Badge color="warning">{t("aBusy")}</Badge>
              )}
            </p>
            {!!row.phone && (
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0 font-medium">
                  {text(row, "phone")}
                </span>
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className="text-success-600 dark:text-success-400 shrink-0"
                  nativeButton={false}
                  aria-label={t("aCall") + ": " + text(row, "phone")}
                  title={t("aCall") + ": " + text(row, "phone")}
                  render={<a href={"tel:" + text(row, "phone")} />}
                >
                  <CallIcon className={actionColors.phone} aria-hidden="true" />
                </Button>
              </div>
            )}
            {!!row.accept_blocked && (
              <p className="text-error-500">{t("aBlocked")}</p>
            )}
            <Pair label={t("aCashH")}>
              {syntheticCash[text(row, "id")] ?? "—"} /{" "}
              {number(row, "cash_limit") || 1000} TJS
            </Pair>
            {syntheticCash[text(row, "id")] == null && (
              <p>{t("nativeCashMissing")}</p>
            )}
            {cashExceeded(row, syntheticCash[text(row, "id")]) && (
              <Alert variant="warning">
                <AlertTitle>{t("aOver")}</AlertTitle>
              </Alert>
            )}
            <p>
              {t("aSeenL")}: {formatDate(text(row, "last_seen"), locale)}
            </p>
            <div className="flex flex-wrap gap-2">
              <MutationAction
                label={t("aDrvA")}
                t={t}
                operation={() => mutations.setDriverStatus(row.id, "approved")}
              />
              <MutationAction
                label={t("aDrvS")}
                t={t}
                operation={() => mutations.setDriverStatus(row.id, "suspended")}
              />
              <MutationAction
                label={t(row.accept_blocked ? "aAllow" : "aBlock")}
                t={t}
                operation={() =>
                  mutations.setDriverBlocked(row.id, !row.accept_blocked)
                }
              />
              {syntheticCash[text(row, "id")] != null ? (
                <MutationAction
                  label={t("aSettle")}
                  confirm={
                    t("aSettleQ") +
                    " " +
                    syntheticCash[text(row, "id")].toFixed(2) +
                    " TJS?"
                  }
                  t={t}
                  operation={() => mutations.settleCash(row.id)}
                />
              ) : (
                <Button
                  variant="outline"
                  disabled
                  title={t("nativeCashMissing")}
                  size="lg"
                >
                  {t("aSettle")}
                </Button>
              )}
            </div>
          </Card>
          <NativeForm
            title={t("aLimP")}
            operation={(r) => mutations.setDriverLimit(row.id, r.cash_limit)}
            fields={[
              { key: "cash_limit", label: "aLimP", type: "number", min: 1 },
            ]}
            initial={row}
            t={t}
            validate={(r) =>
              !Number.isFinite(number(r, "cash_limit")) ||
              number(r, "cash_limit") <= 0 ||
              number(r, "cash_limit") > 1000000
                ? "err_bad_value"
                : null
            }
          />
          {history(row, "driver_id")}
          {notice && <p role="alert">{notice}</p>}
        </div>
      );
    if (section === "customers")
      return (
        <div className="space-y-4">
          {back}
          <Card>
            <div className="flex items-center gap-3">
              <NativeIdentity
                name={text(row, "name")}
                src={text(row, "avatar_url") || undefined}
                person
              />
              <h2 className="min-w-0 flex-1 text-lg font-semibold text-gray-800 dark:text-white/90">
                {text(row, "name")}
              </h2>
            </div>
            {!!row.phone && (
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0 font-medium">
                  {text(row, "phone")}
                </span>
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className="text-success-600 dark:text-success-400 shrink-0"
                  nativeButton={false}
                  aria-label={t("aCall") + ": " + text(row, "phone")}
                  title={t("aCall") + ": " + text(row, "phone")}
                  render={<a href={"tel:" + text(row, "phone")} />}
                >
                  <CallIcon className={actionColors.phone} aria-hidden="true" />
                </Button>
              </div>
            )}

            <Pair label={t("xCuReg")}>
              {formatDate(text(row, "created_at"), locale)}
            </Pair>
          </Card>
          <Card title={t("xWalT")}>
            {syntheticWallets[text(row, "id")] ? (
              <Pair label={t("xWalBal")}>
                {syntheticWallets[text(row, "id")].balance.toFixed(2)} TJS
              </Pair>
            ) : (
              <p>{t("nativeCashMissing")}</p>
            )}
            {tables.wallet_entries
              .filter((w) => w.user_id === row.id)
              .map((w) => (
                <Pair
                  key={text(w, "id")}
                  label={t("wk_" + text(w, "kind")) + " · " + text(w, "note")}
                >
                  {number(w, "amount")} TJS ·{" "}
                  {formatDate(text(w, "created_at"), locale)}
                </Pair>
              ))}
          </Card>
          <Card>
            <NativeForm
              title={t("xWalAdj")}
              operation={(r) =>
                mutations.walletAdjust(row.id, r.amount, r.note)
              }
              validate={validateWallet}
              fields={[
                { key: "amount", label: "xWalAmt", type: "number" },
                { key: "note", label: "xWalNote", maxLength: 200 },
              ]}
              t={t}
            />
            <NativeForm
              title={t(row.banned_at ? "xUnban" : "xBan")}
              operation={(r) =>
                mutations.setBan(row.id, !row.banned_at, r.reason)
              }
              fields={reason}
              validate={(r) =>
                !row.banned_at && text(r, "reason").trim().length < 3
                  ? "err_note_required"
                  : null
              }
              confirm={row.banned_at ? undefined : t("xBanQ")}
              t={t}
            />
            <NativeForm
              title={t("xPhChg")}
              operation={(r) =>
                mutations.setCustomerPhone(row.id, r.phone, r.reason)
              }
              validate={validatePhone}
              fields={[
                { key: "phone", label: "xPhNew", type: "tel" },
                ...reason,
              ]}
              t={t}
            />
          </Card>
          {history(row, "customer_id")}
        </div>
      );
    if (section === "support")
      return (
        <TicketDetails
          ticket={row}
          t={t}
          back={() => navigate({ id: "" })}
          openOrder={(orderId) => navigate({ section: "orders", id: orderId })}
        />
      );
    if (section === "banners" || section === "promotions")
      return (
        <div className="space-y-4">
          {back}
          <Badge color={entityStatus(section, row).color}>
            {t(entityStatus(section, row).label)}
          </Badge>
          <NativeForm
            title={text(row, section === "banners" ? "title" : "code")}
            operation={(r) =>
              section === "banners"
                ? mutations.updateBanner(row.id, bannerPayload(r))
                : mutations.updatePromo(row.id, promoPayload(r))
            }
            initial={row}
            validate={section === "banners" ? validateBanner : validatePromo}
            fields={section === "banners" ? bannerFields : promoFields}
            t={t}
          />
          <MutationAction
            label={t("aRm")}
            confirm="?"
            t={t}
            operation={() =>
              section === "banners"
                ? mutations.deleteBanner(row.id)
                : mutations.deletePromo(row.id)
            }
          />
          {notice && <p role="alert">{notice}</p>}
        </div>
      );
    if (section === "ratings")
      return (
        <div className="space-y-4">
          {back}
          <Card title={t("tR")}>
            <Pair label={t("aStoreL")}>{ratingStore(row)}</Pair>
            <Pair label={wt("date")}>
              {formatDate(text(row, "created_at"), locale)}
            </Pair>
            {row.store_stars != null && (
              <Pair label={t("aStoreRate2")}>{text(row, "store_stars")} ★</Pair>
            )}
            {row.driver_stars != null && (
              <Pair label={t("aCourierRate")}>
                {text(row, "driver_stars")} ★
              </Pair>
            )}
            {ratingComment(row.comment).tags.map((tag, i) => (
              <Badge key={i} color="gray">
                {tag}
              </Badge>
            ))}
            <Pair label={t("ratingComment")}>
              {ratingComment(row.comment).text ||
                (ratingComment(row.comment).tags.length ? "—" : t("aNoCmt"))}
            </Pair>
            <Pair label={t("aStat")}>
              <Badge
                color={
                  row.handled_at
                    ? "success"
                    : needsRatingFollowup(row)
                      ? "warning"
                      : "gray"
                }
              >
                {t(ratingStatus(row))}
              </Badge>
            </Pair>
            {!!row.handled_at && (
              <Pair label={t("aHandled")}>
                {formatDate(text(row, "handled_at"), locale)}
              </Pair>
            )}
            {!!row.handled_note && (
              <Pair label={t("aResNote")}>{text(row, "handled_note")}</Pair>
            )}
            {linkOrder(row)}
          </Card>
          {row.handled_at ? (
            <MutationAction
              label={t("aReopen")}
              t={t}
              operation={() => mutations.reopenRating(row.order_id)}
            />
          ) : (
            <NativeForm
              title={t("aResolveT")}
              resetAfterSuccess
              closeAfterSuccess
              operation={(r) => mutations.resolveRating(row.order_id, r.note)}
              fields={[{ key: "note", label: "aResNote", maxLength: 300 }]}
              t={t}
            />
          )}
        </div>
      );
  }
  return (
    <div className="space-y-4">
      {section === "ratings" && (
        <SummaryCards
          cards={[
            {
              key: "driver",
              label: `${t("aRAvgD")} · ${driverAverage?.n || 0} ${t("aRCnt")}`,
              value: driverAverage ? driverAverage.a.toFixed(1) + " ★" : "—",
              Icon: StarIcon,
            },
            {
              key: "store",
              label: `${t("aRAvgS")} · ${storeAverage?.n || 0} ${t("aRCnt")}`,
              value: storeAverage ? storeAverage.a.toFixed(1) + " ★" : "—",
              Icon: StarIcon,
            },
            {
              key: "need",
              label: t("aRNeeds"),
              value: needsCount,
              Icon: AlertIcon,
            },
            {
              key: "total",
              label: t("aRCnt"),
              value: source.length,
              Icon: BoxIcon,
            },
          ]}
        />
      )}
      <section className={panel}>
        <SearchField
          id={`search-${section}`}
          label={
            section === "customers"
              ? t("xCuSearch")
              : section === "restaurants"
                ? t("aSearch")
                : wt("search")
          }
          value={query}
          onChange={(query) => navigate({ query })}
          filterLabel={ft("filters")}
          filtersOpen={filtersOpen}
          onFilters={
            ["drivers", "restaurants", "ratings", "support"].includes(section)
              ? () => setFiltersOpen(true)
              : undefined
          }
        />
        <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
          <DialogContent className="max-h-[90dvh] overflow-y-auto">
            <DialogTitle>{ft("filters")}</DialogTitle>
            <div className="grid gap-3">
              {section === "drivers" && (
                <label>
                  {t("aStat")}
                  <Select
                    value={filter}
                    onValueChange={(value) => {
                      setFilter(value || "all");
                      sessionStorage.setItem(
                        "ux02-native:filter:" + section,
                        value || "all",
                      );
                    }}
                    items={["all", "on", "off"].map((k) => ({
                      value: k,
                      label:
                        t(k === "all" ? "fAllK" : k === "on" ? "fOn" : "fOff") +
                        " · " +
                        (k === "all"
                          ? source.length
                          : source.filter((r) =>
                              k === "on" ? isLive(r) : !isLive(r),
                            ).length),
                    }))}
                  >
                    <SelectTrigger aria-label={t("aStat")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["all", "on", "off"].map((k) => (
                        <SelectItem key={k} value={k}>
                          {t(
                            k === "all" ? "fAllK" : k === "on" ? "fOn" : "fOff",
                          )}{" "}
                          ·{" "}
                          {k === "all"
                            ? source.length
                            : source.filter((r) =>
                                k === "on" ? isLive(r) : !isLive(r),
                              ).length}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
              )}
              {section === "restaurants" && (
                <label className="block min-w-0 text-sm">
                  {t("aStat")}
                  <Select
                    value={filter}
                    onValueChange={(value) => {
                      setFilter(value ?? "");
                      sessionStorage.setItem(
                        "ux02-native:filter:" + section,
                        value ?? "",
                      );
                    }}
                    items={[
                      ...["all", "open", "closed"].map((k) => ({
                        value: k,
                        label: t(
                          k === "all"
                            ? "aAll"
                            : k === "open"
                              ? "aOpenS"
                              : "aClosedS",
                        ),
                      })),
                    ]}
                  >
                    <SelectTrigger aria-label={t("status")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["all", "open", "closed"].map((k) => (
                        <SelectItem key={k} value={k}>
                          {t(
                            k === "all"
                              ? "aAll"
                              : k === "open"
                                ? "aOpenS"
                                : "aClosedS",
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
              )}
              {section === "ratings" && (
                <label className="block min-w-0 text-sm">
                  {t("aStat")}
                  <Select
                    value={filter}
                    onValueChange={(value) => {
                      setFilter(value ?? "need");
                      sessionStorage.setItem(
                        "ux02-native:filter:" + section,
                        value ?? "need",
                      );
                    }}
                    items={[
                      {
                        value: "need",
                        label: `${t("aRNeeds")} · ${needsCount}`,
                      },
                      {
                        value: "all",
                        label: `${t("fAllK")} · ${source.length}`,
                      },
                      {
                        value: "done",
                        label: `${t("aRDone")} · ${handledCount}`,
                      },
                    ]}
                  >
                    <SelectTrigger aria-label={t("aStat")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="need">
                        {t("aRNeeds")} · {needsCount}
                      </SelectItem>
                      <SelectItem value="all">
                        {t("fAllK")} · {source.length}
                      </SelectItem>
                      <SelectItem value="done">
                        {t("aRDone")} · {handledCount}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </label>
              )}
              {section === "support" && (
                <label className="block min-w-0 text-sm">
                  {t("aStat")}
                  <Select
                    value={filter}
                    onValueChange={(value) => {
                      setFilter(value ?? "");
                      sessionStorage.setItem(
                        "ux02-native:filter:" + section,
                        value ?? "",
                      );
                    }}
                    items={[
                      ...[
                        "all",
                        "open",
                        "in_progress",
                        "resolved",
                        "rejected",
                      ].map((k) => ({
                        value: k,
                        label: t(k === "all" ? "aAll" : "xs_" + k),
                      })),
                    ]}
                  >
                    <SelectTrigger aria-label={t("status")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "all",
                        "open",
                        "in_progress",
                        "resolved",
                        "rejected",
                      ].map((k) => (
                        <SelectItem key={k} value={k}>
                          {t(k === "all" ? "aAll" : "xs_" + k)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setFiltersOpen(false)}>
                {ft("done")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
      {section === "restaurants" && (
        <>
          <Card title={t("xSrqT")}>
            {tables.store_requests
              .filter((r) => r.status === "pending")
              .map((r) => (
                <div key={text(r, "id")}>
                  <p>
                    {text(r, "name")} · {text(r, "phone")} ·{" "}
                    {text(r, "address")}
                  </p>
                  <NativeForm
                    title={t("xSrqDone")}
                    operation={(d) =>
                      mutations.decideStoreRequest(
                        r.id,
                        d.decision === "approved",
                        d.reason,
                      )
                    }
                    validate={(r) =>
                      r.decision === "rejected" &&
                      text(r, "reason").trim().length < 3
                        ? "err_note_required"
                        : null
                    }
                    fields={[
                      {
                        key: "decision",
                        label: "xDecision",
                        options: ["approved", "rejected"],
                      },
                      { key: "reason", label: "xRejectNote", maxLength: 300 },
                    ]}
                    t={t}
                  />
                </div>
              ))}
          </Card>
          <details>
            <summary>{t("aTarT")}</summary>
            <NativeForm
              title={t("aTarT")}
              operation={(d) =>
                stopOnError(
                  tariffFields.map(
                    (f) => () => mutations.setSetting(f.key, d[f.key]),
                  ),
                )
              }
              fields={tariffFields}
              initial={Object.fromEntries(
                tables.app_settings.map((r) => [text(r, "key"), r.value]),
              )}
              t={t}
            />
          </details>
        </>
      )}
      {section === "support" && (
        <NativeForm
          title={t("xSupSet")}
          operation={(d) =>
            stopOnError([
              () => mutations.setText("support_phone", d.phone),
              () => mutations.setText("support_hours", d.hours),
            ])
          }
          fields={[
            { key: "phone", label: "xSupPh", type: "tel" },
            { key: "hours", label: "xSupHrs" },
          ]}
          t={t}
        />
      )}
      {["restaurants", "banners", "promotions"].includes(section) && (
        <Button
          size="lg"
          variant="outline"
          onClick={() => navigate({ id: "new" })}
        >
          {t(
            section === "restaurants"
              ? "aAddS"
              : section === "banners"
                ? "aAddB"
                : "aAddP",
          )}
        </Button>
      )}
      <section className="min-w-0 xl:rounded-2xl xl:border xl:border-gray-200 xl:bg-white xl:p-6 dark:xl:border-gray-800 dark:xl:bg-white/3">
        <NativeGrid
          firstHeader={t(
            section === "ratings"
              ? "aOpenO"
              : section === "banners"
                ? "aBTitle"
                : section === "promotions"
                  ? "aPCode"
                  : section === "support"
                    ? "ticketSubject"
                    : "aName",
          )}
          headers={
            section === "support"
              ? [t("aStat"), t("aOpenO"), t("aClient"), wt("date")]
              : section === "banners"
                ? [t("aStat"), t("aBPl"), t("uLinkL"), t("aBOrd")]
                : section === "promotions"
                  ? [t("aStat"), t("aPVal"), t("aPMin"), t("aPMax")]
                  : section === "ratings"
                    ? [
                        t("aStat"),
                        t("ratingComment"),
                        t("aStoreL"),
                        t("aStoreRate2"),
                        t("aCourierRate"),
                      ]
                    : section === "drivers"
                      ? [t("aStat"), t("aPhoneL"), t("aSeenL"), t("aCashH")]
                      : section === "customers"
                        ? [t("aStat"), t("aPhoneL"), t("xCuReg")]
                        : [t("aStat"), t("aPhoneL"), t("address")]
          }
          onDetails={(id) => navigate({ id })}
          rows={rows.slice(0, limit).map((r) => {
            const status = entityStatus(section, r),
              cash = syntheticCash[text(r, "id")];
            const badge =
              section === "ratings" ? (
                <Badge
                  color={
                    r.handled_at
                      ? "success"
                      : needsRatingFollowup(r)
                        ? "warning"
                        : "gray"
                  }
                >
                  {t(ratingStatus(r))}
                </Badge>
              ) : (
                <Badge color={status.color}>{t(status.label)}</Badge>
              );
            const stamp = (key: string) => formatDate(text(r, key), locale);
            let values;
            if (section === "support")
              values = [
                badge,
                text(r, "order_id") || "—",
                text(
                  tables.profiles.find(
                    (p) => p.id === (r.customer_id || r.user_id),
                  ) || {},
                  "name",
                ) || "—",
                stamp("created_at"),
              ];
            else if (section === "banners")
              values = [
                badge,
                t(r.placement === "bottom" ? "aBBot" : "aBTop"),
                [text(r, "link_type"), text(r, "link_value")]
                  .filter(Boolean)
                  .join(" · ") || t("aBNone"),
                text(r, "sort") || "0",
              ];
            else if (section === "promotions")
              values = [
                badge,
                text(r, "value") + (r.kind === "percent" ? "%" : " TJS"),
                text(r, "min_order") || "—",
                text(r, "max_uses") || "—",
              ];
            else if (section === "ratings")
              values = [
                badge,
                text(r, "comment") || t("aNoCmt"),
                ratingStore(r),
                r.store_stars != null ? text(r, "store_stars") + " ★" : "—",
                r.driver_stars != null ? text(r, "driver_stars") + " ★" : "—",
              ];
            else if (section === "drivers")
              values = [
                <>
                  {badge}{" "}
                  {isLive(r) && isBusy(r) && (
                    <Badge color="warning">{t("aBusy")}</Badge>
                  )}
                  {!!r.accept_blocked && (
                    <Badge color="error">{t("aBlocked")}</Badge>
                  )}
                </>,
                text(r, "phone") || t("aDrvNoPh"),
                <>
                  {stamp("last_seen")}
                  {isLive(r) && (
                    <p>
                      {locationFresh(r) ? stamp("loc_updated") : t("aNoLoc")}
                    </p>
                  )}
                </>,
                <>
                  {(cash ?? "—") +
                    " / " +
                    (number(r, "cash_limit") || 1000) +
                    " TJS"}
                  {cashExceeded(r, cash) && (
                    <Badge color="warning">{t("aOver")}</Badge>
                  )}
                </>,
              ];
            else if (section === "customers")
              values = [
                badge,
                text(r, "phone") || "—",
                formatDate(text(r, "created_at"), locale),
              ];
            else
              values = [
                <>
                  {badge}{" "}
                  <Badge color={r.is_open ? "success" : "gray"}>
                    {t(r.is_open ? "aOpenN" : "aClosedN")}
                  </Badge>
                </>,
                text(r, "phone") || "—",
                text(r, "address") || "—",
              ];
            return {
              id: text(r, "id"),
              name:
                text(r, "name") ||
                text(r, "title") ||
                text(r, "code") ||
                text(r, "subject") ||
                text(r, "order_id") ||
                text(r, "id"),
              values,
              identity: ["drivers", "customers"].includes(section)
                ? ("person" as const)
                : ["restaurants", "banners"].includes(section)
                  ? ("merchant" as const)
                  : undefined,
              image:
                text(
                  r,
                  section === "restaurants"
                    ? "logo_url"
                    : section === "banners"
                      ? "image_url"
                      : "avatar_url",
                ) || undefined,
              presence: section === "drivers" ? isLive(r) : undefined,
              presenceLabel:
                section === "drivers"
                  ? t(isLive(r) ? "aOnlineL" : "aOfflineL")
                  : undefined,
              updated: section === "ratings" ? stamp("created_at") : undefined,
            };
          })}
        />
      </section>
      {rows.length > limit && (
        <Button
          size="lg"
          variant="outline"
          onClick={() => setLimit(limit + 30)}
        >
          {t("xMore")}
        </Button>
      )}
    </div>
  );
}

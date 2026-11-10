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
import { Card, Pair, input, Action } from "./primitives";
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
  navigate: (patch: { section?: string; id?: string; query?: string }) => void;
};
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
}: Props) {
  const [filter, setFilter] = useState(
      () => sessionStorage.getItem("ux02-native:filter:" + section) || "all",
    ),
    [limit, setLimit] = useState(30),
    [historyLimit, setHistoryLimit] = useState(
      () => Number(sessionStorage.getItem("ux02-native:history:" + id)) || 50,
    ),
    [notice, setNotice] = useState("");
  const source = (tables[tableNames[section]] || []).filter((r) =>
    section === "drivers"
      ? r.role === "driver"
      : section === "customers"
        ? r.role === "customer"
        : true,
  );
  const rows = source.filter(
    (r) =>
      Object.values(r)
        .filter((v) => typeof v === "string")
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (filter === "all" ||
        text(r, "status") === filter ||
        (filter === "open"
          ? !!r.is_open
          : filter === "closed"
            ? !r.is_open
            : true)),
  );
  const row = source.find((r) => String(r.id) === id);
  const write = () => setNotice(t("nativeWriteBlocked"));
  const back = (
    <Button variant="outline" onClick={() => navigate({ id: "" })}>
      ← {t("aBack")}
    </Button>
  );
  const linkOrder = (r: Row) => (
    <Button
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
  const blocked = (
    <p role="status" className="text-sm text-gray-500">
      {t("nativeWriteBlocked")}
    </p>
  );
  if (section === "texts")
    return (
      <div className="space-y-4">
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
            variant="outline"
            aria-pressed={filter !== "errors"}
            onClick={() => setFilter("all")}
          >
            {t("aLogA")}
          </Button>
          <Button
            variant="outline"
            aria-pressed={filter === "errors"}
            onClick={() => setFilter("errors")}
          >
            {t("aLogE")}
          </Button>
        </div>
        <p>{t("aNoRes")}</p>
        {blocked}
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
            <a
              href={`https://www.google.com/maps?q=${row.lat},${row.lng}`}
              target="_blank"
              rel="noreferrer"
            >
              {t("aMapOpen")}
            </a>
            <Button variant="outline" onClick={write}>
              {t("aLocSet")}
            </Button>
            <Button variant="outline" onClick={write}>
              {t("aLocClr")}
            </Button>
            <Button variant="outline" onClick={write}>
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
          <Card title={text(row, "name")}>
            <p>
              {text(row, "driver_status")} · {row.online ? t("aOn") : t("aOff")}
            </p>
            <a href={"tel:" + text(row, "phone")}>{text(row, "phone")}</a>
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
            <p>{text(row, "last_seen") || "—"}</p>
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
              <Button variant="outline" disabled title={t("nativeCashMissing")}>
                {t("aSettle")}
              </Button>
            )}
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
          <Card title={text(row, "name")}>
            <a href={"tel:" + text(row, "phone")}>{text(row, "phone")}</a>
            <p>{text(row, "email")}</p>
            <Pair label={t("xCuReg")}>{text(row, "created_at")}</Pair>
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
                  {number(w, "amount")} TJS · {text(w, "created_at")}
                </Pair>
              ))}
          </Card>
          <NativeForm
            title={t("xWalAdj")}
            operation={(r) => mutations.walletAdjust(row.id, r.amount, r.note)}
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
            fields={[{ key: "phone", label: "xPhNew", type: "tel" }, ...reason]}
            t={t}
          />
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
            <Pair label={t("aStoreL")}>{number(row, "store_stars")} ★</Pair>
            <Pair label={t("aDrvL")}>{number(row, "driver_stars")} ★</Pair>
            <p>{text(row, "comment")}</p>
            <p>{text(row, "handled_note")}</p>
            {linkOrder(row)}
          </Card>
          {row.handled_at ? (
            <MutationAction
              label={t("aReopen")}
              t={t}
              operation={() => mutations.reopenRating(row.order_id)}
            />
          ) : null}
          <NativeForm
            title={t("aResolveT")}
            operation={(r) => mutations.resolveRating(row.order_id, r.note)}
            fields={[{ key: "note", label: "aResNote", maxLength: 300 }]}
            t={t}
          />
        </div>
      );
  }
  return (
    <div className="space-y-4">
      <Card>
        <label>
          {t(section === "customers" ? "xCuSearch" : "aSearch")}
          <input
            type="search"
            className={input}
            value={query}
            onChange={(e) => navigate({ query: e.target.value })}
          />
        </label>
        {section === "restaurants" && (
          <select
            className={input}
            aria-label={t("status")}
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              sessionStorage.setItem(
                "ux02-native:filter:" + section,
                e.target.value,
              );
            }}
          >
            {["all", "open", "closed"].map((k) => (
              <option key={k} value={k}>
                {t(k === "all" ? "aAll" : k === "open" ? "aOpenS" : "aClosedS")}
              </option>
            ))}
          </select>
        )}
        {section === "support" && (
          <select
            className={input}
            aria-label={t("status")}
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              sessionStorage.setItem(
                "ux02-native:filter:" + section,
                e.target.value,
              );
            }}
          >
            {["all", "open", "in_progress", "resolved", "rejected"].map((k) => (
              <option key={k} value={k}>
                {t(k === "all" ? "aAll" : "xs_" + k)}
              </option>
            ))}
          </select>
        )}
      </Card>
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
        <Button variant="outline" onClick={() => navigate({ id: "new" })}>
          {t(
            section === "restaurants"
              ? "aAddS"
              : section === "banners"
                ? "aAddB"
                : "aAddP",
          )}
        </Button>
      )}
      {rows.slice(0, limit).map((r) => (
        <Card key={text(r, "id")}>
          <div className="flex flex-wrap justify-between gap-3">
            <strong className="min-w-0 break-words">
              {text(r, "name") ||
                text(r, "title") ||
                text(r, "code") ||
                text(r, "subject") ||
                text(r, "order_id") ||
                text(r, "id")}
            </strong>
            <span>
              {section === "customers"
                ? r.banned_at
                  ? t("xBanned")
                  : ""
                : text(r, "status")
                  ? t(
                      section === "support"
                        ? "xs_" + text(r, "status")
                        : text(r, "status"),
                    )
                  : text(r, "driver_status")
                    ? t(text(r, "driver_status"))
                    : r.is_active != null
                      ? t(r.is_active ? "aOn" : "aOff")
                      : ""}
            </span>
          </div>
          {!!r.accept_blocked && (
            <p className="text-error-500">{t("aBlocked")}</p>
          )}
          {section === "drivers" && (
            <Pair label={t("aCashH")}>
              {syntheticCash[text(r, "id")] ?? "—"} /{" "}
              {number(r, "cash_limit") || 1000} TJS
            </Pair>
          )}
          <p>{text(r, "phone") || text(r, "comment")}</p>
          <p>{text(r, "address")}</p>
          <Action
            kind="details"
            label={t("nativeDetails")}
            onClick={() => navigate({ id: text(r, "id") })}
          />
        </Card>
      ))}
      {!rows.length && (
        <Card>
          <p>{t("aNoRes")}</p>
        </Card>
      )}
      {rows.length > limit && (
        <Button variant="outline" onClick={() => setLimit(limit + 30)}>
          {t("xMore")}
        </Button>
      )}
    </div>
  );
}

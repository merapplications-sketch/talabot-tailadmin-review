"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import SummaryCards from "./b-shell/summary-cards";
import { OrdersPresentation } from "./b-shell/list-patterns";
import { BoxIcon, DollarIcon, PieChartIcon, MovingBoxIcon } from "@/icons";

import { Button } from "@/components/ui/button";
import AdminLayout from "./b-shell/admin-layout";
import { NativeRouteContext } from "./b-shell/router";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useNativeNavigation } from "./navigation";
import ThemeToggleButton from "@/layout/header/theme-toggler";
import {
  metrics,
  readOrders,
  findOrder,
  text,
  statuses,
  tables,
  secondaryFilter,
  type Row,
} from "./domain";
import dictionary from "./dictionary.json";

import { Card, Action } from "./primitives";
import OperationalAlerts from "./operational-alerts";
import OrderDetails from "./order-details";
import EntitySections from "./entity-sections";
import AnalyticsDashboard from "../analytics";

const extra = {
  en: {
    nativeAssignAlready:
      "Assign courier is unavailable: this order already has a courier.",
    nativeAssignStatus:
      "Assign courier is available only for an unassigned order in Preparing or Ready for courier pickup.",
    nativeNext:
      "Next: review the recorded parties, items, timeline and payment information.",
    nativeWriteBlocked:
      "Isolated review. Financial and administrative writes are not connected.",
    nativeProofMissing: "The proof image is unavailable in the sample.",
    nativeNotice: "Synthetic data · native React migration in progress",
    nativePending:
      "This section is not migrated yet. The preserved source remains a separate reference.",
    nativeScope:
      "Latest loaded orders (maximum 300), all statuses. Revenue and commission count delivered orders in that scope only.",
    nativeSource: "B analytics use a separate synthetic dataset.",
    nativeTest: "Read scenario",
    normal: "Normal",
    empty: "Empty",
    error: "Read failure",
    denied: "Access denied",
    status: "Status",
    address: "Address",
    nativeRetry: "Retry",
    nativeDetails: "Details",
    nativeCashMissing:
      "Balance is not supplied for this account in the sample.",
    nativeRefundMissing:
      "Refund allowance is not supplied in the sample. No amount is assumed.",
  },
  ru: {
    nativeAssignAlready:
      "Назначение недоступно: курьер уже назначен этому заказу.",
    nativeAssignStatus:
      "Назначение доступно только без курьера в статусе приготовления или готовности к выдаче.",
    nativeNext:
      "Далее: проверьте участников, состав, историю и сведения об оплате.",
    nativeWriteBlocked:
      "Изолированное превью. Финансовая и административная запись не подключена.",
    nativeProofMissing: "Фото подтверждения отсутствует в выборке.",
    nativeNotice: "Тестовые данные · перенос в React не завершён",
    nativePending: "Раздел ещё не перенесён. Исходник сохранён отдельно.",
    nativeScope:
      "Последние загруженные заказы (не более 300), все статусы. Выручка и комиссия только доставленных заказов этой выборки.",
    nativeSource: "Аналитика B использует отдельную тестовую выборку.",
    nativeTest: "Сценарий чтения",
    normal: "Обычный",
    empty: "Нет данных",
    error: "Ошибка чтения",
    denied: "Нет доступа",
    status: "Статус",
    address: "Адрес",
    nativeRetry: "Повторить",
    nativeDetails: "Подробнее",
    nativeCashMissing: "Баланс этого счёта отсутствует в выборке.",
    nativeRefundMissing:
      "Допустимая сумма возврата отсутствует в выборке. Значение не предполагается.",
  },
};
export default function NativeAdmin() {
  const locale = useLocale(),
    lang = locale === "en" ? "en" : "ru",
    dict = dictionary[lang] as Record<string, string>,
    copy = extra[lang] as Record<string, string>;
  const bT = useTranslations("talabot");
  const t = (key: string) => copy[key] || dict[key] || key;
  const { state, navigate, back } = useNativeNavigation();
  const [result, setResult] = useState<{
      key: string;
      rows: Row[];
      error: string;
    }>({ key: "", rows: [], error: "" }),
    [mode, setMode] = useState("normal"),
    [retry, setRetry] = useState(0),
    [limit, setLimit] = useState(
      () => Number(sessionStorage.getItem("ux02-native:limit")) || 50,
    ),
    [filters, setFilters] = useState<{
      store: string;
      payment: string;
      start: string;
      end: string;
      sort: string;
    }>(() => {
      try {
        return (
          JSON.parse(
            sessionStorage.getItem("ux02-native:filters") || "null",
          ) || { store: "", payment: "", start: "", end: "", sort: "" }
        );
      } catch {
        return { store: "", payment: "", start: "", end: "", sort: "" };
      }
    });
  const queryRef = useRef<HTMLInputElement>(null);
  const requestKey = JSON.stringify([state.query, state.status, mode, retry]);
  useEffect(() => {
    let active = true;
    readOrders(state.query, state.status, mode).then((value) => {
      if (active)
        setResult({
          key: requestKey,
          rows: value.data || [],
          error: value.error || "",
        });
    });
    return () => {
      active = false;
    };
  }, [state.query, state.status, mode, requestKey]);
  const loading = result.key !== requestKey,
    rows = loading ? [] : result.rows,
    error = loading ? "" : result.error;
  useEffect(() => {
    sessionStorage.setItem("ux02-native:filters", JSON.stringify(filters));
    sessionStorage.setItem("ux02-native:limit", String(limit));
  }, [filters, limit]);
  const m = metrics(),
    order = findOrder(state.id),
    filtered = secondaryFilter(rows, filters),
    visible = filtered.rows.slice(0, limit);
  return (
    <NativeRouteContext.Provider
      value={{
        section: state.section,
        go: (section) =>
          navigate({ section, id: "", query: "", status: "all" }),
      }}
    >
      <AdminLayout
        header={{
          query: state.query,
          onSearch: (query) =>
            navigate({ section: "orders", id: "", query }, true),
          notifications: (
            <Action
              kind="chat"
              label={t("tH")}
              onClick={() =>
                navigate({ section: "support", id: "", query: "" })
              }
            />
          ),
          controls: <ThemeToggleButton />,
        }}
      >
        <section className="min-w-0 space-y-4">
          <p className="text-sm text-gray-500">
            {t("nativeNotice")}
            {locale === "tg" ? " · Тарҷумаи амалиёт нопурра: RU" : ""}
          </p>
          {state.section === "orders" ? (
            state.id ? (
              order ? (
                <OrderDetails order={order} t={t} back={back} />
              ) : (
                <Card>
                  <p role="alert">
                    {t("uOrdMissing").replace("{n}", state.id)}
                  </p>
                  <Button variant="outline" onClick={back}>
                    {t("aBack")}
                  </Button>
                </Card>
              )
            ) : (
              <>
                <SummaryCards
                  cards={[
                    {
                      key: "orders",
                      label: t("aKOrd"),
                      value: m.orders,
                      Icon: BoxIcon,
                    },
                    {
                      key: "revenue",
                      label: t("aKRev"),
                      value: m.revenue.toFixed(2) + " TJS",
                      Icon: DollarIcon,
                    },
                    {
                      key: "commission",
                      label: t("aKCom"),
                      value: m.commission.toFixed(2) + " TJS",
                      Icon: PieChartIcon,
                    },
                    {
                      key: "active",
                      label: t("aKAct"),
                      value: m.active,
                      Icon: MovingBoxIcon,
                    },
                  ]}
                />
                <p className="text-sm text-gray-500">{t("nativeScope")}</p>
                <OperationalAlerts t={t} navigate={navigate} />
                <Card title={t("tO")}>
                  <label className="block">
                    {t("uOq")}
                    <Input
                      ref={queryRef}
                      type="search"
                      value={state.query}
                      onChange={(e) =>
                        navigate({ query: e.target.value }, true)
                      }
                    />
                  </label>
                  <div className="tp-quick">
                    {["all", "pending", "preparing", "delivered"].map((s) => (
                      <Button
                        key={s}
                        variant={s === state.status ? "default" : "outline"}
                        aria-pressed={s === state.status}
                        onClick={() => navigate({ status: s }, true)}
                      >
                        {t(s === "all" ? "aAll" : s)}
                      </Button>
                    ))}
                  </div>
                  <label className="block min-w-0 text-sm">
                    {t("status")}
                    <Select
                      value={state.status}
                      onValueChange={(value) =>
                        navigate({ status: value || "all" }, true)
                      }
                      items={["all", ...statuses].map((value) => ({
                        value,
                        label: t(value === "all" ? "aAll" : value),
                      }))}
                    >
                      <SelectTrigger aria-label={t("status")}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["all", ...statuses].map((value) => (
                          <SelectItem key={value} value={value}>
                            {t(value === "all" ? "aAll" : value)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </label>
                  <details className="mb-3">
                    <summary>{t("nativeTest")}</summary>
                    <Select
                      value={mode}
                      onValueChange={(value) => setMode(value ?? "")}
                      items={[
                        ...["normal", "empty", "error", "denied"].map((v) => ({
                          value: v,
                          label: t(v),
                        })),
                      ]}
                    >
                      <SelectTrigger aria-label={t("nativeTest")}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["normal", "empty", "error", "denied"].map((v) => (
                          <SelectItem key={v} value={v}>
                            {t(v)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </details>
                  <details className="tp-secondary-filters mt-3">
                    <summary>
                      {lang === "en"
                        ? "Additional sample filters"
                        : "Дополнительные фильтры выборки"}
                    </summary>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label>
                        {t("aStoreL")}
                        <Select
                          value={filters.store}
                          onValueChange={(value) =>
                            setFilters({ ...filters, store: value ?? "" })
                          }
                          items={[
                            { value: "", label: t("aAll") },
                            ...tables.stores.map((r) => ({
                              value: text(r, "id"),
                              label: text(r, "name"),
                            })),
                          ]}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">{t("aAll")}</SelectItem>
                            {tables.stores.map((r) => (
                              <SelectItem
                                key={text(r, "id")}
                                value={text(r, "id")}
                              >
                                {text(r, "name")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </label>
                      <label>
                        {t("uFinM")}
                        <Select
                          value={filters.payment}
                          onValueChange={(value) =>
                            setFilters({ ...filters, payment: value ?? "" })
                          }
                          items={[
                            { value: "", label: t("aAll") },
                            ...["cash", "wallet", "apple"].map((k) => ({
                              value: k,
                              label: t(k),
                            })),
                          ]}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">{t("aAll")}</SelectItem>
                            {["cash", "wallet", "apple"].map((k) => (
                              <SelectItem key={k} value={k}>
                                {t(k)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </label>
                      {(["start", "end"] as const).map((k) => (
                        <label key={k}>
                          {k === "start" ? t("aBFrom") : t("aBTo")}
                          <Input
                            type="date"
                            value={filters[k]}
                            onChange={(e) =>
                              setFilters({ ...filters, [k]: e.target.value })
                            }
                          />
                        </label>
                      ))}
                      <label>
                        {lang === "en" ? "Sort" : "Порядок"}
                        <Select
                          value={filters.sort}
                          onValueChange={(value) =>
                            setFilters({ ...filters, sort: value ?? "" })
                          }
                          items={[
                            { value: "", label: "—" },
                            { value: "newest", label: "↓" },
                            { value: "oldest", label: "↑" },
                          ]}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">—</SelectItem>
                            <SelectItem value="newest">↓</SelectItem>
                            <SelectItem value="oldest">↑</SelectItem>
                          </SelectContent>
                        </Select>
                      </label>
                    </div>
                    <p className="text-sm">
                      {lang === "en"
                        ? "Local sample only. Zone data is unavailable in A."
                        : "Только локальная выборка. Данные зон отсутствуют в A."}
                    </p>
                    {filtered.error && (
                      <p role="alert">
                        {lang === "en"
                          ? "Start must not exceed end."
                          : "Начало не может быть позже конца."}
                      </p>
                    )}
                  </details>
                  {loading ? (
                    <p role="status">{t("uOqBusy")}</p>
                  ) : error ? (
                    <div role="alert">
                      <p>
                        {error === "not_allowed"
                          ? t("uOqDeny")
                          : lang === "en"
                            ? "Could not load orders. Your filters are preserved."
                            : "Не удалось загрузить заказы. Фильтры сохранены."}
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setRetry(retry + 1)}
                      >
                        {t("nativeRetry")}
                      </Button>
                    </div>
                  ) : visible.length ? (
                    <OrdersPresentation
                      rows={visible}
                      t={t}
                      onDetails={(id) => {
                        navigate({ id });
                        window.scrollTo(0, 0);
                      }}
                    />
                  ) : (
                    <p>{t("aNo")}</p>
                  )}
                  {filtered.rows.length > limit && (
                    <Button
                      variant="outline"
                      onClick={() => setLimit(limit + 50)}
                    >
                      {t("aMore")}
                    </Button>
                  )}
                </Card>
                <section
                  id="native-analytics"
                  className="grid grid-cols-12 gap-4 md:gap-6"
                >
                  <div className="col-span-12">
                    <h2 className="text-lg font-semibold">
                      {t("nativeSource")}
                    </h2>
                  </div>
                  <AnalyticsDashboard />
                  <div className="col-span-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[
                      ["activeOrders", "24"],
                      ["availableDrivers", "12"],
                      ["openRestaurants", "18"],
                      ["customers", "3,782"],
                    ].map(([label, value]) => (
                      <Card key={label}>
                        <p>{bT(label)}</p>
                        <strong>{value}</strong>
                      </Card>
                    ))}
                  </div>
                </section>
              </>
            )
          ) : (
            <EntitySections
              key={state.section + ":" + state.id}
              section={state.section}
              id={state.id}
              query={state.query}
              t={t}
              navigate={navigate}
            />
          )}
        </section>
      </AdminLayout>
    </NativeRouteContext.Provider>
  );
}

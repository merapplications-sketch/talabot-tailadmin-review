"use client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import SummaryCards from "./b-shell/summary-cards";
import { OrdersPresentation } from "./b-shell/list-patterns";
import {
  BoxIcon,
  DollarIcon,
  PieChartIcon,
  MovingBoxIcon,
  TruckDeliveryIcon,
  CartIcon,
  UsersIcon,
} from "@/icons";

import { Button } from "@/components/ui/button";
import AdminLayout from "./b-shell/admin-layout";
import { NativeRouteContext } from "./b-shell/router";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useNativeNavigation } from "./navigation";
import ThemeToggleButton from "@/layout/header/theme-toggler";
import {
  metrics,
  readOrders,
  findOrder,
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
  const qaTools = new URLSearchParams(location.search).get("qa") === "1";
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
                <OrdersPresentation
                  rows={visible}
                  t={t}
                  query={state.query}
                  onSearch={(query) => navigate({ query }, true)}
                  status={state.status}
                  onStatus={(status) => navigate({ status }, true)}
                  filters={filters}
                  onFilters={setFilters}
                  filterError={filtered.error}
                  resultCount={filtered.rows.length}
                  loading={loading}
                  error={error}
                  onRetry={() => setRetry(retry + 1)}
                  hasMore={filtered.rows.length > limit}
                  onMore={() => setLimit(limit + 50)}
                  onReset={() => {
                    navigate({ query: "", status: "all" }, true);
                    setFilters({
                      store: "",
                      payment: "",
                      start: "",
                      end: "",
                      sort: "",
                    });
                  }}
                  onDetails={(id) => {
                    navigate({ id });
                    window.scrollTo(0, 0);
                  }}
                />
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
                  <div className="col-span-12" data-testid="b-summary-scope">
                    <SummaryCards
                      cards={[
                        {
                          key: "orders",
                          label: bT("activeOrders"),
                          value: "24",
                          Icon: BoxIcon,
                        },
                        {
                          key: "drivers",
                          label: bT("availableDrivers"),
                          value: "12",
                          Icon: TruckDeliveryIcon,
                        },
                        {
                          key: "restaurants",
                          label: bT("openRestaurants"),
                          value: "18",
                          Icon: CartIcon,
                        },
                        {
                          key: "customers",
                          label: bT("customers"),
                          value: "3,782",
                          Icon: UsersIcon,
                        },
                      ]}
                    />
                  </div>
                </section>
                {qaTools && (
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
                )}
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

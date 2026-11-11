"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  BoxIcon,
  DollarIcon,
  PieChartIcon,
  MovingBoxIcon,
  TruckDeliveryIcon,
  CartIcon,
  ChatIcon,
  StarIcon,
  BarChartIcon,
} from "@/icons";
import SummaryCards from "../b-shell/summary-cards";
import { metrics } from "../domain";
import { operationalAlerts } from "../order-operations";
import OperationalAlerts from "../operational-alerts";
import { Shell } from "../../workspace";
import AnalyticsDashboard, {
  Card,
  Note,
  DataTable,
  AnalyticsPeriod,
} from "../../analytics";
import {
  homeRankings,
  snapshot,
  firstDay,
  periodRange,
  validHomeRange,
} from "./data";
interface Props {
  t: (key: string) => string;
  navigate: (patch: { section?: string; id?: string; query?: string }) => void;
  href: (url: string) => void;
}
export default function HomeDashboard({ t, navigate, href }: Props) {
  const h = useTranslations("nativeHome"),
    ownerT = useTranslations("ownerRound"),
    locale = useLocale();
  const [period, setPeriod] = useState("month"),
    [range, setRange] = useState(() => periodRange("month"));
  const [draft, setDraft] = useState(range),
    [error, setError] = useState(false);
  const rank = homeRankings(range.start, range.end),
    m = metrics(),
    attention = operationalAlerts().unassigned;
  const fmt = (value: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);
  const choosePeriod = (value: string) => {
    setPeriod(value);
    setError(false);
    if (value !== "custom") {
      const next = periodRange(value);
      setRange(next);
      setDraft(next);
    }
  };
  return (
    <Shell title={h("title")}>
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

      <nav
        aria-label={ownerT("shortcuts")}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
        data-testid="home-shortcuts"
      >
        {[
          { section: "orders", label: t("tO"), Icon: BoxIcon },
          { section: "drivers", label: t("tD"), Icon: TruckDeliveryIcon },
          { section: "restaurants", label: t("tS"), Icon: CartIcon },
          { section: "support", label: t("tH"), Icon: ChatIcon },
          { section: "ratings", label: t("tR"), Icon: StarIcon },
          { section: "reports", label: h("reports"), Icon: BarChartIcon },
        ].map(({ section, label, Icon }) => (
          <Button
            key={section}
            size="lg"
            variant="outline"
            className="h-auto min-h-14 justify-start gap-3 text-start whitespace-normal"
            onClick={() => href("/" + section)}
          >
            <Icon className="shrink-0 text-brand-500" />
            {label}
          </Button>
        ))}
      </nav>
      <Card title={h("attention")} id="home-attention">
        <p className="text-lg font-semibold">
          {h("attentionCount", { count: attention.length })}
        </p>
        <Note>{h("attentionRule")}</Note>
        {!attention.length && <Note>{h("attentionEmpty")}</Note>}
        <OperationalAlerts t={t} navigate={navigate} compact />
      </Card>
      <AnalyticsDashboard overview />
      <Card title={h("rankings")} id="home-ranking-period">
        <Note>{h("source")}</Note>
        <Note>
          {h("snapshot")}: {snapshot} · {h("scope")}
        </Note>
        <AnalyticsPeriod
          period={period}
          choosePeriod={choosePeriod}
          range={range}
          draft={draft}
          setRange={setRange}
          setDraft={setDraft}
          error={error}
          setError={setError}
          min={firstDay}
          max={snapshot}
          validate={validHomeRange}
          rangeError={h("rangeError", { start: firstDay, end: snapshot })}
        />
        <Note>
          {h("sampleCount", { loaded: rank.loaded, completed: rank.completed })}
        </Note>
      </Card>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <Card title={h("restaurants")} id="home-restaurants">
            <DataTable
              headers={[h("name"), h("completed"), h("sales")]}
              rows={rank.restaurants.slice(0, 5).map((row) => [
                <Button
                  key={row.id}
                  size="lg"
                  variant="ghost"
                  title={row.name}
                  onClick={() =>
                    navigate({ section: "restaurants", id: row.id })
                  }
                >
                  <span className="block max-w-xs truncate">{row.name}</span>
                </Button>,
                fmt(row.completed),
                row.sales === null ? "—" : fmt(row.sales),
              ])}
            />
            {!rank.restaurants.length && <Note>{h("empty")}</Note>}
            <Note>{h("salesMethod")}</Note>
          </Card>
        </div>
        <div className="col-span-12">
          <Card title={h("items")} id="home-items">
            <DataTable
              headers={[h("item"), h("quantity")]}
              rows={rank.items.slice(0, 5).map((row) => [
                <Button
                  key={row.storeId + row.id}
                  size="lg"
                  variant="ghost"
                  title={row.name + " · " + row.storeName}
                  onClick={() =>
                    navigate({ section: "restaurants", id: row.storeId })
                  }
                >
                  <span className="block max-w-xs truncate">
                    {row.name} · {row.storeName}
                  </span>
                </Button>,
                fmt(row.quantity),
              ])}
            />
            {!rank.items.length && <Note>{h("empty")}</Note>}
            <Note>{h("itemMethod")}</Note>
            {rank.omittedItems > 0 && (
              <Note>{h("omitted", { count: rank.omittedItems })}</Note>
            )}
          </Card>
        </div>
      </div>
    </Shell>
  );
}

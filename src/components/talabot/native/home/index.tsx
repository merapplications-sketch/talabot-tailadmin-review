"use client";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { BoxIcon, DollarIcon, PieChartIcon, MovingBoxIcon } from "@/icons";
import SummaryCards from "../b-shell/summary-cards";
import { metrics } from "../domain";
import { operationalAlerts } from "../order-operations";
import OperationalAlerts from "../operational-alerts";
import { Shell } from "../../workspace";
import AnalyticsDashboard, {
  Card,
  Note,
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
  const notes = (children: React.ReactNode) => (
    <Accordion>
      <AccordionItem value="scope">
        <AccordionTrigger className="py-2">{ownerT("notes")}</AccordionTrigger>
        <AccordionContent keepMounted>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
  return (
    <Shell showNotice={false} title={h("title")}>
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
      {notes(<Note>{t("nativeScope")}</Note>)}

      <Card title={h("attention")} id="home-attention">
        <p className="text-lg font-semibold">
          {h("attentionCount", { count: attention.length })}
        </p>
        {notes(<Note>{h("attentionRule")}</Note>)}

        <OperationalAlerts t={t} navigate={navigate} compact />
      </Card>
      <AnalyticsDashboard overview />
      <Card title={h("rankings")} id="home-ranking-period">
        <p className="text-sm text-gray-500">{ownerT("demo")}</p>
        {notes(
          <>
            <Note>{h("source")}</Note>
            <Note>
              {h("snapshot")}: {snapshot} · {h("scope")}
            </Note>
          </>,
        )}
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
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {rank.restaurants.slice(0, 5).map((row) => (
                <li key={row.id} className="py-2">
                  <Button
                    variant="ghost"
                    className="h-auto min-h-11 w-full justify-start px-0 text-start whitespace-normal"
                    onClick={() =>
                      navigate({ section: "restaurants", id: row.id })
                    }
                  >
                    {row.name}
                  </Button>
                  <dl className="mt-1 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-gray-500">{h("completed")}</dt>
                      <dd className="font-semibold">{fmt(row.completed)}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">{h("sales")}</dt>
                      <dd className="font-semibold">
                        {row.sales === null ? "—" : fmt(row.sales)}
                      </dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
            {!rank.restaurants.length && <Note>{h("empty")}</Note>}
            {notes(<Note>{h("salesMethod")}</Note>)}
          </Card>
        </div>
        <div className="col-span-12">
          <Card title={h("items")} id="home-items">
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {rank.items.slice(0, 5).map((row) => (
                <li key={row.storeId + row.id} className="py-2">
                  <Button
                    variant="ghost"
                    className="h-auto min-h-11 w-full justify-start px-0 text-start whitespace-normal"
                    onClick={() =>
                      navigate({ section: "restaurants", id: row.storeId })
                    }
                  >
                    {row.name}
                  </Button>
                  <p className="text-sm text-gray-500">{row.storeName}</p>
                  <p className="mt-1 text-sm">
                    {h("quantity")}: <strong>{fmt(row.quantity)}</strong>
                  </p>
                </li>
              ))}
            </ul>
            {!rank.items.length && <Note>{h("empty")}</Note>}
            {notes(<Note>{h("itemMethod")}</Note>)}
            {rank.omittedItems > 0 && (
              <Note>{h("omitted", { count: rank.omittedItems })}</Note>
            )}
          </Card>
        </div>
      </div>
    </Shell>
  );
}

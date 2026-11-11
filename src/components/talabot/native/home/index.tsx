import SearchField from "../b-shell/search-field";
import MerchantPicker from "../b-shell/merchant-picker";
import { merchantCategories } from "../directory-filters";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { tables } from "../domain";
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
  backAction?: React.ReactNode;
}
export default function HomeDashboard({
  t,
  navigate,
  href,
  backAction,
}: Props) {
  const h = useTranslations("nativeHome"),
    ownerT = useTranslations("ownerRound"),
    locale = useLocale();
  const [period, setPeriod] = useState("month"),
    [range, setRange] = useState(() => periodRange("month"));
  const [draft, setDraft] = useState(range),
    [error, setError] = useState(false);
  const [scope, setScopeState] = useState(() => {
    try {
      return (
        JSON.parse(
          sessionStorage.getItem("ux02-native:ranking-scope") || "null",
        ) || { category: "rest", merchant: "", query: "" }
      );
    } catch {
      return { category: "rest", merchant: "", query: "" };
    }
  });
  const setScope = (next: {
    category: string;
    merchant: string;
    query: string;
  }) => {
    setScopeState(next);
    sessionStorage.setItem("ux02-native:ranking-scope", JSON.stringify(next));
  };
  const [filtersOpen, setFiltersOpen] = useState(false);
  const rank = homeRankings(range.start, range.end, tables, scope),
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
    <Shell backAction={backAction} showNotice={false} title={h("title")}>
      <SummaryCards
        cards={[
          {
            key: "orders",
            onClick: () => navigate({ section: "orders", id: "" }),
            label: t("aKOrd"),
            value: m.orders,
            Icon: BoxIcon,
          },
          {
            key: "revenue",
            onClick: () => navigate({ section: "reports", id: "" }),
            label: t("aKRev"),
            value: m.revenue.toFixed(2) + " TJS",
            Icon: DollarIcon,
          },
          {
            key: "commission",
            onClick: () => navigate({ section: "reports", id: "" }),
            label: t("aKCom"),
            value: m.commission.toFixed(2) + " TJS",
            Icon: PieChartIcon,
          },
          {
            key: "active",
            onClick: () => navigate({ section: "orders", id: "" }),
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
        <SearchField
          id="ranking-search"
          label={ownerT("searchMerchants")}
          value={scope.query}
          onChange={(query) => setScope({ ...scope, query })}
          filterLabel={ownerT("filters")}
          filtersOpen={filtersOpen}
          onFilters={() => setFiltersOpen(true)}
        />
        <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
          <DialogContent>
            <DialogTitle>{ownerT("filters")}</DialogTitle>
            <div className="text-sm">
              {t("aCat")}
              <Select
                value={scope.category}
                onValueChange={(category) =>
                  setScope({
                    ...scope,
                    category: category || "all",
                    merchant: "",
                  })
                }
                items={[
                  { value: "all", label: t("aAll") },
                  ...merchantCategories.map((value) => ({
                    value,
                    label: t(value),
                  })),
                ]}
              >
                <SelectTrigger aria-label={t("aCat")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("aAll")}</SelectItem>
                  {merchantCategories.map((value) => (
                    <SelectItem key={value} value={value}>
                      {t(value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <MerchantPicker
              value={scope.merchant}
              onChange={(merchant) => setScope({ ...scope, merchant })}
              label={ownerT("searchMerchants")}
              emptyLabel={t("aNo")}
              stores={tables.stores.filter(
                (store) =>
                  scope.category === "all" || store.category === scope.category,
              )}
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() =>
                  setScope({ category: "all", merchant: "", query: "" })
                }
              >
                {ownerT("resetFilters")}
              </Button>
              <Button onClick={() => setFiltersOpen(false)}>
                {ownerT("done")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <p className="text-sm text-gray-500">
          {t(scope.category === "all" ? "aAll" : scope.category)}
        </p>
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
          <Card
            title={
              scope.category === "rest"
                ? h("restaurants")
                : ownerT("rankingMerchants")
            }
            id="home-restaurants"
          >
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

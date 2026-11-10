import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider, useTheme } from "@/context/theme-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import MetricCard from "@/components/main/dashboard/ecommerce/metrics/metric-card";
import AnalyticsDashboard from "@/components/talabot/analytics";
import {
  CallIcon,
  PencilIcon,
  ChevronRightIcon,
  MapIcon,
  ChatIcon,
  SearchIcon,
  FilterIcon,
  BoxIcon,
  ArrowLeftIcon,
  BellIcon,
} from "@/icons";
import AdminLayout from "./shell/admin-layout";
import { NativeRouteContext } from "./shell/router";
import decisions from "./decisions.json";
import en from "@/messages/en.json";
import ru from "@/messages/ru.json";
import tg from "@/messages/tg.json";
import "@/app/globals.css";
const dictionaries = { en, ru, tg };
for (const [lang, m] of Object.entries(dictionaries)) {
  m.sidebar.groups.menu =
    lang === "en"
      ? "Decision review"
      : lang === "ru"
        ? "Обзор решений"
        : "Баррасии қарорҳо";
  Object.assign(
    m.sidebar.items,
    Object.fromEntries(decisions.map((d) => [d.id, d.id])),
  );
}
const words = {
  en: {
    option: "Option",
    review: "Review only · no option approved",
    demo: "Synthetic data · no server connection",
    search: "Search orders",
    status: "Status",
    all: "All",
    details: "Details",
    back: "Back",
    edit: "Edit",
    call: "Call",
    map: "Location",
    chat: "Chat",
    save: "Simulate",
    cancel: "Cancel",
    confirm: "Confirm simulation",
    amount: "Amount · TJS",
    reason: "Reason",
    customer: "Customer",
    wallet: "Wallet",
    driver: "Courier",
    cash: "Cash",
    limit: "Limit",
    assign: "Assign courier",
    support: "Support",
    refund: "Refund",
    language: "Language",
    theme: "Theme",
    order: "Order",
    next: "Next allowed action",
    timeline: "Timeline",
    payment: "Payment",
    collection: "Collection",
    settlement: "Settlement",
    notice: "Simulation completed locally. No request was sent.",
    invalid: "Enter a positive amount and a reason of at least 3 characters.",
    orders: "Orders",
    revenue: "Revenue",
    commission: "Commission",
    active: "Active orders",
  },
  ru: {
    option: "Вариант",
    review: "Только обзор · ничего не утверждено",
    demo: "Тестовые данные · сервер не подключён",
    search: "Поиск заказов",
    status: "Статус",
    all: "Все",
    details: "Подробнее",
    back: "Назад",
    edit: "Изменить",
    call: "Позвонить",
    map: "Место",
    chat: "Чат",
    save: "Симуляция",
    cancel: "Отмена",
    confirm: "Подтвердить симуляцию",
    amount: "Сумма · TJS",
    reason: "Причина",
    customer: "Клиент",
    wallet: "Кошелёк",
    driver: "Курьер",
    cash: "Наличные",
    limit: "Лимит",
    assign: "Назначить курьера",
    support: "Поддержка",
    refund: "Возврат",
    language: "Язык",
    theme: "Тема",
    order: "Заказ",
    next: "Следующее действие",
    timeline: "История",
    payment: "Оплата",
    collection: "Получение денег",
    settlement: "Расчёты",
    notice: "Локальная симуляция. Запрос не отправлен.",
    invalid: "Положительная сумма и причина от 3 символов.",
    orders: "Заказы",
    revenue: "Выручка",
    commission: "Комиссия",
    active: "Активные заказы",
  },
  tg: {
    option: "Вариант",
    review: "Танҳо баррасӣ · тасдиқ нашудааст",
    demo: "Маълумоти озмоишӣ · сервер пайваст нест",
    search: "Ҷустуҷӯи фармоиш",
    status: "Ҳолат",
    all: "Ҳама",
    details: "Тафсилот",
    back: "Бозгашт",
    edit: "Таҳрир",
    call: "Занг",
    map: "Ҷойгиршавӣ",
    chat: "Суҳбат",
    save: "Озмоиш",
    cancel: "Бекор",
    confirm: "Тасдиқи озмоиш",
    amount: "Маблағ · TJS",
    reason: "Сабаб",
    customer: "Муштарӣ",
    wallet: "Ҳамён",
    driver: "Курер",
    cash: "Нақд",
    limit: "Ҳадд",
    assign: "Таъини курер",
    support: "Дастгирӣ",
    refund: "Баргардонидан",
    language: "Забон",
    theme: "Мавзуъ",
    order: "Фармоиш",
    next: "Амали навбатӣ",
    timeline: "Таърих",
    payment: "Пардохт",
    collection: "Гирифтани маблағ",
    settlement: "Ҳисоббаробаркунӣ",
    notice: "Озмоиши маҳаллӣ. Дархост фиристода нашуд.",
    invalid: "Маблағи мусбат ва сабаби на кам аз 3 ҳарф.",
    orders: "Фармоишҳо",
    revenue: "Даромад",
    commission: "Комиссия",
    active: "Фармоишҳои фаъол",
  },
};
type Lang = keyof typeof words;
const decisionTitles = [
  "البحث",
  "اللغة والمظهر",
  "التنبيهات",
  "تفاصيل الطلب",
  "الدفع والتحصيل والتسوية",
  "الإسناد",
  "العميل والمحفظة",
  "السائق والنقد والحدود",
  "المنشآت والموافقات",
  "الدعم والاسترداد",
  "بقية الإدارة",
  "المؤشرات",
  "الأيقونات",
  "ملاحة الهاتف",
];
const optionNames = [
  ["بحث داخل قائمة الطلبات", "بحث القائمة والرأس بالحالة نفسها"],
  ["إعدادات اللغة والمظهر داخل الصفحة", "ضوابط اللغة والمظهر داخل نافذة B"],
  ["تنبيهات ظاهرة مباشرة", "فتح التنبيهات في نافذة B"],
  ["تفاصيل الطلب ظاهرة في الصفحة", "التفاصيل الثانوية داخل Tabs B"],
  ["المعاني المالية ظاهرة", "المعاني المالية داخل Dialog B"],
  ["الإسناد من تفاصيل الطلب", "الإسناد من صف الطلب"],
  ["المحفظة مباشرة بعد الملخص", "المحفظة ظاهرة والسجل داخل Tabs"],
  ["الإجراءات ظاهرة في الملف", "الإجراءات داخل Dialog B"],
  ["الموافقة ظاهرة في القائمة", "الموافقة داخل التفاصيل"],
  ["قرار الدعم داخل الصفحة", "قرار الدعم داخل Dialog"],
  ["تحرير داخل الصفحة", "تحرير داخل Dialog"],
  ["MetricCard الأصلية", "Card الأصلية دون تخصيص"],
  ["أيقونات B مع أسماء وصول", "أيقونات B مع النص الظاهر"],
  ["Sidebar / Sheet الأصلي", "غير ممثّل: وجهات الشريط السفلي غير محسومة"],
];
function App({
  locale,
  setLocale,
}: {
  locale: Lang;
  setLocale: (v: Lang) => void;
}) {
  const t = words[locale],
    { themeMode, setThemeMode } = useTheme();
  const [decision, setDecision] = useState(
      () => new URLSearchParams(location.search).get("decision") || "D01",
    ),
    [option, setOption] = useState("1"),
    [query, setQuery] = useState(""),
    [status, setStatus] = useState("all"),
    [selectedOrder, setSelectedOrder] = useState("ord1"),
    [detail, setDetail] = useState(false),
    [modal, setModal] = useState(""),
    [confirm, setConfirm] = useState(false),
    [message, setMessage] = useState(""),
    [draft, setDraft] = useState({
      amount: "20",
      reason: "",
      name: "Demo customer",
    }),
    [tab, setTab] = useState("timeline"),
    [admin, setAdmin] = useState("banners");
  const idx = Math.max(
      0,
      decisions.findIndex((d) => d.id === decision),
    ),
    d = decisions[idx],
    second = option === "2";
  useEffect(() => {
    const fn = () => {
      setDecision(
        new URLSearchParams(location.search).get("decision") || "D01",
      );
      setDetail(false);
    };
    addEventListener("popstate", fn);
    return () => removeEventListener("popstate", fn);
  }, []);
  const go = (id: string) => {
    history.pushState({}, "", "?decision=" + id);
    setDecision(id);
    setOption("1");
    setDetail(false);
    setModal("");
    setMessage("");
    window.scrollTo(0, 0);
  };
  const open = (action: string) => {
    setModal(action);
    setConfirm(false);
    setMessage("");
  };
  const simulate = () => {
    if (
      !Number.isFinite(Number(draft.amount)) ||
      Number(draft.amount) <= 0 ||
      draft.reason.trim().length < 3
    ) {
      setMessage(t.invalid);
      return;
    }
    setConfirm(true);
  };
  const controls = (
    <FieldGroup>
      <Field>
        <FieldLabel>{t.language}</FieldLabel>
        <Select value={locale} onValueChange={(v) => v && setLocale(v as Lang)}>
          <SelectTrigger aria-label="Language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["en", "ru", "tg"].map((v) => (
              <SelectItem key={v} value={v}>
                {v.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel>{t.theme}</FieldLabel>
        <Select
          value={themeMode}
          onValueChange={(v) =>
            v && setThemeMode(v as "light" | "dark" | "auto")
          }
        >
          <SelectTrigger aria-label="Theme">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["light", "dark", "auto"].map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </FieldGroup>
  );
  const actions = (
    <CardFooter>
      {[
        { key: "call", Icon: CallIcon },
        { key: "edit", Icon: PencilIcon },
        { key: "map", Icon: MapIcon },
        { key: "chat", Icon: ChatIcon },
      ].map(({ key, Icon }) => (
        <Button
          key={key}
          variant="outline"
          size={second ? "default" : "icon-lg"}
          aria-label={t[key as "call"]}
          onClick={() => open(key)}
        >
          <Icon />
          {second ? t[key as "call"] : null}
        </Button>
      ))}
    </CardFooter>
  );
  const finance = (
    <Table>
      <TableBody>
        {[
          [t.payment, "Cash · 126 TJS"],
          [t.collection, "Not collected — order preparing"],
          [t.settlement, "Not settled — independent state"],
        ].map(([label, value]) => (
          <TableRow key={label}>
            <TableCell>{label}</TableCell>
            <TableCell>{value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
  const form = (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="amount">{t.amount}</FieldLabel>
        <Input
          id="amount"
          type="number"
          value={draft.amount}
          onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="reason">{t.reason}</FieldLabel>
        <Textarea
          id="reason"
          value={draft.reason}
          onChange={(e) => setDraft({ ...draft, reason: e.target.value })}
        />
      </Field>
      <FieldDescription>{t.demo}</FieldDescription>
      {message === t.invalid ? <Alert variant="destructive"><AlertTitle>{message}</AlertTitle></Alert> : null}
      <Button onClick={simulate}>{t.save}</Button>
    </FieldGroup>
  );
  const timeline = (
    <Table>
      <TableBody>
        {[
          ["Placed", "10:00"],
          ["Accepted", "10:02"],
          ["Preparing", "10:04"],
        ].map(([a, b]) => (
          <TableRow key={a}>
            <TableCell>{a}</TableCell>
            <TableCell>{b}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
  const orderDetails = (
    <Card>
      <CardHeader>
        <CardTitle>
          #{selectedOrder} · {t.order}
        </CardTitle>
        <Badge color={selectedOrder === "ord1" ? "warning" : "success"}>
          {selectedOrder === "ord1" ? "Preparing" : "Delivered"}
        </Badge>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          {["Demo restaurant", "Demo courier", draft.name].map((v) => (
            <Field key={v}>
              <FieldDescription>{v}</FieldDescription>
            </Field>
          ))}
          {actions}
          {!second || decision !== "D04" ? (
            <>
              {timeline}
              {finance}
              <FieldDescription>
                {t.chat}: Demo customer — please call on arrival.
              </FieldDescription>
            </>
          ) : (
            <Tabs value={tab} onValueChange={(v) => setTab(String(v))}>
              <TabsList>
                <TabsTrigger value="timeline">{t.timeline}</TabsTrigger>
                <TabsTrigger value="chat">{t.chat}</TabsTrigger>
                <TabsTrigger value="finance">{t.payment}</TabsTrigger>
              </TabsList>
              <TabsContent value="timeline">{timeline}</TabsContent>
              <TabsContent value="chat">
                Demo customer — please call on arrival.
              </TabsContent>
              <TabsContent value="finance">{finance}</TabsContent>
            </Tabs>
          )}
          <FieldDescription>
            2 × Demo item · 121 TJS; discount 10; delivery 10; tip 5; total 126.
          </FieldDescription>
          <FieldDescription>
            {t.next}:{" "}
            {selectedOrder === "ord1" ? t.assign : "No assignment — delivered"}{" "}
            · synthetic scenario
          </FieldDescription>
          <Button
            disabled={selectedOrder !== "ord1"}
            onClick={() => open("assign")}
          >
            {t.assign}
          </Button>
          <Button variant="outline" onClick={() => setDetail(false)}>
            <ArrowLeftIcon />
            {t.back}
          </Button>
        </FieldGroup>
      </CardContent>
    </Card>
  );
  const orders = (
    <Card>
      <CardHeader>
        <CardTitle>{t.orders}</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="order-search">
              <SearchIcon />
              {t.search}
            </FieldLabel>
            <Input
              id="order-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>
              <FilterIcon />
              {t.status}
            </FieldLabel>
            <Select value={status} onValueChange={(v) => v && setStatus(v)}>
              <SelectTrigger aria-label="Order status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.all}</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <ScrollArea>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell isHeader>ID</TableCell>
                  <TableCell isHeader>{t.customer}</TableCell>
                  <TableCell isHeader>{t.status}</TableCell>
                  <TableCell isHeader>{t.details}</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: "ord1", name: "Demo customer", status: "preparing" },
                  { id: "ord2", name: "Demo customer 2", status: "delivered" },
                ]
                  .filter(
                    (r) =>
                      (status === "all" || status === r.status) &&
                      (r.id + " " + r.name)
                        .toLowerCase()
                        .includes(query.toLowerCase()),
                  )
                  .map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.id}</TableCell>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>
                        <Badge
                          color={
                            r.status === "delivered" ? "success" : "warning"
                          }
                        >
                          {r.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="icon-lg"
                          aria-label={t.details + " " + r.id}
                          onClick={() => {
                            setSelectedOrder(r.id);
                            setDetail(true);
                          }}
                        >
                          <ChevronRightIcon />
                        </Button>
                        {decision === "D06" &&
                        second &&
                        r.status === "preparing" ? (
                          <Button onClick={() => open("assign")}>
                            {t.assign}
                          </Button>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </FieldGroup>
      </CardContent>
    </Card>
  );
  const alerts = (
    <Card>
      <CardHeader>
        <CardTitle>{t.support} · 3</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          {[
            "Unassigned order · ord1",
            "Cash limit · Demo courier",
            "Customer support · ticket1",
          ].map((a) => (
            <Button variant="outline" key={a} onClick={() => open(a)}>
              <BellIcon />
              {a}
            </Button>
          ))}
        </FieldGroup>
      </CardContent>
    </Card>
  );
  const sensitive = (
    <Card>
      <CardHeader>
        <CardTitle>
          {decision === "D07"
            ? t.customer
            : decision === "D08"
              ? t.driver
              : decision === "D10"
                ? t.support
                : "Demo store"}
        </CardTitle>
        <CardDescription>{draft.name} · synthetic account</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          {decision === "D07" ? (
            <>
              <Badge>{t.wallet}: 50 TJS</Badge>
              {second ? (
                <Tabs defaultValue="wallet">
                  <TabsList>
                    <TabsTrigger value="wallet">{t.wallet}</TabsTrigger>
                    <TabsTrigger value="history">{t.timeline}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="wallet">
                    <Button onClick={() => open("wallet")}>{t.wallet}</Button>
                  </TabsContent>
                  <TabsContent value="history">
                    Demo entry +50 TJS · no real ledger
                  </TabsContent>
                </Tabs>
              ) : (
                <>
                  <Button onClick={() => open("wallet")}>{t.wallet}</Button>
                  <FieldDescription>
                    Demo entry +50 TJS · no real ledger
                  </FieldDescription>
                </>
              )}
            </>
          ) : decision === "D08" ? (
            <>
              <Badge color="warning">
                {t.cash}: 1250 · {t.limit}: 1000 TJS
              </Badge>
              {second ? (
                <Button onClick={() => open("driver-actions")}>
                  {t.details}
                </Button>
              ) : (
                <>
                  {["cash", "limit", "Pause new orders"].map((k) => (
                    <Button key={k} variant="outline" onClick={() => open(k)}>
                      {k === "cash" ? t.cash : k === "limit" ? t.limit : k}
                    </Button>
                  ))}
                </>
              )}
            </>
          ) : decision === "D10" ? (
            <>
              <FieldDescription>
                ticket1 · ord1 · demo refund room 106 TJS · presentation only,
                not a contract test.
              </FieldDescription>
              {second ? (
                <Button onClick={() => open("refund")}>{t.refund}</Button>
              ) : (
                form
              )}
            </>
          ) : (
            <>
              <FieldDescription>
                Demo merchant · pending approval · owner not assigned
              </FieldDescription>
              <Button onClick={() => open("approve")}>{t.confirm}</Button>
            </>
          )}
          {actions}
        </FieldGroup>
      </CardContent>
    </Card>
  );
  let scene: React.ReactNode;
  if (["D01", "D04", "D06", "D14"].includes(decision))
    scene = detail ? orderDetails : orders;
  else if (decision === "D02")
    scene = second ? (
      <Button onClick={() => open("settings")}>
        {t.language} / {t.theme}
      </Button>
    ) : (
      controls
    );
  else if (decision === "D03")
    scene = second ? (
      <Button onClick={() => open("alerts")}>
        <BellIcon />3 · {t.details}
      </Button>
    ) : (
      alerts
    );
  else if (decision === "D05")
    scene = second ? (
      <Button onClick={() => open("finance")}>
        {t.payment} / {t.collection} / {t.settlement}
      </Button>
    ) : (
      finance
    );
  else if (["D07", "D08", "D10"].includes(decision)) scene = sensitive;
  else if (decision === "D09")
    scene =
      second && !detail ? (
        <Button onClick={() => setDetail(true)}>
          Demo store <ChevronRightIcon />
        </Button>
      ) : (
        <>
          {sensitive}
          {second ? (
            <Button variant="outline" onClick={() => setDetail(false)}>
              {t.back}
            </Button>
          ) : null}
        </>
      );
  else if (decision === "D11")
    scene = (
      <FieldGroup>
        <Select value={admin} onValueChange={(v) => v && setAdmin(v)}>
          <SelectTrigger aria-label="Administration example">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[
              "banners",
              "promotions",
              "loyalty",
              "texts",
              "staff",
              "audit",
            ].map((v) => (
              <SelectItem value={v} key={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldDescription>
          التمثيل هنا لموضع نموذج B، وليس نقلاً كاملاً لحقول هذا القسم أو
          صلاحياته.
        </FieldDescription>
        {second ? (
          <Button onClick={() => open("admin")}>{t.edit}</Button>
        ) : (
          <FieldGroup>
            <Field>
              <FieldLabel>{admin} · Demo</FieldLabel>
              <Input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </Field>
            <Button onClick={() => open("admin")}>{t.save}</Button>
          </FieldGroup>
        )}
      </FieldGroup>
    );
  else if (decision === "D12")
    scene = (
      <FieldDescription>
        مؤشرات A المعروضة أعلى الصفحة تستخدم {second ? "Card" : "MetricCard"} من
        B. بيانات A مستقلة عن مؤشرات B الموجودة بعد التحليلات؛ الضغط لا يغيّر
        الحسابات.
      </FieldDescription>
    );
  else
    scene = (
      <>
        {actions}
        <Alert>
          <AlertTitle>Wallet / Location</AlertTitle>
          <AlertDescription>
            MapIcon أصلي من B. لا توجد أيقونة Wallet منفردة في الجرد؛ يظهر نص
            المحفظة داخل Button B، ولا يُرسم بديل.
          </AlertDescription>
        </Alert>
        <Button onClick={() => open("wallet")}>{t.wallet}</Button>
      </>
    );
  const modalBody =
    modal === "settings" ? (
      controls
    ) : modal === "alerts" ? (
      alerts
    ) : modal === "finance" ? (
      finance
    ) : modal === "assign" ? (
      <FieldGroup>
        <FieldDescription>
          Demo eligible courier · approved · online · free. Display scenario
          only.
        </FieldDescription>
        <Button
          onClick={() => {
            setMessage(t.notice);
            setModal("");
          }}
        >
          Demo courier · 0.8 km — {t.assign}
        </Button>
      </FieldGroup>
    ) : modal === "driver-actions" ? (
      <FieldGroup>
        {["cash", "limit", "Pause new orders"].map((k) => (
          <Button key={k} onClick={() => open(k)}>
            {k}
          </Button>
        ))}
      </FieldGroup>
    ) : ["call", "map", "chat"].includes(modal) ? (
      <FieldDescription>
        {t.demo}.{" "}
        {modal === "call"
          ? "Call preview: +000 DEMO — no dial request."
          : modal === "map"
            ? "Map preview: 38.56, 68.78 — no location request or live driver tracking."
            : "Demo customer: please call on arrival."}
      </FieldDescription>
    ) : modal === "edit" || modal === "admin" ? (
      <FieldGroup>
        <Field>
          <FieldLabel>{t.edit}</FieldLabel>
          <Input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
        </Field>
        <Button
          onClick={() => {
            setMessage(t.notice);
            setModal("");
          }}
        >
          {t.save}
        </Button>
      </FieldGroup>
    ) : (
      form
    );
  return (
    <NativeRouteContext.Provider value={{ section: decision, go }}>
      <AdminLayout
        header={{
          query: decision === "D01" && second ? query : "",
          onSearch: (v) => {
            if (decision === "D01" && second) setQuery(v);
            else {
              setMessage(
                "بحث الرأس ليس ضمن هذا الخيار؛ استخدم البحث الظاهر في القائمة.",
              );
            }
          },
          notifications: (
            <Button
              variant="outline"
              aria-label={t.support}
              onClick={() => open("alerts")}
            >
              <BellIcon />
            </Button>
          ),
          searchEnabled: decision === "D01" && second,
          controls: (
            <Button variant="outline" onClick={() => open("settings")}>
              {locale.toUpperCase()} · {themeMode}
            </Button>
          ),
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>TALABOT · D01–D14</CardTitle>
            <CardDescription>
              {t.review} · {t.demo}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Select value={decision} onValueChange={(v) => v && go(v)}>
                <SelectTrigger aria-label="Decision">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {decisions.map((r, i) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.id} — {decisionTitles[i]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <CardDescription>
                النص الإرشادي بالعربية. المعاينة EN/RU/TG؛ بعض أمثلة B تبقى
                بلغتها الأصلية. جرّب الخيارين؛ الاختيار لا يسجل موافقة.
              </CardDescription>
            </FieldGroup>
          </CardContent>
        </Card>
        <div
          className="grid grid-cols-2 gap-4 md:gap-6 xl:grid-cols-4"
          data-testid="a-metrics"
        >
          {[
            [t.orders, "7"],
            [t.revenue, "415 TJS"],
            [t.commission, "44 TJS"],
            [t.active, "4"],
          ].map(([title, value]) =>
            decision === "D12" && second ? (
              <Card key={title}>
                <CardTitle>{title}</CardTitle>
                <CardContent>{value}</CardContent>
              </Card>
            ) : (
              <MetricCard
                key={title}
                title={title}
                value={value}
                icon={<BoxIcon />}
              />
            ),
          )}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>
              {d.id} — {decisionTitles[idx]}
            </CardTitle>
            <CardDescription>{d.source}</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <FieldDescription dir="rtl">
                الموضع المقترح: {d.place}
              </FieldDescription>
              <FieldDescription dir="rtl">{d.options}</FieldDescription>
              <FieldDescription dir="rtl">
                الهاتف والكمبيوتر: {d.impact}
              </FieldDescription>
              <Tabs
                value={option}
                onValueChange={(v) => {
                  setOption(String(v));
                  setDetail(false);
                }}
              >
                <TabsList>
                  <TabsTrigger value="1">{t.option} 1</TabsTrigger>
                  <TabsTrigger value="2">{t.option} 2</TabsTrigger>
                </TabsList>
                <TabsContent value={option}>
                  <FieldDescription dir="rtl">
                    {optionNames[idx][second ? 1 : 0]}
                  </FieldDescription>
                  {decision === "D14" && second ? (
                    <Alert variant="warning">
                      <AlertTitle>NOT REPRESENTED</AlertTitle>
                      <AlertDescription>
                        MobileNavigation في B موجود، لكن وجهاته لا تطابق أقسام A
                        الاثني عشر دون قرار. لا شريط جديد. جرّب Sidebar/Sheet
                        الأصلي في الخيار1 على هاتفك.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    scene
                  )}
                </TabsContent>
              </Tabs>
              <FieldDescription dir="rtl">
                الظاهر مباشرة هو المحتوى أعلاه. أزرار التفاصيل والإجراءات تفتح
                مكونات B المعروضة؛ Dialog يحافظ على مدخلات المحاكاة عند الإغلاق
                والعودة. لا حفظ تشغيلي.
              </FieldDescription>
            </FieldGroup>
          </CardContent>
        </Card>
        {message ? (
          <Alert>
            <AlertTitle>{message}</AlertTitle>
          </Alert>
        ) : null}
        <Dialog
          open={!!modal}
          onOpenChange={(v) => {
            if (!v) {
              setModal("");
              setConfirm(false);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{modal} · DEMO</DialogTitle>
              <DialogDescription>{t.demo}</DialogDescription>
            </DialogHeader>
            {confirm ? (
              <>
                <Alert variant="warning">
                  <AlertTitle>{t.confirm}</AlertTitle>
                  <AlertDescription>
                    {draft.amount} TJS · {draft.reason}
                  </AlertDescription>
                </Alert>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setConfirm(false)}>
                    {t.cancel}
                  </Button>
                  <Button
                    onClick={() => {
                      setMessage(t.notice);
                      setModal("");
                      setConfirm(false);
                    }}
                  >
                    {t.confirm}
                  </Button>
                </DialogFooter>
              </>
            ) : (
              modalBody
            )}
          </DialogContent>
        </Dialog>
        {confirm && !modal ? (
          <Dialog open onOpenChange={(v) => !v && setConfirm(false)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.confirm}</DialogTitle>
                <DialogDescription>
                  {t.demo} · {draft.amount} TJS · {draft.reason}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirm(false)}>
                  {t.cancel}
                </Button>
                <Button
                  onClick={() => {
                    setMessage(t.notice);
                    setConfirm(false);
                  }}
                >
                  {t.confirm}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : null}
        <section className="grid grid-cols-12 gap-4 md:gap-6">
          <AnalyticsDashboard />
        </section>
        <div className="grid grid-cols-2 gap-4 md:gap-6 xl:grid-cols-4">
          {[
            ["B · Active orders", "24"],
            ["B · Available drivers", "12"],
            ["B · Open restaurants", "18"],
            ["B · Customers", "3,782"],
          ].map(([title, value]) => (
            <MetricCard
              key={title}
              title={title}
              value={value}
              icon={<BoxIcon />}
            />
          ))}
        </div>
      </AdminLayout>
    </NativeRouteContext.Provider>
  );
}
function Root() {
  const [locale, setLocale] = useState<Lang>(() => {
    const v = localStorage.getItem("gallery:locale");
    return v === "ru" || v === "tg" ? v : "en";
  });
  useEffect(() => {
    document.documentElement.lang = locale;
    localStorage.setItem("gallery:locale", locale);
  }, [locale]);
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={dictionaries[locale]}
      timeZone="Asia/Dushanbe"
    >
      <ThemeProvider>
        <TooltipProvider>
          <App locale={locale} setLocale={setLocale} />
        </TooltipProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
createRoot(document.getElementById("root")!).render(<Root />);

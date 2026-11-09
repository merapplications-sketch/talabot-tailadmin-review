import type { CopyKey, Text } from "./copy";
export const sections = [
  "restaurants",
  "campaigns",
  "loyalty",
  "returns",
  "finance",
  "security",
] as const;
export type Section = (typeof sections)[number];
export interface ReviewRecord {
  id: string;
  name: Text;
  status: "active" | "paused" | "draft" | "pending";
  reference: string;
  fields: [CopyKey, Text][];
}
const text = (a: string, b = a, c = b): Text => [a, b, c];
export const records: Record<Section, ReviewRecord[]> = {
  restaurants: [
    {
      id: "DEMO-M01",
      name: text("Demo kitchen", "Демо-кухня", "Ошхонаи намунавӣ"),
      status: "active",
      reference: "DEMO-B01",
      fields: [
        [
          "branch",
          text(
            "Demo central branch",
            "Демо центральный филиал",
            "Филиали марказии намунавӣ",
          ),
        ],
        ["hours", text("09:00–21:00 · Asia/Dushanbe")],
        [
          "availability",
          text(
            "Synthetic example only",
            "Только синтетический пример",
            "Танҳо намунаи сунъӣ",
          ),
        ],
        [
          "menu",
          text(
            "Main dishes / DEMO-I01",
            "Основные блюда / DEMO-I01",
            "Таомҳои асосӣ / DEMO-I01",
          ),
        ],
        ["price", text("35.00")],
        ["extras", text("DEMO-X01 · 5.00 TJS")],
        [
          "image",
          text(
            "Local template image",
            "Локальное изображение шаблона",
            "Тасвири маҳаллии қолаб",
          ),
        ],
      ],
    },
    {
      id: "DEMO-M02",
      name: text("Demo bakery", "Демо-пекарня", "Нонвойхонаи намунавӣ"),
      status: "paused",
      reference: "DEMO-B02",
      fields: [
        [
          "branch",
          text(
            "Demo north branch",
            "Демо северный филиал",
            "Филиали шимолии намунавӣ",
          ),
        ],
        ["hours", text("08:00–18:00 · Asia/Dushanbe")],
        [
          "menu",
          text("Bakery / DEMO-I02", "Выпечка / DEMO-I02", "Нонпазӣ / DEMO-I02"),
        ],
        ["price", text("12.00")],
        ["extras", text("—")],
      ],
    },
  ],
  campaigns: [
    "Banners",
    "Hot Deals",
    "Flash Sale",
    "Lunch Edit",
    "DineOut Gold",
  ].map((name, i) => ({
    id: `DEMO-C0${i + 1}`,
    name: text(
      name,
      name === "Banners" ? "Баннеры" : name,
      name === "Banners" ? "Баннерҳо" : name,
    ),
    status: "draft",
    reference: "DEMO-M01 / DEMO-I01",
    fields: [
      [
        "placement",
        text("Pending approval", "Ожидает утверждения", "Тасдиқро интизор аст"),
      ],
      ["targets", text("DEMO-M01 / DEMO-I01")],
      ["start", text("2026-11-10 12:00")],
      ["end", text("2026-11-10 14:00")],
    ],
  })),
  loyalty: [
    {
      id: "DEMO-U01",
      name: text("Demo customer 01", "Демо-клиент 01", "Мизоҷи намунавӣ 01"),
      status: "active",
      reference: "DEMO-1104",
      fields: [
        ["balance", text("250")],
        ["orders", text("DEMO-1104 · 75.00 TJS")],
        ["ledger", text("DEMO-P01 +300 / DEMO-P02 −50")],
      ],
    },
    {
      id: "DEMO-U02",
      name: text("Demo customer 02", "Демо-клиент 02", "Мизоҷи намунавӣ 02"),
      status: "active",
      reference: "DEMO-1105",
      fields: [
        ["balance", text("0")],
        ["orders", text("DEMO-1105 · 80.00 TJS")],
        ["ledger", text("—")],
      ],
    },
  ],
  returns: [
    {
      id: "DEMO-R01",
      name: text(
        "Cash return after pickup",
        "Возврат наличных после получения",
        "Баргардонии нақд пас аз гирифтан",
      ),
      status: "pending",
      reference: "DEMO-1105",
      fields: [
        ["paid", text("80.00 TJS")],
        [
          "reason",
          text(
            "Customer cancellation after pickup",
            "Отмена клиентом после получения",
            "Бекоркунии мизоҷ пас аз гирифтан",
          ),
        ],
        [
          "delivery",
          text(
            "Platform · amount unverified",
            "Платформа · сумма не проверена",
            "Платформа · маблағ санҷида нашудааст",
          ),
        ],
      ],
    },
  ],
  finance: (
    [
      "sales",
      "revenue",
      "commission",
      "payable",
      "settlements",
      "receipts",
      "claim",
      "expenses",
      "reports",
    ] as CopyKey[]
  ).map((key, i) => ({
    id: `DEMO-F0${i + 1}`,
    name: (
      {
        sales: text(
          "Merchant sales",
          "Продажи ресторанов",
          "Фурӯши тарабхонаҳо",
        ),
        revenue: text(
          "Platform revenue",
          "Доход платформы",
          "Даромади платформа",
        ),
        commission: text("Commissions", "Комиссии", "Комиссияҳо"),
        payable: text(
          "Restaurant payables",
          "К выплате ресторанам",
          "Пардохт ба тарабхонаҳо",
        ),
        settlements: text(
          "Driver settlements",
          "Расчёты с водителями",
          "Ҳисоббаробаркунӣ бо ронандагон",
        ),
        receipts: text("Receipt example", "Пример квитанции", "Намунаи расид"),
        claim: text("Open claims", "Открытые требования", "Талабҳои кушода"),
        expenses: text(
          "Recorded expenses",
          "Учтённые расходы",
          "Хароҷоти сабтшуда",
        ),
        reports: text(
          "Financial reports",
          "Финансовые отчёты",
          "Ҳисоботи молиявӣ",
        ),
      } as Record<string, Text>
    )[key],
    status: "pending",
    reference: "DEMO-1105",
    fields: [
      [
        "definition",
        text(
          "Awaiting authoritative contract",
          "Ожидается подтверждённый контракт",
          "Шартномаи тасдиқшуда интизор аст",
        ),
      ],
      ["reference", text("DEMO-1105 / TJS")],
      [
        "actual",
        text(
          [
            "800.00",
            "64.00",
            "48.00",
            "320.00",
            "55.00",
            "25.00",
            "20.00",
            "15.00",
            "—",
          ][i] + (i === 8 ? "" : " TJS"),
        ),
      ],
      ["timestamp", text("2026-11-09 12:00 · Asia/Dushanbe")],
      [
        "status",
        text(
          "Synthetic record · Unverified",
          "Синтетическая запись · Не проверена",
          "Сабти сунъӣ · Санҷида нашудааст",
        ),
      ],
    ],
  })),
  security: [
    {
      id: "DEMO-A01",
      name: text("Demo administrator", "Демо-администратор", "Мудири намунавӣ"),
      status: "active",
      reference: "DEMO-ROLE-ADMIN",
      fields: [
        [
          "permissions",
          text(
            "UI example only",
            "Только пример интерфейса",
            "Танҳо намунаи интерфейс",
          ),
        ],
        [
          "audit",
          text(
            "No live audit records",
            "Нет реальных записей аудита",
            "Сабти воқеии аудит нест",
          ),
        ],
      ],
    },
    {
      id: "DEMO-A02",
      name: text(
        "Demo finance reviewer",
        "Демо финансовый контролёр",
        "Нозири молиявии намунавӣ",
      ),
      status: "draft",
      reference: "DEMO-ROLE-FINANCE",
      fields: [
        [
          "permissions",
          text(
            "Pending server matrix",
            "Ожидается серверная матрица",
            "Матритсаи сервер интизор аст",
          ),
        ],
      ],
    },
    {
      id: "DEMO-S01",
      name: text(
        "Platform settings",
        "Настройки платформы",
        "Танзимоти платформа",
      ),
      status: "draft",
      reference: "EN / RU / TG",
      fields: [
        ["settings", text("TJS · Asia/Dushanbe")],
        [
          "alerts",
          text(
            "Connection / permission / missing data",
            "Соединение / доступ / отсутствие данных",
            "Пайвастшавӣ / иҷозат / набудани маълумот",
          ),
        ],
      ],
    },
  ],
};

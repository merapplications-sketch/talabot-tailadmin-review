export const financeCopy = {
  document: ["Supporting record", "Документ-основание", "Ҳуҷҷати асоснок"],
  receipt: ["Receipt preview", "Предпросмотр квитанции", "Пешнамоиши расид"],
  watermark: [
    "DEMO · NOT A PAYMENT",
    "ДЕМО · НЕ ПЛАТЁЖ",
    "НАМУНА · ПАРДОХТ НЕСТ",
  ],
  unverified: [
    "Pending reconciliation",
    "Ожидает сверки",
    "Муқоисаро интизор аст",
  ],
  source: ["Source", "Источник", "Манбаъ"],
  fixture: [
    "Independent synthetic example",
    "Независимый синтетический пример",
    "Намунаи мустақили сунъӣ",
  ],
  payer: ["Payer", "Плательщик", "Пардохткунанда"],
  recipient: ["Recipient", "Получатель", "Қабулкунанда"],
  unknown: ["Not supplied", "Не указан", "Пешниҳод нашудааст"],
  evidence: ["Payment evidence", "Подтверждение платежа", "Далели пардохт"],
  missing: [
    "Not attached · cannot confirm payment",
    "Не приложено · платёж не подтверждён",
    "Замима нест · пардохт тасдиқ нашудааст",
  ],
  independent: [
    "These examples are not a reconciled ledger. No total, payable or commission rate is derived from them.",
    "Эти примеры не являются сверенным реестром. Итоги, суммы к выплате и ставки комиссии из них не рассчитываются.",
    "Ин намунаҳо дафтари муқоисашуда нестанд. Ҷамъ, маблағи пардохт ва меъёри комиссия аз онҳо ҳисоб намешаванд.",
  ],
  expenseDraft: ["Expense draft", "Черновик расхода", "Лоиҳаи хароҷот"],
  preview: ["Preview draft", "Предпросмотр черновика", "Пешнамоиши лоиҳа"],
  notPosted: [
    "Preview only · not posted or saved to accounts",
    "Только предпросмотр · не проведено и не записано в учёт",
    "Танҳо пешнамоиш · ба ҳисоб сабт нашудааст",
  ],
  audit: [
    "No live audit event exists. Actor, timestamp, before/after values and evidence must come from the verified service.",
    "Реального события аудита нет. Исполнитель, время, значения до/после и доказательства должны поступать из проверенного сервиса.",
    "Ҳодисаи воқеии аудит вуҷуд надорад. Иҷрокунанда, вақт, арзишҳои пеш/пас ва далелҳо бояд аз хидмати санҷидашуда оянд.",
  ],
} as const;

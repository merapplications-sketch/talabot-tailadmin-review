// Display only. Preserve original timestamps, sorting, amounts and scope.
export function formatDate(value: string, locale: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat(locale === "tg" ? "en-GB" : locale, {
    timeZone: "Asia/Dushanbe",
    day: "numeric",
    month: locale === "tg" ? "2-digit" : "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

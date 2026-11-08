/** Date-only fields use inclusive ends; FullCalendar uses exclusive all-day ends. */
export function validateEventDates(start: string, end: string): string | null {
  const valid = (value: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value;
  if (!valid(start) || (end && !valid(end)))
    return "Enter a valid start and end date.";
  if (end && end < start) return "End date must be on or after start date.";
  return null;
}
function shiftDate(value: string, days: number): string {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
export const toExclusiveEnd = (inclusive: string) => shiftDate(inclusive, 1);
export const toInclusiveEnd = (exclusive: string) => shiftDate(exclusive, -1);

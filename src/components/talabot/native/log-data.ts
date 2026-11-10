import { tables, text, type Row } from "./domain";
// A read contracts: audit/clientErrors; loadLog/vLog. Read-only, no transport.
export function logRows(source: Row[], limit = 100) {
  return [...source]
    .sort((a, b) => Date.parse(text(b, "at")) - Date.parse(text(a, "at")))
    .slice(0, Math.min(200, limit || 100));
}
export function logActor(id: unknown, drivers = tables.drivers || []) {
  const driver = drivers.find((d) => d.id === id);
  return driver ? text(driver, "name") : String(id || "").slice(0, 8) || "—";
}
export function logChanges(details: unknown) {
  if (!details || typeof details !== "object" || Array.isArray(details))
    return [];
  return Object.entries(details).map(([field, value]) => {
    const change = value && typeof value === "object" ? (value as Row) : {};
    return {
      field,
      from: String(change.from ?? "∅").slice(0, 24),
      to: String(change.to ?? "∅").slice(0, 24),
    };
  });
}
export function readLogs(source = tables) {
  return {
    audit: logRows(source.audit_log || []),
    errors: logRows(source.client_errors || []),
  };
}

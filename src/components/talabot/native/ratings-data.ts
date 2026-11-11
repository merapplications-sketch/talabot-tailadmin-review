import type { Row } from "./domain";

// A admin.html: avg / lowOf / needR / cmtParts. Pure data functions only.
export function ratingAverage(rows: Row[], key: string) {
  const values = rows
    .map((row) => row[key])
    .filter((n) => n != null) as number[];
  return values.length
    ? {
        a: values.reduce((sum, n) => sum + n, 0) / values.length,
        n: values.length,
      }
    : null;
}
export function needsRatingFollowup(row: Row) {
  return (
    !row.handled_at &&
    ((row.store_stars != null && Number(row.store_stars) <= 3) ||
      (row.driver_stars != null && Number(row.driver_stars) <= 3))
  );
}
export function ratingComment(comment: unknown) {
  const match = /^\[([^\]]{1,160})\]\s*([\s\S]*)$/.exec(String(comment || ""));
  return match
    ? {
        tags: match[1]
          .split("|")
          .map((x) => x.trim())
          .filter(Boolean)
          .slice(0, 8),
        text: match[2],
      }
    : { tags: [], text: String(comment || "") };
}

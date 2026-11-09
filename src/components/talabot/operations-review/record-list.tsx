import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tr, type CopyKey } from "./copy";
import type { ReviewRecord } from "./data";
interface Props {
  rows: ReviewRecord[];
  locale: string;
  t: (key: CopyKey) => string;
  onSelect: (id: string) => void;
}
export default function RecordList({ rows, locale, t, onSelect }: Props) {
  return (
    <>
      <div className="op-desktop">
        <Table>
          <TableHeader>
            <TableRow>
              {(["name", "reference", "status", "details"] as CopyKey[]).map(
                (key) => (
                  <TableCell key={key} isHeader>
                    {t(key)}
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <strong>{tr(row.name, locale)}</strong>
                  <small>{row.id}</small>
                </TableCell>
                <TableCell>{row.reference}</TableCell>
                <TableCell>
                  <span className="op-status" data-status={row.status}>
                    {t(row.status)}
                  </span>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => onSelect(row.id)}
                    aria-label={`${t("details")}: ${tr(row.name, locale)}`}
                  >
                    {t("details")}
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="op-mobile">
        {rows.map((row) => (
          <article className="op-card" key={row.id}>
            <span className="op-status" data-status={row.status}>
              {t(row.status)}
            </span>
            <h3>{tr(row.name, locale)}</h3>
            <p>
              {row.id} · {row.reference}
            </p>
            <button onClick={() => onSelect(row.id)}>{t("details")}</button>
          </article>
        ))}
      </div>
    </>
  );
}

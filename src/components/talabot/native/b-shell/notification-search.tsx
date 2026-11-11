import { useState } from "react";
import { useTranslations } from "next-intl";
import SearchField from "./search-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
export default function NotificationSearch({
  query,
  state,
  set,
}: {
  query: string;
  state: string;
  set: (key: string, value: string) => void;
}) {
  const t = useTranslations("workspace"),
    owner = useTranslations("ownerRound");
  const [open, setOpen] = useState(false);
  const items = ["all", "read", "unread"].map((value) => ({
    value,
    label: t(value),
  }));
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3">
      <SearchField
        id="notification-search"
        label={t("search")}
        value={query}
        onChange={(value) => set("q", value)}
        filterLabel={owner("filters")}
        filtersOpen={open}
        onFilters={() => setOpen(true)}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogTitle>{owner("filters")}</DialogTitle>
          <Select
            value={state || "all"}
            items={items}
            onValueChange={(value) =>
              set("state", value === "all" ? "" : value || "")
            }
          >
            <SelectTrigger aria-label={t("status")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>{owner("done")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

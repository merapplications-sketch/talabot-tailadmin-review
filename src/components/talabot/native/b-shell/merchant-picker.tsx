import { useMemo } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { tables, text, type Row } from "../domain";
// B searchable combobox: filter the full loaded directory, render at most 50 matches.
export default function MerchantPicker({
  value,
  onChange,
  label,
  emptyLabel,
  stores = tables.stores,
}: {
  value: string;
  onChange: (id: string) => void;
  label: string;
  emptyLabel: string;
  stores?: Row[];
}) {
  const items = useMemo(
    () =>
      stores.map((row) => ({
        value: text(row, "id"),
        label: text(row, "name"),
      })),
    [stores],
  );
  return (
    <Combobox
      items={items}
      value={items.find((item) => item.value === value) || null}
      itemToStringLabel={(item) => item.label}
      itemToStringValue={(item) => item.value}
      isItemEqualToValue={(a, b) => a.value === b.value}
      limit={50}
      onValueChange={(item) => onChange(item?.value || "")}
    >
      <ComboboxInput
        aria-label={label}
        placeholder={label}
        showClear
        className="h-12 [&_input]:text-base [&_input]:focus-visible:outline-none!"
      />
      <ComboboxContent>
        <ComboboxEmpty>{emptyLabel}</ComboboxEmpty>
        <ComboboxList>
          {(item: { value: string; label: string }) => (
            <ComboboxItem key={item.value} value={item}>
              <span className="min-w-0 break-words whitespace-normal">
                {item.label}
              </span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

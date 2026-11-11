import type { Ref } from "react";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { SearchIcon, FilterIcon } from "@/icons";
import { actionColors } from "../action-colors";

// One B input-group composition for every existing native list search.
export default function SearchField({
  id,
  label,
  placeholder,
  value,
  onChange,
  inputRef,
  filterLabel,
  filtersOpen,
  onFilters,
}: {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  inputRef?: Ref<HTMLInputElement>;
  filterLabel?: string;
  filtersOpen?: boolean;
  onFilters?: () => void;
}) {
  return (
    <div className="w-full min-w-0">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          id={id}
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || label}
        />
        {onFilters && (
          <InputGroupAddon align="inline-end" className="pe-0">
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              aria-label={filterLabel}
              aria-haspopup="dialog"
              aria-expanded={filtersOpen}
              onClick={onFilters}
            >
              <FilterIcon className={actionColors.details} aria-hidden="true" />
            </Button>
          </InputGroupAddon>
        )}
      </InputGroup>
    </div>
  );
}

import type { ComponentType } from "react";
import { Button } from "@/components/ui/button";
// Presentation extracted from B SummaryCards, 8dc0f4c. No click contract for A KPIs.
export default function SummaryCards({
  cards,
}: {
  cards: {
    key: string;
    label: string;
    value: React.ReactNode;
    iconClassName?: string;
    onClick?: () => void;
    Icon: ComponentType<{ className?: string }>;
  }[];
}) {
  return (
    <div
      className="grid grid-cols-2 gap-4 md:gap-6 xl:grid-cols-4"
      data-testid="summary-cards"
    >
      {cards.map(({ key, label, value, Icon, onClick, iconClassName }) => {
        const className =
          "min-w-0 h-auto rounded-2xl border border-gray-200 bg-white p-4 text-start whitespace-normal shadow-theme-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 max-sm:gap-1! max-sm:p-3! md:p-6 dark:border-gray-800 dark:bg-white/3";
        const content = (
          <>
            <span className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
              <Icon className={`size-6 ${iconClassName || ""}`} />
            </span>
            <span className="mt-5 block text-sm text-gray-500 dark:text-gray-400">
              {label}
            </span>
            <span className="mt-2 block text-title-sm font-bold break-words text-gray-800 tabular-nums max-sm:text-lg! dark:text-white/90">
              {value}
            </span>
          </>
        );
        return onClick ? (
          <Button
            key={key}
            variant="ghost"
            data-summary-info
            className={className}
            aria-label={label}
            onClick={onClick}
          >
            {content}
          </Button>
        ) : (
          <div key={key} data-summary-info role="group" className={className}>
            {content}
          </div>
        );
      })}
    </div>
  );
}

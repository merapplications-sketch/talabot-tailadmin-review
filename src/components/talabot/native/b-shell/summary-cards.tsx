import type { ComponentType } from "react";
// Presentation extracted from B SummaryCards, 8dc0f4c. No click contract for A KPIs.
export default function SummaryCards({
  cards,
}: {
  cards: {
    key: string;
    label: string;
    value: string | number;
    Icon: ComponentType<{ className?: string }>;
  }[];
}) {
  return (
    <div
      className="grid grid-cols-2 gap-4 md:gap-6 xl:grid-cols-4"
      data-testid="summary-cards"
    >
      {cards.map(({ key, label, value, Icon }) => (
        <div
          data-summary-info
          role="group"
          key={key}
          className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 md:p-6 dark:border-gray-800 dark:bg-white/3"
        >
          <span className="flex size-12 items-center justify-center rounded-xl bg-gray-100 text-brand-500 dark:bg-gray-800">
            <Icon className="size-6" />
          </span>
          <span className="mt-5 block text-sm text-gray-500 dark:text-gray-400">
            {label}
          </span>
          <span className="mt-2 block text-title-sm font-bold break-words text-gray-800 tabular-nums dark:text-white/90">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

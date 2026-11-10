import type { ReactNode } from "react";
import {
  Card as BCard,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  CallIcon,
  PencilIcon,
  ChevronRightIcon,
  SearchIcon,
  ChatIcon,
  ClockIcon,
} from "@/icons";
import { LocationIcon, NativeWalletIcon } from "@/icons/native-operation";
export const icons = {
  back: ArrowLeftIcon,
  phone: CallIcon,
  edit: PencilIcon,
  details: ChevronRightIcon,
  search: SearchIcon,
  map: LocationIcon,
  chat: ChatIcon,
  wallet: NativeWalletIcon,
  history: ClockIcon,
};
export const button =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-brand-500 dark:border-gray-700";
export const input =
  "min-h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-base dark:border-gray-700";
export function Card({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <BCard>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </BCard>
  );
}
export function Pair({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap justify-between gap-2 border-b border-gray-100 py-2 dark:border-gray-800">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="min-w-0 font-medium break-words">{children}</span>
    </div>
  );
}
export function Action({
  label,
  kind,
  onClick,
}: {
  label: string;
  kind: keyof typeof icons;
  onClick: () => void;
}) {
  const Icon = icons[kind];
  const compact = ["phone", "edit", "details", "search", "chat"].includes(kind);
  return (
    <Button
      type="button"
      variant="outline"
      size={compact ? "icon-lg" : "lg"}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      <Icon aria-hidden="true" />
      {!compact && <span>{label}</span>}
    </Button>
  );
}

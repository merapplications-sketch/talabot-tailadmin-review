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
  MapIcon,
} from "@/icons";
import { Field, FieldTitle, FieldContent } from "@/components/ui/field";
export const icons = {
  back: ArrowLeftIcon,
  phone: CallIcon,
  edit: PencilIcon,
  details: ChevronRightIcon,
  search: SearchIcon,
  map: MapIcon,
  chat: ChatIcon,
  wallet: null,
  history: ClockIcon,
};
export function Card({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <BCard size="sm" className="gap-3 rounded-2xl shadow-theme-xs sm:gap-5">
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-2 sm:space-y-4">{children}</CardContent>
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
    <Field orientation="horizontal">
      <FieldTitle className="font-normal text-gray-500 dark:text-gray-400">{label}</FieldTitle>
      <FieldContent className="min-w-0 font-medium text-gray-800 dark:text-gray-200">{children}</FieldContent>
    </Field>
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
  const compact = [
    "phone",
    "edit",
    "details",
    "search",
    "chat",
    "map",
  ].includes(kind);
  return (
    <Button
      type="button"
      variant={kind === "details" ? "ghost" : "outline"}
      size={compact ? "icon-lg" : "lg"}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {Icon && <Icon aria-hidden="true" />}
      {!compact && <span>{label}</span>}
    </Button>
  );
}

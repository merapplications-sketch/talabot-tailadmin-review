"use client";
import { useTranslations } from "next-intl";
import type { OrderStatus } from "../orders-data";
import {
  CheckCircleIcon,
  XIcon,
  TruckDeliveryIcon,
  BoxIcon,
  ClockIcon,
} from "@/icons";
export function OrderStatusBadge({ value }: { value: OrderStatus }) {
  const t = useTranslations("talabotOrders");
  const Icon =
    value === "delivered"
      ? CheckCircleIcon
      : value === "cancelled" || value === "rejected"
        ? XIcon
        : value === "pickedup"
          ? TruckDeliveryIcon
          : value === "ready"
            ? BoxIcon
            : ClockIcon;
  return (
    <span className="tp-status" data-status={value}>
      <Icon aria-hidden="true" />
      {t(`status.${value}`)}
    </span>
  );
}

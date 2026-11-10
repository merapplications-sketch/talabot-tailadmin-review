import { findOrder, tables, text } from "./domain";
import { formatDate } from "./format";
import type { NotificationRecord } from "../workspace";
import type { NotificationItem } from "@/layout/header/notification-dropdown/types";
// Explicit fictional examples, as in B. Not a rule that generates operational alerts.
// The record and linked detail always refer to the same isolated A order.
export function nativeNotifications(locale: string) {
  const records: NotificationRecord[] = ["ord3", "ord5"].flatMap((id) => {
    const order = findOrder(id);
    if (!order || !["pickedup", "cancelled"].includes(text(order, "status")))
      return [];
    const store = tables.stores.find((s) => s.id === order.store_id);
    return [
      {
        id: "native-" + id,
        order: {
          id,
          merchant: store ? text(store, "name") : "",
          status: text(order, "status") as "pickedup" | "cancelled",
          updated: formatDate(text(order, "created_at"), locale),
        },
      },
    ];
  });
  const items: NotificationItem[] = records.map(({ id, order }, i) => ({
    id,
    name: order.id,
    avatar: "",
    actionKey:
      order.status === "cancelled" ? "cancellationReview" : "deliveryIssue",
    project: order.merchant,
    timeKey: "minAgo",
    timeCount: 5 + i * 3,
    status: "offline",
  }));
  return { records, items };
}

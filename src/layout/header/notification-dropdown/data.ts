import { NotificationItem } from "./types";
import { notices } from "@/components/talabot/directories-data";
// Manually chosen fictional examples, never automatic escalation rules.
export const notifications: NotificationItem[] = notices.map(
  ({ id, order }, i) => ({
    id,
    name: order.id,
    avatar: "",
    actionKey:
      order.status === "cancelled" ? "cancellationReview" : "deliveryIssue",
    project: order.merchant,
    timeKey: "minAgo",
    timeCount: 5 + i * 3,
    status: "offline",
  }),
);

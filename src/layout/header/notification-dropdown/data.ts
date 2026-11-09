import { NotificationItem } from "./types";

// Synthetic examples only; no live status evaluation or escalation timers.
export const notifications: NotificationItem[] = Array.from(
  { length: 8 },
  (_, index) => ({
    id: String(index + 1),
    name: `DEMO-${1042 + index}`,
    avatar: "",
    actionKey: index % 2 === 0 ? "deliveryIssue" : "cancellationReview",
    project: index % 2 === 0 ? "Demo Bistro" : "Demo Kitchen",
    timeKey: "minAgo",
    timeCount: 5 + index * 3,
    status: "offline",
  }),
);

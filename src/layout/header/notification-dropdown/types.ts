export interface NotificationItem {
  id: string;
  name: string;
  avatar: string;
  actionKey: "deliveryIssue" | "cancellationReview";
  project: string;
  timeKey: "minAgo" | "hrAgo";
  timeCount: number;
  status: "online" | "offline" | "busy";
}

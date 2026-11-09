import { Suspense } from "react";
import { NotificationsPage } from "@/components/talabot/workspace";
export default function Page() {
  return (
    <Suspense>
      <NotificationsPage />
    </Suspense>
  );
}

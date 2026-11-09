import { Suspense } from "react";
import { AnalyticsPage } from "@/components/talabot/workspace";
export default function Page() {
  return (
    <Suspense>
      <AnalyticsPage kind="reports" />
    </Suspense>
  );
}

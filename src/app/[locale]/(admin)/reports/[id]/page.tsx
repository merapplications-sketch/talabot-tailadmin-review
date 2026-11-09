import { Suspense } from "react";
import { AnalyticsPage } from "@/components/talabot/workspace";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense>
      <AnalyticsPage kind="reports" id={id} />
    </Suspense>
  );
}

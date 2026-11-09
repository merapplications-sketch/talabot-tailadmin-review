import { Suspense } from "react";
import { NotificationsPage } from "@/components/talabot/workspace";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense>
      <NotificationsPage id={id} />
    </Suspense>
  );
}

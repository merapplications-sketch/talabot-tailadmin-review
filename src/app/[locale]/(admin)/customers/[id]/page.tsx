import { Suspense } from "react";
import { DirectoryPage } from "@/components/talabot/workspace";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense>
      <DirectoryPage kind="customers" id={id} />
    </Suspense>
  );
}

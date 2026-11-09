import { Suspense } from "react";
import { OrderDetails } from "@/components/talabot/orders";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense>
      <OrderDetails id={id} />
    </Suspense>
  );
}

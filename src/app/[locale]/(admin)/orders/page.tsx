import { Suspense } from "react";
import { OrdersList } from "@/components/talabot/orders";
export default function Page() {
  return (
    <Suspense>
      <OrdersList />
    </Suspense>
  );
}

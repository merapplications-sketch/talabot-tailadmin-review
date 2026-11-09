import { Suspense } from "react";
import { DirectoryPage } from "@/components/talabot/workspace";
export default function Page() {
  return (
    <Suspense>
      <DirectoryPage kind="customers" />
    </Suspense>
  );
}

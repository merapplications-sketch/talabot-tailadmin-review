import { Suspense } from "react";
import { SettingsPage } from "@/components/talabot/workspace";
export default function Page() {
  return (
    <Suspense>
      <SettingsPage />
    </Suspense>
  );
}

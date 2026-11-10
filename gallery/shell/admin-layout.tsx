"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import "@/components/talabot/integrated-review/polish.css";
import AppHeader from "./app-header";
import AppSidebar from "./app-sidebar";

export default function AdminLayout({
  children,
  header,
}: {
  header: React.ComponentProps<typeof AppHeader>;
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarProvider className="talabot-polish">
        <AppSidebar />

        <SidebarInset>
          <AppHeader {...header} />

          <div className="mx-auto w-full max-w-(--breakpoint-2xl) p-4 pb-[calc(6rem+env(safe-area-inset-bottom))] md:p-6 md:pb-[calc(6rem+env(safe-area-inset-bottom))] xl:pb-6">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

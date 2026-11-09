"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  PreviewProvider,
  MobileNavigation,
} from "@/components/talabot/preview";
import AppHeader from "@/layout/app-layout/header";
import AppSidebar from "@/layout/app-layout/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PreviewProvider>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          <AppHeader />

          <div className="mx-auto w-full max-w-(--breakpoint-2xl) p-4 pb-[calc(6rem+env(safe-area-inset-bottom))] md:p-6 md:pb-[calc(6rem+env(safe-area-inset-bottom))] xl:pb-6">
            {children}
          </div>
        </SidebarInset>
        <MobileNavigation />
      </SidebarProvider>
    </PreviewProvider>
  );
}

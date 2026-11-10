"use client";

import { SidebarHeader } from "@/components/ui/sidebar";
import { Link } from "@gallery/shell/router";
import { cn } from "@/utils";
import TalabotLogo from "@gallery/shell/logo";

interface AppSidebarHeaderProps {
  showContent: boolean;
}

export default function AppSidebarHeader({
  showContent,
}: AppSidebarHeaderProps) {
  return (
    <SidebarHeader className="px-5 py-8">
      <Link
        href="/"
        className={cn(
          "flex items-center",
          !showContent ? "justify-center" : "justify-start",
        )}
      >
        <TalabotLogo compact={!showContent} />
      </Link>
    </SidebarHeader>
  );
}

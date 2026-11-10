"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Link } from "@/components/talabot/native/b-shell/router";
import { HorizontalDotsIcon, MenuTwoIcon, XIcon } from "@/icons";

import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import TalabotLogo from "@/components/talabot/native/b-shell/logo";
import { useState } from "react";

export default function AppHeader({
  controls,
  notifications,
}: {
  controls: React.ReactNode;
  notifications: React.ReactNode;
}) {
  const t = useTranslations("header");
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { openMobile, toggleSidebar } = useSidebar();

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 flex w-full shrink-0 border-gray-200 bg-white xl:border-b dark:border-gray-800 dark:bg-gray-900">
      <div className="flex grow flex-col items-center justify-between xl:flex-row xl:px-6">
        {/* Left side content */}
        <div className="flex w-full items-center justify-between gap-2 border-b border-gray-200 px-3 py-3 sm:gap-4 xl:justify-normal xl:border-b-0 xl:px-0 xl:py-4 dark:border-gray-800">
          <Button
            variant="outline"
            size="icon"
            className="text-gray-500 lg:size-11 dark:text-gray-400"
            onClick={toggleSidebar}
            aria-label={t("toggleSidebar")}
          >
            {openMobile ? (
              <XIcon className="size-6" />
            ) : (
              <MenuTwoIcon className="size-auto! rtl:-scale-x-100" />
            )}
          </Button>

          <Link href="/" className="xl:hidden">
            <TalabotLogo />
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleApplicationMenu}
            aria-label={t("toggleMenu")}
            className="text-gray-700 xl:hidden dark:text-gray-400"
          >
            <HorizontalDotsIcon />
          </Button>
        </div>

        {/* Right side content */}
        <div
          className={cn(
            "flex w-full items-center justify-between gap-4 px-5 py-4 shadow-theme-md xl:flex xl:justify-end xl:px-0 xl:shadow-none",
            isApplicationMenuOpen ? "flex" : "hidden",
          )}
        >
          <div className="flex items-center gap-2 2xsm:gap-3">
            {notifications}
          </div>
          {controls}
        </div>
      </div>
    </header>
  );
}

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import {
  BellIcon,
  BoxIcon,
  DollarIcon,
  LayoutGridIcon,
  CartIcon,
  TruckDeliveryIcon,
  UsersIcon,
  BarChartIcon,
  GearIcon,
} from "@/icons";
import { useSidebar } from "@/components/ui/sidebar";

// Synthetic design persona only. No real account, permission, or financial data.
// A future backend must authorize both routes and data independently.
export const previewPersona = { canViewFinance: true };
export type Destination =
  | "orders"
  | "drivers"
  | "restaurants"
  | "customers"
  | "notifications"
  | "finance"
  | "reports"
  | "settings";
const PreviewContext = createContext<(destination: Destination) => void>(
  () => {},
);
export const usePreview = () => useContext(PreviewContext);

export function PreviewProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <PreviewContext.Provider value={(next) => router.push(`/${next}`)}>
      {children}
    </PreviewContext.Provider>
  );
}

export function PreviewNotice() {
  const t = useTranslations("talabot");
  return (
    <p
      className="text-xs text-gray-500 dark:text-gray-400"
      data-testid="preview-notice"
    >
      {t("preview")} {t("languageNote")}
    </p>
  );
}

export function SummaryCards() {
  const t = useTranslations("talabot");
  const show = usePreview();
  const cards = [
    { key: "orders", label: "activeOrders", value: "24", Icon: BoxIcon },
    {
      key: "drivers",
      label: "availableDrivers",
      value: "12",
      Icon: TruckDeliveryIcon,
    },
    {
      key: "restaurants",
      label: "openRestaurants",
      value: "18",
      Icon: CartIcon,
    },
    { key: "customers", label: "customers", value: "3,782", Icon: UsersIcon },
  ] as const;
  return (
    <div
      className="grid grid-cols-2 gap-4 md:gap-6 xl:grid-cols-4"
      data-testid="summary-cards"
    >
      {cards.map(({ key, label, value, Icon }) => (
        <button
          type="button"
          key={key}
          onClick={() => show(key)}
          className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 md:p-6 dark:border-gray-800 dark:bg-white/3"
        >
          <span className="flex size-12 items-center justify-center rounded-xl bg-gray-100 text-brand-500 dark:bg-gray-800">
            <Icon className="size-6" />
          </span>
          <span className="mt-5 block text-sm text-gray-500 dark:text-gray-400">
            {t(label)}
          </span>
          <span className="mt-2 block text-title-sm font-bold break-words text-gray-800 tabular-nums dark:text-white/90">
            {value}
          </span>
        </button>
      ))}
    </div>
  );
}

export function NeedsAttention() {
  const router = useRouter();
  const t = useTranslations("talabot");
  // Illustrative, manually authored examples, not operational alert rules or timers.
  const examples = [
    {
      id: "DEMO-1103",
      restaurant: "Demo Bistro",
      reason: "deliveryIssue",
      time: "12:10",
    },
    {
      id: "DEMO-1106",
      restaurant: "Demo Bistro",
      reason: "cancellationReview",
      time: "12:15",
    },
  ] as const;
  return (
    <section
      aria-labelledby="attention-title"
      className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3"
      data-testid="needs-attention"
    >
      <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <h2
          id="attention-title"
          className="text-lg font-semibold text-gray-800 dark:text-white/90"
        >
          {t("attention")}
        </h2>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {t("examples")}
        </p>
      </div>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {examples.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => router.push(`/orders/${item.id}`)}
              className="grid w-full grid-cols-2 gap-2 px-5 py-4 text-start text-sm hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-brand-500 sm:grid-cols-4 dark:hover:bg-white/3"
            >
              <span className="font-medium text-gray-800 dark:text-white/90">
                {item.id}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {item.restaurant}
              </span>
              <span className="text-gray-600 dark:text-gray-300">
                {t(item.reason)}
              </span>
              <span className="text-gray-500 tabular-nums dark:text-gray-400">
                {t("exampleTime", { time: item.time })}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PreviewSidebar({ showContent }: { showContent: boolean }) {
  const t = useTranslations("talabot");
  const show = usePreview();
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const items = [
    ["orders", BoxIcon],
    ["restaurants", CartIcon],
    ["drivers", TruckDeliveryIcon],
    ["customers", UsersIcon],
    ["finance", DollarIcon],
    ["reports", BarChartIcon],
    ["notifications", BellIcon],
    ["settings", GearIcon],
  ] as const;
  return (
    <nav aria-label={t("navigation")} className="mb-6 space-y-1">
      <Link
        href="/"
        onClick={() => setOpenMobile(false)}
        aria-current={pathname === "/" ? "page" : undefined}
        className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm ${pathname === "/" ? "text-brand-500" : "text-gray-700 dark:text-gray-300"}`}
      >
        <LayoutGridIcon className="size-6 shrink-0" />
        {showContent && t("home")}
      </Link>
      {items
        .filter(([key]) => key !== "finance" || previewPersona.canViewFinance)
        .map(([key, Icon]) => (
          <button
            key={key}
            type="button"
            aria-label={t(key)}
            aria-current={pathname.startsWith(`/${key}`) ? "page" : undefined}
            onClick={() => {
              setOpenMobile(false);
              requestAnimationFrame(() => show(key));
            }}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-start text-sm hover:bg-gray-100 dark:hover:bg-white/5 ${pathname.startsWith(`/${key}`) ? "text-brand-500" : "text-gray-700 dark:text-gray-300"}`}
          >
            <Icon className="size-6 shrink-0" />
            {showContent && t(key)}
          </button>
        ))}
    </nav>
  );
}

export function MobileNavigation({
  canViewFinance = previewPersona.canViewFinance,
}: {
  canViewFinance?: boolean;
}) {
  const t = useTranslations("talabot");
  const show = usePreview();
  const pathname = usePathname();
  const { openMobile } = useSidebar();
  const [keyboard, setKeyboard] = useState(false);
  useEffect(() => {
    let pointerDown = false;
    let frame = 0;
    const beginPointer = () => {
      pointerDown = true;
    };
    const endPointer = () => {
      pointerDown = false;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };
    const sync = () => {
      // Do not insert the fixed bar between pointer-down and click when a
      // field loses focus: it can cover a link at the bottom of the viewport.
      if (pointerDown) return;
      const focused = document.activeElement;
      const editing =
        focused instanceof HTMLElement &&
        (focused.matches("input,textarea,select") || focused.isContentEditable);
      // Hide during input focus, including Safari's keyboard accessory bar.
      setKeyboard(editing);
    };
    document.addEventListener("pointerdown", beginPointer, true);
    document.addEventListener("click", endPointer, true);
    document.addEventListener("pointerup", endPointer, true);
    document.addEventListener("pointercancel", endPointer, true);
    document.addEventListener("focusin", sync);
    document.addEventListener("focusout", sync);
    window.visualViewport?.addEventListener("resize", sync);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", beginPointer, true);
      document.removeEventListener("click", endPointer, true);
      document.removeEventListener("pointerup", endPointer, true);
      document.removeEventListener("pointercancel", endPointer, true);
      document.removeEventListener("focusin", sync);
      document.removeEventListener("focusout", sync);
      window.visualViewport?.removeEventListener("resize", sync);
    };
  }, []);
  if (keyboard || openMobile) return null;
  const items = [
    ["orders", BoxIcon],
    ["notifications", BellIcon],
    ["finance", DollarIcon],
  ] as const;
  return (
    <nav
      aria-label={t("mobileNavigation")}
      data-testid="mobile-navigation"
      className="talabot-bottom-nav fixed inset-x-0 bottom-0 z-40 flex border-t border-gray-200 bg-white px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] xl:hidden dark:border-gray-800 dark:bg-gray-900"
    >
      <Link
        href="/"
        aria-current={pathname === "/" ? "page" : undefined}
        className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-2 text-xs ${pathname === "/" ? "text-brand-500" : "text-gray-500 dark:text-gray-400"}`}
      >
        <LayoutGridIcon className="size-5" />
        {t("home")}
      </Link>
      {items
        .filter(([key]) => key !== "finance" || canViewFinance)
        .map(([key, Icon]) => (
          <button
            key={key}
            type="button"
            onClick={() => show(key)}
            aria-current={pathname.startsWith(`/${key}`) ? "page" : undefined}
            className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-2 text-xs ${pathname.startsWith(`/${key}`) ? "text-brand-500" : "text-gray-500 dark:text-gray-400"}`}
          >
            <Icon className="size-5" />
            {t(key)}
          </button>
        ))}
    </nav>
  );
}

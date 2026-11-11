import {
  BarChartIcon,
  BoxIcon,
  CartIcon,
  TruckDeliveryIcon,
  UsersIcon,
  ChatIcon,
  TextIcon,
  StarIcon,
  LayoutGridIcon,
  TagIcon,
  TargetIcon,
  ClockIcon,
  UserIcon,
} from "@/icons";
import type { NavItem } from "./types";
export const sections = [
  "home",
  "orders",
  "restaurants",
  "drivers",
  "customers",
  "support",
  "texts",
  "ratings",
  "banners",
  "promotions",
  "loyalty",
  "log",
  "staff",
  "reports",
];
const icons = [
  LayoutGridIcon,
  BoxIcon,
  CartIcon,
  TruckDeliveryIcon,
  UsersIcon,
  ChatIcon,
  TextIcon,
  StarIcon,
  LayoutGridIcon,
  TagIcon,
  TargetIcon,
  ClockIcon,
  UserIcon,
  BarChartIcon,
];
export const navItems: NavItem[] = sections.map((key, i) => {
  const Icon = icons[i];
  return {
    key: "native_" + key,
    path: "/" + key,
    icon: <Icon className="size-6" />,
  };
});
export const othersItems: NavItem[] = [];
export const supportItems: NavItem[] = [];

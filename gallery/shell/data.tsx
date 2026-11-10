import { ListIcon } from "@/icons";
import type { NavItem } from "./types";
import decisions from "../decisions.json";
export const navItems: NavItem[] = decisions.map((d) => ({
  key: d.id,
  path: "/" + d.id,
  icon: <ListIcon className="size-6" />,
}));
export const othersItems: NavItem[] = [];
export const supportItems: NavItem[] = [];

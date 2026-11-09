import { GlobeIcon, UsFlagIcon } from "@/icons";
import type { Locale } from "./routing";
export interface Language {
  id: Locale;
  name: string;
  shortName: string;
  dir: "ltr" | "rtl";
  FlagIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: string;
}
export const languages: Language[] = [
  {
    id: "en",
    name: "English",
    shortName: "English",
    dir: "ltr",
    FlagIcon: UsFlagIcon,
  },
  {
    id: "ru",
    name: "Русский",
    shortName: "Русский",
    dir: "ltr",
    FlagIcon: GlobeIcon,
  },
  {
    id: "tg",
    name: "Тоҷикӣ",
    shortName: "Тоҷикӣ",
    dir: "ltr",
    FlagIcon: GlobeIcon,
  },
];
export function getLanguage(locale: Locale): Language {
  return languages.find((l) => l.id === locale) || languages[0];
}
export function isRtl(locale: Locale): boolean {
  return getLanguage(locale).dir === "rtl";
}

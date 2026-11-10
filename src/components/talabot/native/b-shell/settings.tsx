import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@/context/theme-context";
// B workspace SettingsPage section and Select presentation; local locale bridge only.
export function SettingsPresentation() {
  const locale = useLocale(),
    t = useTranslations("workspace"),
    { themeMode, setThemeMode } = useTheme();
  const input =
    "mt-2 block min-h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-base dark:border-gray-700 dark:[color-scheme:dark]";
  return (
    <section className="grid gap-6 rounded-2xl border border-gray-200 bg-white p-5 md:grid-cols-2 md:p-6 dark:border-gray-800 dark:bg-white/3">
      <label className="block min-w-0 text-sm">
        {t("language")}
        <select
          aria-label={t("language")}
          className={`${input} pe-10`}
          value={locale}
          onChange={(e) => {
            localStorage.setItem("ux02-native:locale", e.target.value);
            window.dispatchEvent(new Event("native-locale"));
          }}
        >
          <option value="en">English</option>
          <option value="ru">Русский</option>
          <option value="tg">Тоҷикӣ</option>
        </select>
      </label>
      <label className="block min-w-0 text-sm">
        {t("theme")}
        <select
          aria-label={t("theme")}
          className={`${input} pe-10`}
          value={themeMode}
          onChange={(e) =>
            setThemeMode(e.target.value as "light" | "dark" | "auto")
          }
        >
          {["light", "dark", "auto"].map((v) => (
            <option key={v} value={v}>
              {t(v)}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}

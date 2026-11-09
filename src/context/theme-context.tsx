"use client";
import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
type ThemeMode = "light" | "dark" | "auto";
type ResolvedTheme = "light" | "dark";
type ThemeContextType = {
  theme: ResolvedTheme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const eventName = "talabot-theme-preference";
function readMode(): ThemeMode {
  const value =
    localStorage.getItem("theme-mode") || localStorage.getItem("theme");
  return value === "dark" || value === "auto" ? value : "light";
}
function subscribe(notify: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  window.addEventListener("storage", notify);
  window.addEventListener(eventName, notify);
  media.addEventListener("change", notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(eventName, notify);
    media.removeEventListener("change", notify);
  };
}
function readDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function setThemeMode(mode: ThemeMode) {
  localStorage.setItem("theme-mode", mode);
  window.dispatchEvent(new Event(eventName));
}
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const themeMode = useSyncExternalStore(
    subscribe,
    readMode,
    () => "light" as const,
  );
  const systemDark = useSyncExternalStore(subscribe, readDark, () => false);
  const theme: ResolvedTheme =
    themeMode === "auto" ? (systemDark ? "dark" : "light") : themeMode;
  useEffect(() => {
    // Read the browser snapshot directly so the hydration fallback never overwrites saved preference.
    const actualMode = readMode();
    const resolved =
      actualMode === "auto" ? (readDark() ? "dark" : "light") : actualMode;
    localStorage.setItem("theme-mode", actualMode);
    localStorage.setItem("theme", resolved);
    document.documentElement.classList.toggle("dark", resolved === "dark");
    document.documentElement.setAttribute("data-color-scheme", resolved);
  }, [themeMode, systemDark]);
  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        setThemeMode,
        toggleTheme: () => setThemeMode(theme === "light" ? "dark" : "light"),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}

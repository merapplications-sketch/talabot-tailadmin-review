"use client";
import { useEffect, useState } from "react";
function stored(): string[] {
  try {
    const value = JSON.parse(
      sessionStorage.getItem("talabot-read-notices") || "[]",
    );
    return Array.isArray(value)
      ? value.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}
export function useReadNotices() {
  const [read, setRead] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => {
      setRead(stored());
    };
    sync();
    window.addEventListener("talabot-notices", sync);
    return () => window.removeEventListener("talabot-notices", sync);
  }, []);
  return {
    read,
    mark: (id: string) => {
      const ids = stored();
      sessionStorage.setItem(
        "talabot-read-notices",
        JSON.stringify([...new Set([...ids, id])]),
      );
      window.dispatchEvent(new Event("talabot-notices"));
    },
  };
}

"use client";
import { useSyncExternalStore } from "react";
const MOBILE_QUERY = "(max-width: 1279px)";
function subscribe(notify: () => void) {
  const media = window.matchMedia(MOBILE_QUERY);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}
function getSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches;
}
export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

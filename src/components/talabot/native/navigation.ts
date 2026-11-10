import { useCallback, useEffect, useState } from "react";
import { listState } from "./domain";
import { nativeHref } from "./b-route";
export function useNativeNavigation() {
  const [state, setState] = useState(() => listState(location.search));
  const savePosition = () =>
    sessionStorage.setItem(
      "ux02-native:scroll:" + location.search,
      String(scrollY),
    );
  const restorePosition = () =>
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        window.scrollTo(
          0,
          Number(
            sessionStorage.getItem("ux02-native:scroll:" + location.search) ||
              0,
          ),
        ),
      ),
    );
  const navigate = useCallback(
    (patch: Partial<typeof state>, replace = false) => {
      savePosition();
      const prev = state,
        next = { ...prev, ...patch };
      const p = new URLSearchParams(location.search);
      if (patch.section && patch.section !== prev.section) {
        for (const key of [...p.keys()]) p.delete(key);
        if (patch.id) p.set("return", location.search);
      }
      for (const [key, value] of Object.entries(next)) {
        const param = key === "query" ? "q" : key;
        if (value && (key !== "status" || value !== "all")) p.set(param, value);
        else p.delete(param);
      }
      window.history[replace ? "replaceState" : "pushState"]({}, "", `?${p}`);
      setState(next);
      window.scrollTo(0, 0);
    },
    [state],
  );
  const back = () => {
    savePosition();
    const p = new URLSearchParams(location.search),
      origin = p.get("return");
    if (origin?.startsWith("?")) {
      window.history.replaceState({}, "", origin);
      setState(listState(origin));
      restorePosition();
    } else {
      navigate({ id: "" }, true);
      restorePosition();
    }
  };
  useEffect(() => {
    const restore = () => {
      setState(listState(location.search));
      restorePosition();
    };
    addEventListener("popstate", restore);
    return () => removeEventListener("popstate", restore);
  }, []);
  const href = (url: string, replace = false, scroll = true) => {
    savePosition();
    const next = nativeHref(url);
    window.history[replace ? "replaceState" : "pushState"]({}, "", next);
    setState(listState(next));
    if (scroll) window.scrollTo(0, 0);
  };
  return { state, navigate, back, href };
}

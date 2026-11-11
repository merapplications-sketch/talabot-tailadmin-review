import { useCallback, useEffect, useState } from "react";
import { listState } from "./domain";
import { nativeHref } from "./b-route";
export function useNativeNavigation() {
  const [state, setState] = useState(() => listState(location.search));
  const savePosition = () => {
    sessionStorage.setItem(
      "ux02-native:scroll:" + location.search,
      String(scrollY),
    );
    const current = listState(location.search);
    if (current.section === "orders" && !current.id)
      sessionStorage.setItem("ux02-native:orders-list", location.search);
  };
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
        next =
          patch.section && patch.section !== prev.section
            ? {
                section: patch.section,
                id: "",
                query: "",
                status: "all",
                ...patch,
              }
            : { ...prev, ...patch };
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
      const transition = prev.section !== next.section || prev.id !== next.id;
      window.history[replace || !transition ? "replaceState" : "pushState"](
        replace || !transition ? window.history.state : { ux02Parent: true },
        "",
        `?${p}`,
      );
      setState(next);
      if (!next.id) window.scrollTo(0, 0);
    },
    [state],
  );
  const back = () => {
    savePosition();
    if (window.history.state?.ux02Parent) {
      window.history.back();
      return;
    }
    const p = new URLSearchParams(location.search),
      origin = p.get("return");
    if (origin?.startsWith("?")) {
      window.history.replaceState({}, "", origin);
      setState(listState(origin));
      restorePosition();
    } else {
      navigate(
        state.id
          ? { id: "" }
          : { section: "home", id: "", query: "", status: "all" },
        true,
      );
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
    const requested = nativeHref(url);
    const saved = sessionStorage.getItem("ux02-native:orders-list");
    const resume =
      state.section !== "orders" &&
      requested === "?section=orders" &&
      saved?.startsWith("?") &&
      listState(saved).section === "orders" &&
      !listState(saved).id;
    const next = resume && saved ? saved : requested;
    const target = listState(next);
    const transition =
      state.section !== target.section || state.id !== target.id;
    window.history[replace || !transition ? "replaceState" : "pushState"](
      replace || !transition ? window.history.state : { ux02Parent: true },
      "",
      next,
    );
    setState(listState(next));
    if (resume) restorePosition();
    else if (scroll && !target.id) window.scrollTo(0, 0);
  };
  return {
    state,
    navigate,
    back,
    href,
    canBack:
      !!window.history.state?.ux02Parent ||
      state.section !== "home" ||
      !!state.id,
  };
}

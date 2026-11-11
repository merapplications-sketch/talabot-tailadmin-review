import { createContext, useContext, type AnchorHTMLAttributes } from "react";
import { bRoute, nativeHref } from "../b-route";
interface RouteBridge {
  section: string;
  search: string;
  go: (section: string) => void;
  href: (href: string, replace?: boolean, scroll?: boolean) => void;
}
export const NativeRouteContext = createContext<RouteBridge>({
  section: "home",
  search: "",
  go: () => {},
  href: () => {},
});
export function usePathname() {
  return bRoute(useContext(NativeRouteContext).search).path;
}
export function useSearchParams() {
  return bRoute(useContext(NativeRouteContext).search).params;
}
export function useRouter() {
  const { href } = useContext(NativeRouteContext);
  return {
    push: (url: string, options?: { scroll?: boolean }) =>
      href(url, false, options?.scroll),
    replace: (url: string, options?: { scroll?: boolean; locale?: string }) =>
      href(url, true, options?.scroll),
  };
}
export function Link({
  href = "/",
  onClick,
  scroll,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { scroll?: boolean }) {
  const route = useContext(NativeRouteContext);
  return (
    <a
      {...props}
      href={nativeHref(String(href))}
      onClick={(e) => {
        onClick?.(e);
        if (
          !e.defaultPrevented &&
          !e.metaKey &&
          !e.ctrlKey &&
          !e.shiftKey &&
          e.button === 0
        ) {
          e.preventDefault();
          route.href(String(href), false, scroll);
        }
      }}
    />
  );
}

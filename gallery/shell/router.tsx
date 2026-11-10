import { createContext, useContext, type AnchorHTMLAttributes } from "react";
interface RouteBridge {
  section: string;
  go: (section: string) => void;
}
export const NativeRouteContext = createContext<RouteBridge>({
  section: "D01",
  go: () => {},
});
export function usePathname() {
  return "/" + useContext(NativeRouteContext).section;
}
export function Link({
  href,
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { go } = useContext(NativeRouteContext);
  return (
    <a
      {...props}
      href={"?decision=" + (href === "/" ? "D01" : href?.replace(/^\//, ""))}
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
          go(href === "/" ? "D01" : String(href).replace(/^\//, ""));
        }
      }}
    />
  );
}

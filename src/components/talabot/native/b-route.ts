// Route adaptation only: keep B's links/query state inside the single native root.
const sections = new Set([
  "home",
  "reports",
  "orders",
  "restaurants",
  "drivers",
  "customers",
  "support",
  "texts",
  "ratings",
  "banners",
  "promotions",
  "loyalty",
  "log",
  "staff",
  "notifications",
]);
export function nativeHref(href: string): string {
  const url = new URL(href, "https://native.invalid");
  if (url.origin !== "https://native.invalid")
    throw new Error("external_route");
  const [section = "home", id] = url.pathname.split("/").filter(Boolean);
  if (!sections.has(section)) throw new Error("unsupported_route");
  const p = new URLSearchParams(url.search);
  p.set("section", section);
  if (id) p.set("id", id);
  else p.delete("id");
  const origin = p.get("returnTo");
  p.delete("returnTo");
  if (origin) p.set("return", nativeHref(origin));
  return "?" + p;
}
export function bRoute(search: string) {
  const p = new URLSearchParams(search),
    section = p.get("section") || "home",
    id = p.get("id");
  for (const key of ["section", "id", "return", "qa"]) p.delete(key);
  return { path: "/" + section + (id ? "/" + id : ""), params: p };
}

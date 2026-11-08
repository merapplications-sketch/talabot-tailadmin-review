import { readFile } from "node:fs/promises";
import svgr from "@svgr/webpack";
import type { Plugin } from "vite";

/** Match the existing Next.js SVG component convention using its pinned loader. */
export function svgComponents(): Plugin {
  return {
    name: "tailadmin-svg-components",
    enforce: "pre",
    async load(id) {
      // Explicit ?url / ?raw imports stay under Vite's asset handling.
      if (
        !id.endsWith(".svg") ||
        !id.replaceAll("\\", "/").includes("/src/icons/")
      ) {
        return null;
      }

      const svg = await readFile(id, "utf8");
      const code = await new Promise<string>((resolve, reject) => {
        // This loader path consumes SVG text, so it only needs these three APIs.
        const context = {
          resourcePath: id,
          getOptions: () => ({}),
          async: () => (error: Error | null, result: string) => {
            if (error) reject(error);
            else resolve(result);
          },
        } as ThisParameterType<typeof svgr>;
        svgr.call(context, svg);
      });
      return { code, map: null };
    },
  };
}

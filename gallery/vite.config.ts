import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { svgComponents } from "../config/svg-components";
export default defineConfig({
  root: path.resolve("gallery"),
  publicDir: false,
  resolve: {
    alias: {
      "@/i18n/navigation": path.resolve("gallery/shell/router.tsx"),
      "@gallery": path.resolve("gallery"),
      "@": path.resolve("src"),
    },
  },
  plugins: [svgComponents(), react()],
  build: { outDir: path.resolve("dist"), emptyOutDir: true },
  server: { host: "0.0.0.0", fs: { allow: [path.resolve(".")] } },
});

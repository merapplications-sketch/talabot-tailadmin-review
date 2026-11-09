// Hosting adapter only: preserve the compiled vinext Worker and original assets.
import {
  cpSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from "node:fs";
const built = ".cloudflare/output/v0/workers/default";
const config = JSON.parse(readFileSync(`${built}/worker.config.json`, "utf8"));
if (config.name !== "talabot-tailadmin-review")
  throw new Error("Unexpected build target");
rmSync("dist", { recursive: true, force: true });
mkdirSync("dist/server", { recursive: true });
cpSync(`${built}/bundle`, "dist/server", { recursive: true });
cpSync(`${built}/assets`, "dist/client", { recursive: true });
mkdirSync("dist/.openai", { recursive: true });
const hosting = JSON.parse(readFileSync(".openai/hosting.json", "utf8"));
writeFileSync("dist/.openai/hosting.json", JSON.stringify(hosting, null, 2));
console.log(
  "Prepared unchanged vinext modules and assets for isolated hosting.",
);

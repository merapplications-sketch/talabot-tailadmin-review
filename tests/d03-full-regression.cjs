const fs = require("fs"),
  path = require("path"),
  { spawn } = require("child_process");
const src = fs.readFileSync("tests/full-regression.cjs", "utf8");
const suites = JSON.parse(
  src.match(/const suites = (\[[^;]+\]);/)[1].replaceAll("'", '"'),
);
const out = process.env.REGRESSION_OUTPUT;
fs.mkdirSync(out, { recursive: true });
let n = 0;
const results = [];
async function worker() {
  while (n < suites.length) {
    const suite = suites[n++],
      dir = path.resolve(out, suite.replace(/\.[^.]+$/, ""));
    fs.mkdirSync(dir, { recursive: true });
    const log = fs.openSync(path.join(out, suite + ".log"), "w"),
      start = Date.now();
    const exitCode = await new Promise((resolve) => {
      const child = spawn(process.execPath, ["tests/" + suite], {
        stdio: ["ignore", log, log],
        env: { ...process.env, LOCAL: "1", QA_OUTPUT_DIR: dir },
      });
      const timer = setTimeout(() => child.kill("SIGTERM"), 300000);
      child.on("exit", (code) => {
        clearTimeout(timer);
        resolve(code);
      });
    });
    fs.closeSync(log);
    results.push({ suite, exitCode, durationMs: Date.now() - start });
    fs.writeFileSync(
      path.join(out, "results.json"),
      JSON.stringify({ base: process.env.BASE_URL, results }, null, 2),
    );
    console.log(exitCode === 0 ? "PASS" : "FAIL", suite);
  }
}
Promise.all(Array.from({ length: 3 }, worker)).then(() => {
  process.exitCode = results.some((r) => r.exitCode !== 0) ? 1 : 0;
});

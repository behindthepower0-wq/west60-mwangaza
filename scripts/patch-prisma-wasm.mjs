// Swaps Prisma's default "fast" query compiler for the "small" variant.
// The small WASM keeps the worker bundle under Cloudflare's free-plan
// size limit (3 MiB gzipped). Runs after `prisma generate`.
import fs from "node:fs";
import path from "node:path";

const dir = path.join("node_modules", ".prisma", "client");
const smallBase64Path = path.join(dir, "query_compiler_small_bg.wasm-base64.js");

function reorderConditions(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;
  for (const key of Object.keys(obj)) obj[key] = reorderConditions(obj[key]);
  const conditionKeys = ["workerd", "worker", "edge-light", "node", "browser", "default", "require", "import"];
  if (conditionKeys.some((k) => k in obj)) {
    const rank = (k) => (k === "workerd" ? 0 : k === "worker" ? 1 : k === "node" ? 2 : 3);
    const reordered = Object.keys(obj).sort((a, b) => rank(a) - rank(b));
    const next = {};
    for (const key of reordered) next[key] = obj[key];
    return next;
  }
  return obj;
}

function patchPackageJson() {
  const pkgPath = path.join(dir, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  if (pkg.exports) pkg.exports = reorderConditions(pkg.exports);
  if (pkg.imports) pkg.imports = reorderConditions(pkg.imports);
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

const targets = [
  "index.js",
  "edge.js",
  "default.js",
  "wasm-worker-loader.mjs",
  "wasm-edge-light-loader.mjs",
];

for (const name of targets) {
  const filePath = path.join(dir, name);
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, "utf8");
  if (!content.includes("query_compiler_small_bg")) {
    fs.writeFileSync(
      filePath,
      content.replaceAll("query_compiler_fast_bg", "query_compiler_small_bg"),
    );
  }
}

if (!fs.existsSync(smallBase64Path)) {
  const wasm = fs.readFileSync(path.join(dir, "query_compiler_small_bg.wasm"));
  fs.writeFileSync(
    smallBase64Path,
    `const wasm = "${wasm.toString("base64")}";\nmodule.exports = { wasm };\n`,
  );
}

patchPackageJson();

console.log("[patch-prisma-wasm] Using query_compiler_small_bg");

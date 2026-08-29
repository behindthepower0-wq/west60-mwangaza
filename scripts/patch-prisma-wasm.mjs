// Swaps Prisma's default "fast" query compiler for the "small" variant.
// The small WASM keeps the worker bundle under Cloudflare's free-plan
// size limit (3 MiB gzipped). Runs after `prisma generate`.
import fs from "node:fs";
import path from "node:path";

const dir = path.join("node_modules", ".prisma", "client");
const indexPath = path.join(dir, "index.js");
const smallBase64Path = path.join(dir, "query_compiler_small_bg.wasm-base64.js");

let index = fs.readFileSync(indexPath, "utf8");
if (!index.includes("query_compiler_small_bg")) {
  const patched = index.replaceAll(
    "query_compiler_fast_bg",
    "query_compiler_small_bg",
  );
  fs.writeFileSync(indexPath, patched);
}

if (!fs.existsSync(smallBase64Path)) {
  const wasm = fs.readFileSync(path.join(dir, "query_compiler_small_bg.wasm"));
  fs.writeFileSync(
    smallBase64Path,
    `const wasm = "${wasm.toString("base64")}";\nmodule.exports = { wasm };\n`,
  );
}

console.log("[patch-prisma-wasm] Using query_compiler_small_bg");

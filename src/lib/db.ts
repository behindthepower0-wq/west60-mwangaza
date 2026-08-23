// eslint-disable-next-line @typescript-eslint/no-require-imports
import type { PrismaClient as PrismaClientType } from "@prisma/client";

// ─── Cloudflare D1 client ─────────────────────────────────────────
let _cfClient: PrismaClientType | null = null;

function createD1Client(): PrismaClientType {
  if (_cfClient) return _cfClient;
  // getCloudflareContext() is only available in Cloudflare Workers runtime
  // In local dev it will throw, so we fall back to SQLite
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getCloudflareContext } = require("@opennextjs/cloudflare");
  const { env } = getCloudflareContext();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaD1 } = require("@prisma/adapter-d1");
  const adapter = new PrismaD1(env.DB);
  // Use the edge-compatible client to avoid WASM issues on Workers
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require("@prisma/client/edge");
  _cfClient = new PrismaClient({ adapter });
  return _cfClient!;
}

// ─── Local SQLite client ───────────────────────────────────────────
let _localClient: PrismaClientType | null = null;

function createLocalClient(): PrismaClientType {
  if (_localClient) return _localClient;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("node:path");
  const dbPath = path.join(process.cwd(), "prisma", "west60.db");
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require("@prisma/client");
  _localClient = new PrismaClient({ adapter });
  return _localClient!;
}

// ─── Smart resolver ────────────────────────────────────────────────
function isCloudflareWorkers(): boolean {
  return (
    typeof navigator !== "undefined" &&
    navigator.userAgent === "Cloudflare-Workers"
  );
}

function resolveClient(): PrismaClientType {
  // Only use Cloudflare D1 when actually running on Workers.
  // initOpenNextCloudflareForDev() makes getCloudflareContext() work in
  // local dev too (against an empty miniflare D1), so we must not rely
  // on it throwing to detect local development.
  if (isCloudflareWorkers()) {
    try {
      return createD1Client();
    } catch {
      // Fall through to local SQLite
    }
  }
  return createLocalClient();
}

// ─── Proxy that lazily resolves and delegates ──────────────────────
// This lets the rest of the codebase keep using `import prisma from "@/lib/db"`
// and calling `prisma.model.findMany(...)` without any changes.
const prisma = new Proxy({} as unknown as PrismaClientType, {
  get(_target, prop, _receiver) {
    const client = resolveClient();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === "function") {
      return (...args: unknown[]) => (value as Function).apply(client, args);
    }
    return value;
  },
});

export default prisma;

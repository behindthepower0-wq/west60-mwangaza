import { PrismaClient } from "@prisma/client";

// ─── Cloudflare D1 client ─────────────────────────────────────────
let _cfClient: PrismaClient | null = null;

function createD1Client(): PrismaClient {
  if (_cfClient) return _cfClient;
  // getCloudflareContext() is only available in Cloudflare Workers runtime
  // In local dev it will throw, so we fall back to SQLite
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getCloudflareContext } = require("@opennextjs/cloudflare");
  const { env } = getCloudflareContext();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaD1 } = require("@prisma/adapter-d1");
  const adapter = new PrismaD1(env.DB);
  _cfClient = new PrismaClient({ adapter });
  return _cfClient;
}

// ─── Local SQLite client ───────────────────────────────────────────
let _localClient: PrismaClient | null = null;

function createLocalClient(): PrismaClient {
  if (_localClient) return _localClient;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("node:path");
  const dbPath = path.join(process.cwd(), "prisma", "west60.db");
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  _localClient = new PrismaClient({ adapter });
  return _localClient;
}

// ─── Smart resolver ────────────────────────────────────────────────
function resolveClient(): PrismaClient {
  // Try Cloudflare first — it will throw if not in Workers runtime
  try {
    return createD1Client();
  } catch {
    // Not in Cloudflare — use local SQLite
  }
  return createLocalClient();
}

// ─── Proxy that lazily resolves and delegates ──────────────────────
// This lets the rest of the codebase keep using `import prisma from "@/lib/db"`
// and calling `prisma.model.findMany(...)` without any changes.
const prisma = new Proxy({} as unknown as PrismaClient, {
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

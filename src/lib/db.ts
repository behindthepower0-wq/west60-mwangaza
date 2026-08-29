// eslint-disable-next-line @typescript-eslint/no-require-imports
import type { PrismaClient as PrismaClientType } from "@prisma/client";

// ─── Turso (libSQL) client for production ──────────────────────────
let _tursoClient: PrismaClientType | null = null;

function createTursoClient(): PrismaClientType {
  if (_tursoClient) return _tursoClient;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set");
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaLibSql } = require("@prisma/adapter-libsql");

  // Convert libsql:// to https:// for Vercel serverless (no WebSocket)
  const httpsUrl = url.startsWith("libsql://") ? "https://" + url.slice(9) : url;
  const adapter = new PrismaLibSql({ url: httpsUrl, authToken });
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require("@prisma/client");
  _tursoClient = new PrismaClient({ adapter });
  return _tursoClient!;
}

// ─── Cloudflare D1 client (fallback) ──────────────────────────────
let _cfClient: PrismaClientType | null = null;

function createD1Client(): PrismaClientType {
  if (_cfClient) return _cfClient;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getCloudflareContext } = require("@opennextjs/cloudflare");
  const { env } = getCloudflareContext();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaD1 } = require("@prisma/adapter-d1");
  const adapter = new PrismaD1(env.DB);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require("@prisma/client");
  _cfClient = new PrismaClient({ adapter });
  return _cfClient!;
}

// ─── Local SQLite client for dev ───────────────────────────────────
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
  // 1. Turso — when TURSO_DATABASE_URL is set (Vercel production)
  if (process.env.TURSO_DATABASE_URL) {
    try {
      return createTursoClient();
    } catch (e) {
      console.error("[db] Turso client failed:", e instanceof Error ? e.message : e);
      // Fall through
    }
  }

  // 2. Cloudflare D1 — when running on Workers
  if (isCloudflareWorkers()) {
    try {
      return createD1Client();
    } catch {
      // Fall through
    }
  }

  // 3. Local SQLite — development
  return createLocalClient();
}

// ─── Proxy that lazily resolves and delegates ──────────────────────
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

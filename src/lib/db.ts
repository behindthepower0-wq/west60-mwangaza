// eslint-disable-next-line @typescript-eslint/no-require-imports
import type { PrismaClient as PrismaClientType } from "@prisma/client";

// ─── PostgreSQL client (Supabase / any Postgres) ───────────────────
let _pgClient: PrismaClientType | null = null;

function createPgClient(): PrismaClientType {
  if (_pgClient) return _pgClient;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL must be set for PostgreSQL");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaPg } = require("@prisma/adapter-pg");
  const adapter = new PrismaPg({ connectionString: url });
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require("@prisma/client");
  _pgClient = new PrismaClient({ adapter });
  return _pgClient!;
}

// ─── Turso (libSQL) client ────────────────────────────────────────
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

  const httpsUrl = url.startsWith("libsql://") ? "https://" + url.slice(9) : url;
  const adapter = new PrismaLibSql({ url: httpsUrl, authToken });
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require("@prisma/client");
  _tursoClient = new PrismaClient({ adapter });
  return _tursoClient!;
}

// ─── Cloudflare D1 client ──────────────────────────────────────────
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
  const dbUrl = process.env.DATABASE_URL;

  // 1. PostgreSQL — when DATABASE_URL is postgres:// or postgresql://
  if (dbUrl && (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://"))) {
    try {
      return createPgClient();
    } catch (e) {
      console.error("[db] PostgreSQL client failed:", e instanceof Error ? e.message : e);
      console.error("[db] Full error:", e);
    }
  }

  // 2. Cloudflare D1 — canonical DB when running on Workers
  if (isCloudflareWorkers()) {
    try {
      return createD1Client();
    } catch (e) {
      console.error("[db] D1 client failed:", e instanceof Error ? e.message : e);
    }
  }

  // 3. Turso — when TURSO_DATABASE_URL is set
  if (process.env.TURSO_DATABASE_URL) {
    try {
      return createTursoClient();
    } catch (e) {
      console.error("[db] Turso client failed:", e instanceof Error ? e.message : e);
    }
  }

  // 4. Local SQLite — development
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

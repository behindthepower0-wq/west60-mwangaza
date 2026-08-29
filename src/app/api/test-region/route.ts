import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "";
  let password = "";
  let projectRef = "srisvchdkfzazzkmrzzt";

  try {
    const parsed = new URL(dbUrl);
    password = parsed.password;
  } catch {
    return NextResponse.json({ error: "Cannot parse DATABASE_URL" });
  }

  const { Pool } = await import("pg");

  const tests: Array<[string, string]> = [
    // Transaction-mode pooler (port 6543) with postgres. prefix
    [`postgresql://postgres.${projectRef}:${password}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`, "tx-pooler-us-east-1"],
    [`postgresql://postgres.${projectRef}:${password}@aws-0-eu-west-1.pooler.supabase.com:6543/postgres`, "tx-pooler-eu-west-1"],
    [`postgresql://postgres.${projectRef}:${password}@aws-0-eu-west-2.pooler.supabase.com:6543/postgres`, "tx-pooler-eu-west-2"],
    [`postgresql://postgres.${projectRef}:${password}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`, "tx-pooler-eu-central-1"],
    [`postgresql://postgres.${projectRef}:${password}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`, "tx-pooler-ap-southeast-1"],
    [`postgresql://postgres.${projectRef}:${password}@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres`, "tx-pooler-ap-northeast-1"],
    // Session-mode pooler (port 5432)
    [`postgresql://postgres.${projectRef}:${password}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`, "sess-pooler-us-east-1"],
    [`postgresql://postgres.${projectRef}:${password}@aws-0-eu-west-1.pooler.supabase.com:5432/postgres`, "sess-pooler-eu-west-1"],
    // Direct connection (IPv4)
    [`postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres?sslmode=require`, "direct-ssl"],
  ];

  const results: Record<string, string> = {};

  for (const [connStr, label] of tests) {
    const pool = new Pool({ connectionString: connStr, connectionTimeoutMillis: 8000, query_timeout: 8000 });
    try {
      const start = Date.now();
      await pool.query("SELECT 1 as ok");
      const ms = Date.now() - start;
      results[label] = `OK (${ms}ms)`;
      await pool.end();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      results[label] = msg.substring(0, 200);
      await pool.end().catch(() => {});
    }
  }

  return NextResponse.json(results);
}

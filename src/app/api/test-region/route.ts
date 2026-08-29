import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "";
  const password = dbUrl.match(/:(.+)@/)?.[1] || "";
  const projectRef = "srisvchdkfzazzkmrzzt";

  const { Pool } = await import("pg");

  const tests: Array<[string, string]> = [
    // Direct connection
    [`postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`, "direct"],
    // Pooler with different username formats
    [`postgresql://postgres:${password}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`, "pooler-no-ref"],
    [`postgresql://postgres.${projectRef}:${password}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`, "pooler-us-east-1"],
    [`postgresql://postgres.${projectRef}:${password}@aws-0-eu-west-1.pooler.supabase.com:6543/postgres`, "pooler-eu-west-1"],
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
      results[label] = msg.substring(0, 120);
      await pool.end().catch(() => {});
    }
  }

  return NextResponse.json(results);
}

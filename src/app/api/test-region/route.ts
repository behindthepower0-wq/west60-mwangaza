import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "";
  let password = "";
  let projectRef = "srisvchdkfzazzkmrzzt";

  try {
    const parsed = new URL(dbUrl);
    password = parsed.password;
    // Extract project ref from hostname if present (e.g. db.srisvchdkfzazzkmrzzt.supabase.co)
    const hostMatch = parsed.hostname.match(/db\.([^.]+)\.supabase/);
    if (hostMatch) projectRef = hostMatch[1];
  } catch {
    return NextResponse.json({ error: "Cannot parse DATABASE_URL", urlPrefix: dbUrl.substring(0, 30) });
  }

  const { Pool } = await import("pg");

  const tests: Array<[string, string]> = [
    [`postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`, "direct-v4"],
    [`postgresql://postgres.${projectRef}:${password}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`, "pooler-us-east-1"],
    [`postgresql://postgres.${projectRef}:${password}@aws-0-eu-west-1.pooler.supabase.com:6543/postgres`, "pooler-eu-west-1"],
    [`postgresql://postgres:${password}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`, "pooler-no-ref"],
  ];

  const results: Record<string, string> = {};

  for (const [connStr, label] of tests) {
    const pool = new Pool({ connectionString: connStr, connectionTimeoutMillis: 10000, query_timeout: 10000 });
    try {
      const start = Date.now();
      await pool.query("SELECT 1 as ok");
      const ms = Date.now() - start;
      results[label] = `OK (${ms}ms)`;
      await pool.end();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      results[label] = msg.substring(0, 150);
      await pool.end().catch(() => {});
    }
  }

  return NextResponse.json(results);
}

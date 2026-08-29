import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "";
  const password = dbUrl.match(/:(.+)@/)?.[1] || "";
  const projectRef = "srisvchdkfzazzkmrzzt";
  const regions = [
    "us-east-1", "us-east-2", "us-west-1", "us-west-2",
    "eu-west-1", "eu-west-2", "eu-west-3", "eu-central-1",
    "ap-southeast-1", "ap-southeast-2", "ap-northeast-1",
    "ap-south-1", "sa-east-1", "ca-central-1",
  ];

  const { Pool } = await import("pg");

  const tests = regions.map(async (region) => {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const connStr = `postgresql://postgres.${projectRef}:${password}@${host}:6543/postgres`;
    const pool = new Pool({ connectionString: connStr, connectionTimeoutMillis: 5000, query_timeout: 5000 });
    try {
      const start = Date.now();
      await pool.query("SELECT 1");
      const ms = Date.now() - start;
      await pool.end();
      return [region, `OK (${ms}ms)`];
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      await pool.end().catch(() => {});
      if (msg.includes("tenant") || msg.includes("IDENTIFIER")) {
        return [region, "TENANT_NOT_FOUND"];
      } else if (msg.includes("ENOTFOUND")) {
        return [region, "DNS_FAIL"];
      } else {
        return [region, msg.substring(0, 60)];
      }
    }
  });

  const results = Object.fromEntries(await Promise.all(tests));
  return NextResponse.json(results);
}

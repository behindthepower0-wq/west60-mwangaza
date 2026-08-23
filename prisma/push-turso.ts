import { createClient } from "@libsql/client";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Convert turso:// to libsql:// for the client
const rawUrl = process.env.TURSO_DATABASE_URL!;
const url = rawUrl.replace(/^turso:\/\//, "libsql://");
const authToken = process.env.TURSO_AUTH_TOKEN!;

console.log("URL:", url.replace(authToken, "***"));

async function main() {
  console.log("🔗 Connecting to Turso...");
  const client = createClient({ url, authToken });

  // Test connection
  const test = await client.execute("SELECT 1 as ok");
  console.log("✅ Connection OK:", test.rows);

  // Read the migration SQL
  const migrationPath = join(process.cwd(), "prisma", "migrations", "0001_init", "migration.sql");
  const migrationSQL = readFileSync(migrationPath, "utf-8");

  console.log("📦 Pushing schema to Turso...");

  // Strip comment lines so statement splitting works correctly
  const cleaned = migrationSQL
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");

  const statements = cleaned
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Found ${statements.length} statements`);

  let successCount = 0;
  let skipCount = 0;
  for (const stmt of statements) {
    try {
      await client.execute(stmt);
      successCount++;
    } catch (e: any) {
      if (e.message?.includes("already exists")) {
        skipCount++;
      } else {
        console.error(`Error: ${stmt.substring(0, 100)}...`);
        console.error(e.message);
        process.exitCode = 1;
      }
    }
  }

  console.log(`✅ Schema pushed! ${successCount} executed, ${skipCount} skipped`);

  // Verify tables
  const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log("📋 Tables:", tables.rows.map((r) => r.name).join(", "));
}

main().catch((e) => {
  console.error("❌ Push failed:", e);
  process.exit(1);
});

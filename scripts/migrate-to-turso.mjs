/**
 * Turso Migration Script
 *
 * Exports data from local SQLite (prisma/west60.db) to Turso.
 *
 * Prerequisites:
 *   1. Install Turso CLI: https://docs.turso.tech/cli/installation
 *   2. Authenticate: turso auth login
 *   3. Create database: turso db create west60-mwangaza
 *   4. Get token: turso db tokens create west60-mwangaza
 *
 * Usage:
 *   TURSO_DATABASE_URL="libsql://west60-mwangaza-[org].turso.io" \
 *   TURSO_AUTH_TOKEN="your-token" \
 *   node scripts/migrate-to-turso.mjs
 */
import { createClient } from "@libsql/client";
import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;
const LOCAL_DB = path.join(process.cwd(), "prisma", "west60.db");

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error("Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN");
  process.exit(1);
}

if (!fs.existsSync(LOCAL_DB)) {
  console.error(`Local DB not found: ${LOCAL_DB}`);
  process.exit(1);
}

// Tables in dependency order (children first)
const TABLES = [
  "activity_logs",
  "content_revisions",
  "posts",
  "categories",
  "page_sections",
  "pages",
  "property_images",
  "property_features",
  "property_amenities",
  "properties",
  "project_images",
  "project_features",
  "projects",
  "services",
  "homepage_sections",
  "navigation_items",
  "site_settings",
  "testimonials",
  "seo_metadata",
  "enquiries",
  "media",
  "users",
];

async function main() {
  console.log("Local DB:", LOCAL_DB);
  console.log("Turso URL:", TURSO_URL);

  const local = new Database(LOCAL_DB, { readonly: true });
  const turso = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

  // Count rows
  let totalRows = 0;
  for (const table of TABLES) {
    try {
      const { rows } = await turso.execute(`SELECT COUNT(*) as c FROM "${table}"`);
      totalRows += Number(rows[0]?.c ?? 0);
    } catch {
      // Table might not exist yet
    }
  }
  console.log(`Turso currently has ${totalRows} rows.`);

  // Export from local
  let exported = 0;
  for (const table of TABLES) {
    const stmt = local.prepare(`SELECT * FROM "${table}"`);
    const rows = stmt.all();
    if (rows.length === 0) continue;

    // Get column names from first row
    const columns = Object.keys(rows[0]);
    const placeholders = columns.map(() => "?").join(", ");

    // Batch insert (50 at a time for SQLite limit)
    const BATCH = 50;
    for (let i = 0; i < rows.length; i += BATCH) {
      const batch = rows.slice(i, i + BATCH);
      const values = batch.flatMap((row) =>
        columns.map((col) => row[col] === null ? null : String(row[col]))
      );

      const stmt = `INSERT OR REPLACE INTO "${table}" (${columns.map((c) => `"${c}"`).join(", ")}) VALUES ${batch.map(() => `(${placeholders})`).join(", ")}`;
      await turso.execute({ sql: stmt, args: values });
    }

    console.log(`  ${table}: ${rows.length} rows`);
    exported += rows.length;
  }

  console.log(`\nDone! Exported ${exported} rows to Turso.`);
  local.close();
}

main().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});

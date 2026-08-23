import { createClient } from "@libsql/client";
import Database from "better-sqlite3";

const url = process.env.TURSO_DATABASE_URL!.replace(/^turso:\/\//, "libsql://");
const authToken = process.env.TURSO_AUTH_TOKEN!;
const turso = createClient({ url, authToken });
const local = new Database("prisma/west60.db", { readonly: true });

const tables = (
  local
    .prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%' ORDER BY name"
    )
    .all() as { name: string }[]
).map((r) => r.name);

async function main() {
let totalRows = 0;
for (const table of tables) {
  const existing = await turso.execute(
    `SELECT COUNT(*) as n FROM "${table}"`
  );
  const existingCount = Number(existing.rows[0].n);
  const cols = local.prepare(`PRAGMA table_info("${table}")`).all() as {
    name: string;
    type: string;
  }[];
  const rows = local.prepare(`SELECT * FROM "${table}"`).all() as Record<
    string,
    unknown
    >[];

  if (rows.length === 0) continue;

  // Convert JS values for libsql: booleans -> 0/1, Dates -> ISO strings, undefined -> null
  const colNames = cols.map((c) => c.name);
  const placeholders = colNames.map(() => "?").join(", ");
  const insertSQL = `INSERT INTO "${table}" (${colNames
    .map((c) => `"${c}"`)
    .join(", ")}) VALUES (${placeholders})`;

  let inserted = 0;
  let skipped = 0;
  for (const row of rows) {
    const values = colNames.map((c) => {
      const v = row[c];
      if (v === undefined) return null;
      if (typeof v === "boolean") return v ? 1 : 0;
      if (v instanceof Date) return v.toISOString();
      return v as string | number | bigint | Uint8Array | null;
    });
    try {
      await turso.execute({ sql: insertSQL, args: values });
      inserted++;
    } catch (e: any) {
      if (e.message?.includes("UNIQUE") || e.message?.includes("already exists")) {
        skipped++;
      } else {
        console.error(`  ❌ ${table}: ${e.message}`);
      }
    }
  }
  totalRows += inserted;
  console.log(
    `${table}: ${inserted} inserted, ${skipped} skipped (${existingCount} pre-existing)`
  );
}
console.log(`\n✅ Done — ${totalRows} total rows copied to Turso`);
}

main().catch((e) => {
  console.error("❌ Copy failed:", e);
  process.exit(1);
});

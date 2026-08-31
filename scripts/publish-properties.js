const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.resolve(__dirname, "..", ".env.local");
  const env = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
    }
  }
  return env;
}

const env = loadEnv();
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  // First check current state
  const { data: before, count } = await supabase
    .from("properties")
    .select("id, name, is_published", { count: "exact" });

  console.log("Current properties:");
  for (const p of before || []) {
    console.log(`  ${p.is_published ? "PUBLISHED" : "UNPUBLISHED"}  ${p.name} (id: ${p.id})`);
  }

  // Update all unpublished properties to published
  const { data, error } = await supabase
    .from("properties")
    .update({ is_published: true })
    .eq("is_published", false)
    .select("id, name");

  if (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }

  console.log(`\nUpdated ${data?.length || 0} properties to published.`);

  // Verify
  const { data: after } = await supabase
    .from("properties")
    .select("name, is_published");

  console.log("\nProperties after update:");
  for (const p of after || []) {
    console.log(`  ${p.is_published ? "PUBLISHED" : "UNPUBLISHED"}  ${p.name}`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

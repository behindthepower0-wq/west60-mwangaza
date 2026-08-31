const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Load .env.local manually
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
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      env[key] = value;
    }
  }
  return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const users = [
  { name: "Sylvia Mwangi", email: "sylvia.mwangi@west60mwangaza.com", password: "Xk9#mB2$vL7q" },
  { name: "Raymond", email: "raymond@west60mwangaza.com", password: "Hp4@nR8#wY3t" },
  { name: "Jacinta", email: "jacinta@west60mwangaza.com", password: "Qw6$jM5#bN9x" },
  { name: "Esther", email: "esther@west60mwangaza.com", password: "Vc3#kL7@mP2s" },
  { name: "Dickson", email: "dickson@west60mwangaza.com", password: "Fg8#tY4#hJ6n" },
  { name: "Jackson", email: "jackson@west60mwangaza.com", password: "Za2#xB9#dW5r" },
  { name: "Aphia", email: "aphia@west60mwangaza.com", password: "Ln7#eK3#uT8q" },
];

async function main() {
  console.log("Creating 7 content staff accounts...\n");

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 12);

    const { data, error } = await supabase
      .from("users")
      .insert({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: "CONTENT_STAFF",
        status: "ACTIVE",
      })
      .select("id, name, email, role")
      .single();

    if (error) {
      console.error(`  FAILED  ${user.name} (${user.email}): ${error.message}`);
    } else {
      console.log(`  OK      ${data.name} <${data.email}> [${data.role}] (id: ${data.id})`);
    }
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

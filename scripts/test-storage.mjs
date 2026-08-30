import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sb = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const buffer = readFileSync("public/images/team/pamela-mbaabu.jpg");
const path = `team/test-${Date.now()}.jpg`;

try {
  const { data, error } = await sb.storage
    .from("uploads")
    .upload(path, buffer, { contentType: "image/jpeg", upsert: true });
  if (error) throw error;
  const { data: pd } = sb.storage.from("uploads").getPublicUrl(path);
  console.log("upload OK:", pd.publicUrl);
} catch (e) {
  console.error("STORAGE FAIL:", e.message);
}

// test sharp resize path
try {
  const sharp = (await import("sharp")).default;
  const meta = await sharp(buffer).metadata();
  console.log("sharp metadata OK:", meta.width, meta.height);
  const resized = await sharp(buffer)
    .resize({ width: 400, height: 400, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 78, progressive: true })
    .toBuffer();
  console.log("sharp resize OK, bytes:", resized.length);
} catch (e) {
  console.error("SHARP FAIL:", e.message);
}

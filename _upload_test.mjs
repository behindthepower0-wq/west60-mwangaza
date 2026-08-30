// Reproduce the deployed upload flow end-to-end with auth
const base = "https://west60-mwangaza.vercel.app";

async function getCsrf(session) {
  const r = await fetch(`${base}/api/auth/csrf`, { headers: { cookie: session.cookie } });
  return r.json();
}

async function login() {
  // start a session to get csrf cookie
  const r0 = await fetch(`${base}/api/auth/csrf`);
  const { csrfToken } = await r0.json();
  const setCookies = (r0.headers.getSetCookie && r0.headers.getSetCookie()) || [];
  const csrfCookie = setCookies.map((c) => c.split(";")[0]).join("; ");
  const cookie = csrfCookie;

  // POST credentials
  const body = new URLSearchParams();
  body.set("csrfToken", csrfToken);
  body.set("email", "admin@west60mwangaza.com");
  body.set("password", "West60Admin@2026");
  body.set("json", "true");

  const r = await fetch(`${base}/api/auth/callback/credentials`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", cookie },
    body: body.toString(),
    redirect: "manual",
  });

  const all = (r.headers.getSetCookie && r.headers.getSetCookie()) || [];
  const sessionCookie = all.map((c) => c.split(";")[0]).join("; ") || cookie;
  return sessionCookie;
}

const cookie = await login();
console.log("cookie length:", cookie.length, "has session:", cookie.includes("session-token"));

// Read a real image file
const fs = await import("node:fs");
const img = fs.readFileSync("public/images/team/pamela-mbaabu.jpg");

// Upload via /api/upload
const fd = new FormData();
fd.append("file", new Blob([img], { type: "image/jpeg" }), "pamela-test.jpg");
fd.append("category", "TEAM");

const up = await fetch(`${base}/api/upload`, { method: "POST", headers: { cookie }, body: fd });
const upText = await up.text();
console.log("UPLOAD status:", up.status);
console.log("UPLOAD body:", upText.slice(0, 300));
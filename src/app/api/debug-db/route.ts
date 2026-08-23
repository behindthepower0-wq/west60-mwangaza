import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const steps: Record<string, unknown> = {};

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    const ctx = getCloudflareContext();
    steps.contextOk = true;
    steps.hasDB = !!ctx?.env?.DB;
    steps.dbKeys = ctx?.env ? Object.keys(ctx.env) : [];
  } catch (e) {
    steps.contextError = e instanceof Error ? e.message : String(e);
  }

  if (steps.hasDB) {
    try {
      const r = await (steps.hasDB
        ? // eslint-disable-next-line @typescript-eslint/no-require-imports
          (() => {
            const { getCloudflareContext } = require("@opennextjs/cloudflare");
            return getCloudflareContext().env.DB.prepare(
              "SELECT COUNT(*) AS n FROM team_members"
            ).first();
          })()
        : null);
      steps.rawCount = r;
    } catch (e) {
      steps.rawError = e instanceof Error ? e.message : String(e);
    }
  }

  // Check env vars
  steps.env = {
    hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
    hasTursoToken: !!process.env.TURSO_AUTH_TOKEN,
    tursoUrlPrefix: process.env.TURSO_DATABASE_URL?.substring(0, 30) || null,
    hasNextauthSecret: !!process.env.NEXTAUTH_SECRET,
    hasNextauthUrl: !!process.env.NEXTAUTH_URL,
    hasNextPublicSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
  };

  // Test raw HTTP fetch to Turso (bypassing @libsql/client)
  try {
    const rawUrl = process.env.TURSO_DATABASE_URL || "";
    const httpsUrl = rawUrl.startsWith("libsql://") ? "https://" + rawUrl.slice(9) : rawUrl;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    const resp = await fetch(httpsUrl + "/v2/pipeline", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + authToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [{ type: "execute", stmt: { sql: "SELECT COUNT(*) as n FROM team_members" } }]
      })
    });
    const data = await resp.json();
    steps.rawFetchOk = resp.status === 200;
    steps.rawFetchStatus = resp.status;
    steps.rawFetchBody = JSON.stringify(data).substring(0, 500);
    // Mask auth token for debugging
    steps.tursoUrlUsed = httpsUrl;
    steps.tursoTokenLength = authToken?.length || 0;
    steps.tursoTokenPrefix = authToken?.substring(0, 10) || "none";
  } catch (e) {
    steps.rawFetchError = e instanceof Error ? e.message : String(e);
  }

  try {
    const prisma = (await import("@/lib/db")).default;
    const members = await prisma.teamMember.findMany({ take: 2 });
    steps.prismaOk = true;
    steps.members = members.map((m: { id: string; name: string }) => ({
      id: m.id,
      name: m.name,
    }));
  } catch (e) {
    steps.prismaError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(steps);
}

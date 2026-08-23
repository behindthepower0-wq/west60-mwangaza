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

  // Test direct libsql connection (bypassing Prisma)
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require("@libsql/client");
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    const client = createClient({ url, authToken });
    const result = await client.execute("SELECT COUNT(*) as n FROM team_members");
    steps.directLibsqlOk = true;
    steps.directLibsqlCount = Number(result.rows[0].n);
  } catch (e) {
    steps.directLibsqlError = e instanceof Error ? e.message : String(e);
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

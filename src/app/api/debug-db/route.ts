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

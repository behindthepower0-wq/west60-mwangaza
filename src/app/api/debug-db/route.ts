import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const steps: Record<string, unknown> = {};

  // Check env vars
  steps.env = {
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) || null,
    hasNextauthSecret: !!(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET),
    hasNextauthUrl: !!process.env.NEXTAUTH_URL,
    hasNextPublicSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
  };

  // Test Prisma connection
  try {
    const prisma = (await import("@/lib/db")).default;
    const count = await prisma.teamMember.count();
    steps.prismaOk = true;
    steps.teamMemberCount = count;
  } catch (e) {
    steps.prismaError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(steps);
}

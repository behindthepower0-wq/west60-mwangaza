import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json() as Record<string, string>;

    await Promise.all(
      Object.entries(body).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          create: { key, value, label: key.replace(/_/g, " ") },
          update: { value },
        })
      )
    );

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: (session.user as { id?: string }).id,
        action: "updated",
        entityType: "settings",
        entityLabel: "Website Settings",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings save error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const settings = await prisma.siteSetting.findMany();
  const map: Record<string, string> = {};
  settings.forEach(s => { if (s.value) map[s.key] = s.value; });
  return NextResponse.json(map);
}

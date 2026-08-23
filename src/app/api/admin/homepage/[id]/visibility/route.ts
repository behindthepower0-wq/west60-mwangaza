import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

// PUT /api/admin/homepage/[id]/visibility - Toggle section visibility
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { isVisible } = body;

    if (typeof isVisible !== "boolean") {
      return new NextResponse("isVisible must be a boolean", { status: 400 });
    }

    await prisma.homepageSection.update({
      where: { id },
      data: { isVisible },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[HOMEPAGE_VISIBILITY_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

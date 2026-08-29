import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

// PUT /api/admin/homepage/[id]/content - Update a homepage section's content
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
    const { content } = body;

    if (content === undefined || content === null) {
      return new NextResponse("content is required", { status: 400 });
    }

    // Verify section exists
    const section = await prisma.homepageSection.findUnique({ where: { id } });
    if (!section) {
      return new NextResponse("Section not found", { status: 404 });
    }

    const contentStr = typeof content === "string" ? content : JSON.stringify(content);

    await prisma.homepageSection.update({
      where: { id },
      data: { content: contentStr },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[HOMEPAGE_CONTENT_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

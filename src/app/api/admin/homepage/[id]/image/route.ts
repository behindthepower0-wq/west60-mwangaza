import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

// PUT /api/admin/homepage/[id]/image - Update a homepage section's image
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
    const { imageKey, imageUrl } = body;

    if (!imageKey || !imageUrl) {
      return new NextResponse("imageKey and imageUrl are required", {
        status: 400,
      });
    }

    // Verify section exists
    const section = await prisma.homepageSection.findUnique({ where: { id } });
    if (!section) {
      return new NextResponse("Section not found", { status: 404 });
    }

    // Parse existing content JSON and update the image field
    let content: Record<string, unknown> = {};
    try {
      content = JSON.parse(section.content || "{}");
    } catch {
      content = {};
    }

    // Handle array keys like "heroImages[0]"
    const arrayMatch = imageKey.match(/^(\w+)\[(\d+)\]$/);
    if (arrayMatch) {
      const arrayKey = arrayMatch[1];
      const index = parseInt(arrayMatch[2]);
      const arr = Array.isArray(content[arrayKey])
        ? [...(content[arrayKey] as string[])]
        : [];
      arr[index] = imageUrl;
      content[arrayKey] = arr;
    } else {
      content[imageKey] = imageUrl;
    }

    await prisma.homepageSection.update({
      where: { id },
      data: { content: JSON.stringify(content) },
    });

    // Note: Media library record is already created by /api/upload

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[HOMEPAGE_IMAGE_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

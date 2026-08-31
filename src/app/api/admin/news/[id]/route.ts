import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { slugify } from "@/lib/utils";

// PUT /api/admin/news/[id] - Update an article
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
    const {
      title,
      slug,
      excerpt,
      content,
      tags,
      status,
      isFeatured,
      featuredImage,
    } = body;

    if (!title || !content) {
      return new NextResponse("Title and content are required", { status: 400 });
    }

    const generatedSlug = slug ? slugify(slug) : slugify(title);

    const existing = await prisma.post.findFirst({
      where: { slug: generatedSlug, id: { not: id } },
    });

    if (existing) {
      return new NextResponse("An article with this slug already exists.", {
        status: 400,
      });
    }

    await prisma.post.update({
      where: { id },
      data: {
        title,
        slug: generatedSlug,
        excerpt: excerpt || null,
        content,
        tags: tags || null,
        status: status || "DRAFT",
        isFeatured: isFeatured || false,
        featuredImage: featuredImage !== undefined ? featuredImage : undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[NEWS_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE /api/admin/news/[id] - Delete an article
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    await prisma.post.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[NEWS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

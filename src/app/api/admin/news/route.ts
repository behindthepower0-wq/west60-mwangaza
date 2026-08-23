import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { slugify } from "@/lib/utils";

// GET /api/admin/news - List all news articles
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } }, category: { select: { name: true } } },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("[NEWS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// POST /api/admin/news - Create a new article
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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

    const existing = await prisma.post.findUnique({
      where: { slug: generatedSlug },
    });

    if (existing) {
      return new NextResponse("An article with this slug already exists.", {
        status: 400,
      });
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug: generatedSlug,
        excerpt: excerpt || null,
        content,
        tags: tags || null,
        status: status || "DRAFT",
        isFeatured: isFeatured || false,
        featuredImage: featuredImage || null,
        authorId: (session.user as { id?: string }).id || null,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("[NEWS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { slugify } from "@/lib/utils";

// PUT /api/admin/projects/[id] - Update a project
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
      name,
      slug,
      location,
      description,
      status,
      startDate,
      completionDate,
      isPublished,
      features,
      mainImage,
    } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const generatedSlug = slug ? slugify(slug) : slugify(name);

    const existing = await prisma.project.findFirst({
      where: { slug: generatedSlug, NOT: { id } },
    });

    if (existing) {
      return new NextResponse("A project with this slug already exists.", {
        status: 400,
      });
    }

    await prisma.project.update({
      where: { id },
      data: {
        name,
        slug: generatedSlug,
        location: location || null,
        fullDescription: description || null,
        status: status || "ONGOING",
        startDate: startDate ? new Date(startDate) : null,
        completionDate: completionDate ? new Date(completionDate) : null,
        mainImage: mainImage !== undefined ? mainImage : undefined,
        isPublished: isPublished || false,
        features: {
          deleteMany: {},
          create: features?.map((f: string) => ({ feature: f })) || [],
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PROJECT_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE /api/admin/projects/[id] - Delete a project
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

    await prisma.project.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[PROJECT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

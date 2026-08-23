import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { slugify } from "@/lib/utils";

// GET /api/admin/projects - List all projects
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("[PROJECTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// POST /api/admin/projects - Create a new project
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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

    const existing = await prisma.project.findUnique({
      where: { slug: generatedSlug },
    });

    if (existing) {
      return new NextResponse("A project with this slug already exists.", {
        status: 400,
      });
    }

    const project = await prisma.project.create({
      data: {
        name,
        slug: generatedSlug,
        location: location || null,
        fullDescription: description || null,
        status: status || "ONGOING",
        startDate: startDate ? new Date(startDate) : null,
        completionDate: completionDate ? new Date(completionDate) : null,
        mainImage: mainImage || null,
        isPublished: isPublished || false,
        features: {
          create: features?.map((f: string) => ({ feature: f })) || [],
        },
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("[PROJECTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

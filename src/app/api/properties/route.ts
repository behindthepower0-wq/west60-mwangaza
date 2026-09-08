import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { slugify } from "@/lib/utils";

// GET /api/properties - public list of published properties (for enquiry modals etc.)
export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      where: { isPublished: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        location: true,
        price: true,
        priceLabel: true,
        area: true,
        status: true,
      },
    }).catch(() => []);

    return NextResponse.json(properties);
  } catch (error) {
    console.error("[PROPERTIES_GET]", error);
    return NextResponse.json([], { status: 500 });
  }
}

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
      description,
      price,
      priceLabel,
      currency,
      location,
      area,
      propertyType,
      status,
      size,
      sizeUnit,
      totalPlots,
      soldPlots,
      features,
      isFeatured,
      isPublished,
      mainImage,
    } = body;

    if (!name || !description || !location) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const generatedSlug = slug ? slugify(slug) : slugify(name);

    // Check if slug exists
    const existing = await prisma.property.findUnique({
      where: { slug: generatedSlug },
    });

    if (existing) {
      return new NextResponse("A property with this slug already exists. Please choose a unique name or provide a custom slug.", { status: 400 });
    }

    const property = await prisma.property.create({
      data: {
        name,
        slug: generatedSlug,
        fullDescription: description,
        price: typeof price === "string" ? parseFloat(price) : price,
        priceLabel,
        currency,
        location,
        area,
        propertyType,
        status,
        totalPlots: totalPlots && totalPlots !== '' ? parseInt(totalPlots, 10) : null,
        soldPlots: soldPlots && soldPlots !== '' ? parseInt(soldPlots, 10) : null,
        mainImage: mainImage || null,
        features: {
          create: features?.map((f: string) => ({ feature: f })) || []
        },
        isFeatured: isFeatured || false,
        isPublished: isPublished || false,
      },
    });

    return NextResponse.json(property);
  } catch (error: any) {
    console.error("[PROPERTIES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

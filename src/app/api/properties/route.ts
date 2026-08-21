import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { slugify } from "@/lib/utils";

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
      propertyType,
      status,
      size,
      sizeUnit,
      features,
      isFeatured,
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
        price,
        priceLabel,
        currency,
        location,
        propertyType,
        status,
        area: size ? `${size} ${sizeUnit || ''}`.trim() : null,
        features: {
          create: features?.map((f: string) => ({ feature: f })) || []
        },
        isFeatured: isFeatured || false,
      },
    });

    return NextResponse.json(property);
  } catch (error: any) {
    console.error("[PROPERTIES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

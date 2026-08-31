import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
      isPublished,
      mainImage,
    } = body;

    if (!name || !description || !location) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const generatedSlug = slug ? slugify(slug) : slugify(name);

    // Check if slug exists on another property
    const existing = await prisma.property.findFirst({
      where: { 
        slug: generatedSlug,
        id: { not: id }
      },
    });

    if (existing) {
      return new NextResponse("A property with this slug already exists. Please choose a unique name or provide a custom slug.", { status: 400 });
    }

    const property = await prisma.property.update({
      where: { id },
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
        mainImage: mainImage !== undefined ? mainImage : undefined,
        features: {
          deleteMany: {},
          create: features?.map((f: string) => ({ feature: f })) || []
        },
        isFeatured: isFeatured || false,
        isPublished: isPublished || false,
      },
    });

    return NextResponse.json(property);
  } catch (error: any) {
    console.error("[PROPERTY_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    await prisma.property.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("[PROPERTY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

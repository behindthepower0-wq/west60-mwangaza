import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

// POST /api/properties/[id]/images - Add an image to a property
export async function POST(
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
    const { url, altText, caption, order, setAsMain } = body;

    if (!url) {
      return new NextResponse("URL is required", { status: 400 });
    }

    // Verify property exists
    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
      return new NextResponse("Property not found", { status: 404 });
    }

    // Get the next order value
    const lastImage = await prisma.propertyImage.findFirst({
      where: { propertyId: id },
      orderBy: { order: "desc" },
    });
    const nextOrder = (lastImage?.order ?? -1) + 1;

    // Create the image record
    const image = await prisma.propertyImage.create({
      data: {
        propertyId: id,
        url,
        altText: altText || property.name,
        caption: caption || null,
        order: order ?? nextOrder,
      },
    });

    // If setAsMain, update the property's mainImage
    if (setAsMain) {
      await prisma.property.update({
        where: { id },
        data: { mainImage: url },
      });
    }

    // Note: Media library record is already created by /api/upload

    return NextResponse.json(image);
  } catch (error) {
    console.error("[PROPERTY_IMAGES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE /api/properties/[id]/images - Remove an image from a property
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get("imageId");

    if (!imageId) {
      return new NextResponse("imageId is required", { status: 400 });
    }

    // Verify the image belongs to this property
    const image = await prisma.propertyImage.findFirst({
      where: { id: imageId, propertyId: id },
    });

    if (!image) {
      return new NextResponse("Image not found", { status: 404 });
    }

    await prisma.propertyImage.delete({ where: { id: imageId } });

    // If this was the main image, clear it
    const property = await prisma.property.findUnique({ where: { id } });
    if (property?.mainImage === image.url) {
      // Set the first remaining image as main, or null
      const nextMain = await prisma.propertyImage.findFirst({
        where: { propertyId: id },
        orderBy: { order: "asc" },
      });
      await prisma.property.update({
        where: { id },
        data: { mainImage: nextMain?.url || null },
      });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[PROPERTY_IMAGES_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// PUT /api/properties/[id]/images - Reorder images or set main
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
    const { imageId, setAsMain } = body;

    if (setAsMain && imageId) {
      const image = await prisma.propertyImage.findFirst({
        where: { id: imageId, propertyId: id },
      });
      if (image) {
        await prisma.property.update({
          where: { id },
          data: { mainImage: image.url },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PROPERTY_IMAGES_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

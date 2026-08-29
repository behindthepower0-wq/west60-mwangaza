import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

// PUT /api/admin/testimonials/[id] - Update a testimonial
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
      clientName,
      company,
      position,
      testimonial,
      photograph,
      rating,
      order,
      isVisible,
    } = body;

    if (!clientName || !testimonial) {
      return new NextResponse("Client name and testimonial are required", {
        status: 400,
      });
    }

    await prisma.testimonial.update({
      where: { id },
      data: {
        clientName,
        company: company || null,
        position: position || null,
        testimonial,
        photograph: photograph !== undefined ? photograph : undefined,
        rating: rating || 5,
        order: order ?? 0,
        isVisible: isVisible ?? true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[TESTIMONIAL_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE /api/admin/testimonials/[id] - Delete a testimonial
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

    await prisma.testimonial.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[TESTIMONIAL_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

// GET /api/admin/testimonials - List all testimonials
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("[TESTIMONIALS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// POST /api/admin/testimonials - Create a new testimonial
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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

    const newTestimonial = await prisma.testimonial.create({
      data: {
        clientName,
        company: company || null,
        position: position || null,
        testimonial,
        photograph: photograph || null,
        rating: rating || 5,
        order: order ?? 0,
        isVisible: isVisible ?? true,
      },
    });

    return NextResponse.json(newTestimonial);
  } catch (error) {
    console.error("[TESTIMONIALS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

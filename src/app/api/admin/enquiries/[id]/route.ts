import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

const ENQUIRY_STATUSES = [
  "NEW",
  "CONTACTED",
  "FOLLOW_UP",
  "CONVERTED",
  "CLOSED",
];

// PATCH /api/admin/enquiries/[id] - update status/notes
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { status, notes } = body as { status?: string; notes?: string };

    if (status !== undefined && !ENQUIRY_STATUSES.includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    const data: Record<string, string> = {};
    if (status !== undefined) data.status = status;
    if (notes !== undefined) data.notes = notes;

    if (Object.keys(data).length === 0) {
      return new NextResponse("Nothing to update", { status: 400 });
    }

    const enquiry = await prisma.enquiry.update({
      where: { id },
      data,
    });

    return NextResponse.json(enquiry);
  } catch (error) {
    console.error("[ENQUIRY_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE /api/admin/enquiries/[id] - remove an enquiry
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
    await prisma.enquiry.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ENQUIRY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
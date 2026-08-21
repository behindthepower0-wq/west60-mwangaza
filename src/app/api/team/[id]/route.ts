import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      name,
      position,
      biography,
      qualifications,
      photograph,
      facebookUrl,
      twitterUrl,
      linkedinUrl,
      order,
    } = body;

    const updatedMember = await prisma.teamMember.update({
      where: { id },
      data: {
        name,
        position,
        biography,
        qualifications,
        photograph,
        facebookUrl,
        twitterUrl,
        linkedinUrl,
        order: order ? parseInt(order, 10) : undefined,
      },
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.teamMember.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      { error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

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
      position,
      biography,
      qualifications,
      photograph,
      facebookUrl,
      twitterUrl,
      linkedinUrl,
      instagramUrl,
      isVisible,
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
        instagramUrl,
        isVisible: isVisible ?? true,
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
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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

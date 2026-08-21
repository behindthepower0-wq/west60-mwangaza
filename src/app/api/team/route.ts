import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
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

    const newMember = await prisma.teamMember.create({
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

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500 }
    );
  }
}

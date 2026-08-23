import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

// PUT /api/admin/users/[id] - Update a user
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
    const { name, email, password, role, status } = body;

    if (!name || !email) {
      return new NextResponse("Name and email are required", { status: 400 });
    }

    // Check if email exists on another user
    const existing = await prisma.user.findFirst({
      where: { email, NOT: { id } },
    });

    if (existing) {
      return new NextResponse("A user with this email already exists.", {
        status: 400,
      });
    }

    const updateData: any = {
      name,
      email,
      role: role || "EDITOR",
      status: status || "ACTIVE",
    };

    // Only update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[USER_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE /api/admin/users/[id] - Delete a user
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

    // Don't allow deleting yourself
    if ((session.user as { id?: string }).id === id) {
      return new NextResponse("Cannot delete your own account", {
        status: 400,
      });
    }

    await prisma.user.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

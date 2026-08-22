import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const members = [
    { name: 'Pamela Mbaabu', position: 'Chief Executive Officer', order: 1 },
    { name: 'Daniel Mwangangi', position: 'Senior Sales Manager', order: 2 },
    { name: 'Sylvia Mwangi', position: 'Senior Sales Manager', order: 3 },
    { name: 'Raymond', position: 'Senior Sales Manager', order: 4 },
    { name: 'Jacinta', position: 'Senior Sales Manager', order: 5 },
    { name: 'Esther', position: 'Senior Sales Manager', order: 6 },
    { name: 'Dickson', position: 'Senior Sales Manager', order: 7 },
    { name: 'Jackson', position: 'Senior Sales Manager', order: 8 },
    { name: 'Aphia', position: 'Front Desk', order: 9 },
  ];

  try {
    await prisma.teamMember.deleteMany({});
    
    for (const member of members) {
      await prisma.teamMember.create({
        data: {
          name: member.name,
          position: member.position,
          order: member.order,
          isVisible: true
        }
      });
    }
    return NextResponse.json({ success: true, message: "Team members seeded successfully!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

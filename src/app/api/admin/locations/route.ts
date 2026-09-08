import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET – fetch all locations (stored in site_settings as JSON)
export async function GET() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "property_locations" },
    });

    const locations: string[] = setting?.value ? JSON.parse(setting.value) : [];
    return NextResponse.json(locations);
  } catch {
    return NextResponse.json([]);
  }
}

// POST – overwrite the locations list
export async function POST(req: Request) {
  try {
    const { locations } = (await req.json()) as { locations: string[] };

    if (!Array.isArray(locations)) {
      return NextResponse.json({ error: "locations must be an array" }, { status: 400 });
    }

    // Deduplicate and trim
    const unique = [...new Set(locations.map((l) => l.trim()).filter(Boolean))];

    await prisma.siteSetting.upsert({
      where: { key: "property_locations" },
      update: { value: JSON.stringify(unique) },
      create: { key: "property_locations", value: JSON.stringify(unique), group: "properties", label: "Property Locations" },
    });

    return NextResponse.json(unique);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save locations" }, { status: 500 });
  }
}

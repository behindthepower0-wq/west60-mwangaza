import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getWhatsAppUrl } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  phone: z.string().min(3).max(30),
  propertyId: z.string().optional(),
  visitDate: z.string().max(50).optional(),
  message: z.string().max(2000).optional(),
});

// Simple in-memory rate limiting (same approach as /api/enquiries)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

function formatVisitDate(value: string): string {
  if (!value) return "";
  // value comes from <input type="date"> → "YYYY-MM-DD"
  const parts = value.split("-");
  if (parts.length !== 3) return value;
  const date = new Date(`${parts[0]}-${parts[1]}-${parts[2]}T00:00:00`);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = schema.parse(body);

    // Resolve property name
    let propertyName = "";
    if (validated.propertyId) {
      const property = await prisma.property.findUnique({
        where: { id: validated.propertyId },
        select: { name: true },
      }).catch(() => null);
      propertyName = property?.name || "";
    }

    // Build the WhatsApp message
    const lines = [
      `Hello West 60 Mwangaza Properties!`,
      `My name is ${validated.name}.`,
    ];
    if (propertyName) lines.push(`I'm interested in ${propertyName}.`);
    const visitDate = formatVisitDate(validated.visitDate || "");
    if (visitDate) lines.push(`I'd like to book a site visit on ${visitDate}.`);
    if (validated.message?.trim()) lines.push(validated.message.trim());
    lines.push(`You can reach me at ${validated.phone} or ${validated.email}.`);
    const text = lines.join("\n");

    // Store as an enquiry record
    await prisma.enquiry.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        subject: propertyName
          ? `WhatsApp enquiry: ${propertyName}`
          : "WhatsApp enquiry",
        message: text,
        propertyId: validated.propertyId || null,
        status: "NEW",
      },
    });

    // Resolve WhatsApp number from site settings (fallback to the known number)
    const whatsappSetting = await prisma.siteSetting
      .findUnique({ where: { key: "whatsapp" } })
      .catch(() => null);
    const whatsappNumber = whatsappSetting?.value || "0711400933";

    return NextResponse.json({ url: getWhatsAppUrl(whatsappNumber, text) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: (error as any).errors },
        { status: 400 }
      );
    }
    console.error("WhatsApp enquiry error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
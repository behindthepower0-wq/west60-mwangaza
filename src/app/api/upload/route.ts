import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const key = `uploads/${filename}`;

    // Try Cloudflare R2 first
    try {
      const { getCloudflareContext } = await import("@opennextjs/cloudflare");
      const { env } = getCloudflareContext();
      const bucket = (env as Record<string, unknown>).R2 as { put: (key: string, body: Uint8Array, options?: { httpMetadata?: { contentType?: string } }) => Promise<unknown> } | undefined;
      if (bucket) {
        await bucket.put(key, buffer, {
          httpMetadata: { contentType: file.type },
        });
        // Save to Media library
        const category = formData.get("category") as string || "GENERAL";
        const prismaModule = await import("@/lib/db");
        const prismaDb = prismaModule.default;
        await prismaDb.media.create({
          data: {
            filename,
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            url: `/uploads/${filename}`,
            altText: file.name.replace(/\.[^.]+$/, ""),
            category: category as any,
          },
        });
        return NextResponse.json({
          url: `/uploads/${filename}`,
          name: file.name,
        });
      }
    } catch {
      // Not on Cloudflare — fall through to local filesystem
    }

    // Local filesystem fallback
    const { writeFile, mkdir } = await import("fs/promises");
    const path = await import("path");

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      // Ignore if exists
    }

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, Buffer.from(buffer));

    // Save to Media library
    const category = formData.get("category") as string || "GENERAL";
    const prismaModule = await import("@/lib/db");
    const prismaDb = prismaModule.default;
    await prismaDb.media.create({
      data: {
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: `/uploads/${filename}`,
        altText: file.name.replace(/\.[^.]+$/, ""),
        category: category as any,
      },
    });

    return NextResponse.json({
      url: `/uploads/${filename}`,
      name: file.name,
    });
  } catch (error) {
    console.error("[UPLOAD_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

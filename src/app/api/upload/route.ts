import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const SIZES = {
  large: { width: 1200, quality: 82 },
  medium: { width: 800, quality: 80 },
  thumbnail: { width: 400, quality: 78 },
} as const;

const hasSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

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

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      return new NextResponse(
        "Only image files are allowed (JPEG, PNG, WebP, GIF, SVG)",
        { status: 400 },
      );
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return new NextResponse("File must be less than 10MB", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const filename = `${uniqueSuffix}-${safeName}`;
    const ext = safeName.includes(".")
      ? "." + safeName.split(".").pop()
      : ".jpg";
    const baseName = filename.replace(/\.[^.]+$/, "");
    const category = (formData.get("category") as string) || "general";

    let urls: { large: string; medium: string; thumbnail: string };

    if (hasSupabase) {
      // ── Supabase Storage ──
      const { uploadToStorage } = await import("@/lib/supabase");

      const originalPath = `${category.toLowerCase()}/${baseName}${ext}`;
      const originalUrl = await uploadToStorage(
        originalPath,
        buffer,
        file.type,
      );

      urls = { large: originalUrl, medium: originalUrl, thumbnail: originalUrl };

      if (ext !== ".svg" && ext !== ".gif") {
        const sharp = (await import("sharp")).default;
        const metadata = await sharp(buffer).metadata();
        const maxDim = Math.max(metadata.width || 0, metadata.height || 0);

        if (maxDim > SIZES.thumbnail.width) {
          for (const [size, config] of Object.entries(SIZES)) {
            const resized = await sharp(buffer)
              .resize({
                width: config.width,
                height: config.width,
                fit: "inside",
                withoutEnlargement: true,
              })
              .jpeg({ quality: config.quality, progressive: true })
              .toBuffer();

            const sizePath = `${category.toLowerCase()}/${baseName}-${size}${ext}`;
            urls[size as keyof typeof SIZES] = await uploadToStorage(
              sizePath,
              resized,
              "image/jpeg",
            );
          }
        }
      }
    } else {
      // ── Local filesystem (dev fallback) ──
      const { writeFile, mkdir } = await import("fs/promises");
      const path = await import("path");
      const { resizeImage } = await import("@/lib/image-utils");

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      const filepath = path.join(uploadDir, `${baseName}${ext}`);
      await writeFile(filepath, buffer);

      urls = await resizeImage(buffer, baseName, uploadDir, ext);
    }

    // Save to Media library
    const prismaModule = await import("@/lib/db");
    const prismaDb = prismaModule.default;
    await prismaDb.media.create({
      data: {
        filename: `${baseName}${ext}`,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: urls.large,
        thumbnailUrl: urls.thumbnail,
        webpUrl: urls.medium,
        altText: file.name.replace(/\.[^.]+$/, ""),
        category: category.toUpperCase() as never,
      },
    });

    return NextResponse.json({
      url: urls.large,
      urls,
      name: file.name,
    });
  } catch (error) {
    console.error("[UPLOAD_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

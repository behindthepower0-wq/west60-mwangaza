import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { resizeImage, type ResizedUrls } from "@/lib/image-utils";

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

    // Server-side validation
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

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return new NextResponse("File must be less than 10MB", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const filename = `${uniqueSuffix}-${safeName}`;
    const ext = safeName.includes(".")
      ? "." + safeName.split(".").pop()
      : ".jpg";
    const baseName = filename.replace(/\.[^.]+$/, "");

    const category = (formData.get("category") as string) || "GENERAL";
    let resizedUrls: ResizedUrls;

    // Try Cloudflare R2 first
    try {
      const { getCloudflareContext } = await import("@opennextjs/cloudflare");
      const { env } = getCloudflareContext();
      const bucket = (env as Record<string, unknown>).R2 as
        | {
            put: (
              key: string,
              body: Uint8Array,
              options?: {
                httpMetadata?: { contentType?: string };
              },
            ) => Promise<unknown>;
          }
        | undefined;

      if (bucket) {
        // Generate resized versions
        resizedUrls = await resizeImage(
          buffer,
          baseName,
          "", // No local dir for R2
          ext,
        );

        // Upload original + all resized versions to R2
        const entries: Array<{ key: string; buf: Buffer }> = [
          { key: `uploads/${baseName}${ext}`, buf: buffer },
        ];

        // For resized versions, we need to re-process since resizeImage
        // wrote to a local path. Instead, do R2 uploads directly.
        const sharp = (await import("sharp")).default;

        const SIZES = {
          large: { width: 1200, quality: 82 },
          medium: { width: 800, quality: 80 },
          thumbnail: { width: 400, quality: 78 },
        } as const;

        // Skip resize for SVG/GIF
        if (ext !== ".svg" && ext !== ".gif") {
          const metadata = await sharp(buffer).metadata();
          const maxDim = Math.max(metadata.width || 0, metadata.height || 0);

          if (maxDim > 400) {
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

              entries.push({
                key: `uploads/${baseName}-${size}${ext}`,
                buf: Buffer.from(resized),
              });
              resizedUrls[size as keyof typeof SIZES] =
                `/uploads/${baseName}-${size}${ext}`;
            }
          }
        }

        // Upload all to R2
        for (const entry of entries) {
          await bucket.put(entry.key, entry.buf, {
            httpMetadata: { contentType: file.type },
          });
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
            url: resizedUrls.large || resizedUrls.medium || resizedUrls.thumbnail || `/uploads/${baseName}${ext}`,
            thumbnailUrl: resizedUrls.thumbnail,
            webpUrl: resizedUrls.medium,
            altText: file.name.replace(/\.[^.]+$/, ""),
            category: category as never,
          },
        });

        return NextResponse.json({
          url: resizedUrls.large || `/uploads/${baseName}${ext}`,
          urls: resizedUrls,
          name: file.name,
        });
      }
    } catch {
      // Not on Cloudflare — fall through to local filesystem
    }

    // ── Local filesystem ──
    const { writeFile, mkdir } = await import("fs/promises");
    const path = await import("path");

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      // Ignore if exists
    }

    // Write original
    const filepath = path.join(uploadDir, `${baseName}${ext}`);
    await writeFile(filepath, buffer);

    // Generate resized versions
    resizedUrls = await resizeImage(buffer, baseName, uploadDir, ext);

    // Save to Media library
    const prismaModule = await import("@/lib/db");
    const prismaDb = prismaModule.default;
    await prismaDb.media.create({
      data: {
        filename: `${baseName}${ext}`,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: resizedUrls.large || `/uploads/${baseName}${ext}`,
        thumbnailUrl: resizedUrls.thumbnail,
        webpUrl: resizedUrls.medium,
        altText: file.name.replace(/\.[^.]+$/, ""),
        category: category as never,
      },
    });

    return NextResponse.json({
      url: resizedUrls.large || `/uploads/${baseName}${ext}`,
      urls: resizedUrls,
      name: file.name,
    });
  } catch (error) {
    console.error("[UPLOAD_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

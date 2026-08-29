/**
 * Image resize utilities using sharp.
 *
 * Generates three sizes from an uploaded image:
 *   - large:   max 1200px wide  (full-width sections, hero images)
 *   - medium:  max 800px wide   (cards, listings, edit pages)
 *   - thumbnail: max 400px wide (grid previews, galleries)
 *
 * Returns the URLs for each size plus the original.
 */

const SIZES = {
  large: { width: 1200, quality: 82 },
  medium: { width: 800, quality: 80 },
  thumbnail: { width: 400, quality: 78 },
} as const;

export type ImageSize = keyof typeof SIZES;
export type ResizedUrls = Record<ImageSize, string>;

/**
 * Given a buffer and a base filename, produce resized versions on disk
 * and return their public URLs.
 *
 * @param buffer     Original image bytes
 * @param filename   Base filename (without extension), e.g. "1725000000-photo"
 * @param uploadDir  Absolute path to the uploads directory
 * @param extension  File extension including dot, e.g. ".jpg"
 * @returns          URLs for each size
 */
export async function resizeImage(
  buffer: Buffer,
  filename: string,
  uploadDir: string,
  extension: string,
): Promise<ResizedUrls> {
  const sharp = (await import("sharp")).default;

  const urls: ResizedUrls = {
    large: `/uploads/${filename}${extension}`,
    medium: `/uploads/${filename}${extension}`,
    thumbnail: `/uploads/${filename}${extension}`,
  };

  // Skip resize for SVG and GIF (animated) — just keep original
  if (extension === ".svg" || extension === ".gif") {
    return urls;
  }

  // Check actual image dimensions — skip resize if already smaller than thumbnail
  const metadata = await sharp(buffer).metadata();
  const maxDim = Math.max(metadata.width || 0, metadata.height || 0);
  if (maxDim <= SIZES.thumbnail.width) {
    // Image is tiny, no need to resize
    return urls;
  }

  const results = await Promise.allSettled(
    (Object.entries(SIZES) as [ImageSize, (typeof SIZES)[ImageSize]][]).map(
      async ([size, config]) => {
        const outFilename = `${filename}-${size}${extension}`;
        const outPath = `${uploadDir}/${outFilename}`;

        await sharp(buffer)
          .resize({
            width: config.width,
            height: config.width, // treat as max square for safety
            fit: "inside",
            withoutEnlargement: true,
          })
          .jpeg({ quality: config.quality, progressive: true })
          .toFile(outPath);

        urls[size] = `/uploads/${outFilename}`;
      },
    ),
  );

  // Log any failures but don't block the upload
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(
        `[image-utils] Resize failed for ${Object.keys(SIZES)[i]}:`,
        r.reason,
      );
    }
  });

  return urls;
}

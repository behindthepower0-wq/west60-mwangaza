export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Crop an image to the specified pixel area.
 * Fetches the image as a blob first to avoid CORS canvas tainting
 * (cross-origin URLs like Supabase storage would otherwise poison the canvas).
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: PixelCrop
): Promise<Blob> {
  const response = await fetch(imageSrc);
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
  const imageBlob = await response.blob();
  const objectUrl = URL.createObjectURL(imageBlob);

  try {
    const image = await new Promise<HTMLImageElement>((res, rej) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = () => rej(new Error("Could not load image"));
      img.src = objectUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return await new Promise<Blob>((res, rej) => {
      canvas.toBlob(
        (blob) => (blob ? res(blob) : rej(new Error("Could not create blob"))),
        "image/jpeg",
        0.92
      );
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

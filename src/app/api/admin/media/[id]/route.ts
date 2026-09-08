import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

const hasSupabase =
  !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

// PATCH /api/admin/media/[id] - Update a media record (e.g. after cropping)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { url, thumbnailUrl, webpUrl, width, height } = body;

    const data: Record<string, unknown> = {};
    if (url !== undefined) data.url = url;
    if (thumbnailUrl !== undefined) data.thumbnailUrl = thumbnailUrl;
    if (webpUrl !== undefined) data.webpUrl = webpUrl;
    if (width !== undefined) data.width = width;
    if (height !== undefined) data.height = height;

    if (Object.keys(data).length === 0) {
      return new NextResponse("Nothing to update", { status: 400 });
    }

    const media = await prisma.media.update({ where: { id }, data });
    return NextResponse.json(media);
  } catch (error) {
    console.error("[MEDIA_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE /api/admin/media/[id] - Delete a media item + its storage files
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

    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return new NextResponse("Media not found", { status: 404 });
    }

    // Delete from Supabase Storage if configured
    if (hasSupabase) {
      const { deleteFromStorage, extractStoragePath } = await import(
        "@/lib/supabase"
      );
      const pathsToDelete = new Set<string>();
      for (const url of [media.url, media.thumbnailUrl, media.webpUrl]) {
        if (!url) continue;
        const storagePath = extractStoragePath(url);
        if (storagePath) pathsToDelete.add(storagePath);
      }
      for (const p of pathsToDelete) {
        await deleteFromStorage(p);
      }
    }

    await prisma.media.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[MEDIA_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

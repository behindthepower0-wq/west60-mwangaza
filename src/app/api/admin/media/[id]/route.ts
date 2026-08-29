import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

const hasSupabase =
  !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

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

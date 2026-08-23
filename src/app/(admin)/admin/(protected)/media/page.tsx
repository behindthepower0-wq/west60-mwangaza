import type { Metadata } from 'next';
import prisma from '@/lib/db';
import { MediaLibraryManager } from '@/components/admin/MediaLibraryManager';

export const metadata: Metadata = { title: 'Media Library | CMS' };

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
  }).catch(() => []);

  const serializedMedia = media.map(m => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-serif)' }}>Media Library</h1>
        <p className="text-sm text-gray-500">Upload, manage, and organize your images.</p>
      </div>

      <div className="admin-card p-6">
        <MediaLibraryManager initialMedia={serializedMedia} />
      </div>
    </div>
  );
}

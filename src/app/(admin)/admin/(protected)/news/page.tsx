import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Pencil, Eye, Trash2, Newspaper } from 'lucide-react';
import prisma from '@/lib/db';

export const metadata: Metadata = { title: 'News & Articles | CMS' };

export default async function AdminNewsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { name: true } }, category: { select: { name: true } } },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-serif)' }}>News & Articles</h1>
          <p className="text-sm text-gray-500">{posts.length} published articles</p>
        </div>
        <Link href="/admin/news/new" className="btn-primary text-sm">
          <Plus size={16} /> Write Article
        </Link>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-500 mb-2">No articles yet</h3>
            <p className="text-sm text-gray-400 mb-6">Publish news and updates to engage your audience.</p>
            <Link href="/admin/news/new" className="btn-primary text-sm"><Plus size={16} /> Write First Article</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Article', 'Category', 'Author', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {posts.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-sm text-gray-800 max-w-[300px] truncate">{p.title}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{p.category?.name || '-'}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{p.author?.name || '-'}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.status === 'PUBLISHED' ? 'bg-secondary-50 text-secondary-600' : 'bg-gray-100 text-gray-600'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/news/${p.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                          <Eye size={16} />
                        </Link>
                        <Link href={`/admin/news/${p.id}/edit`} className="p-2 text-gray-400 hover:text-secondary-600 rounded-lg hover:bg-secondary-50 transition-colors">
                          <Pencil size={16} />
                        </Link>
                        <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

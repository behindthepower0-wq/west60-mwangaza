import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, GripVertical, Eye, EyeOff, Pencil } from 'lucide-react';
import prisma from '@/lib/db';

export const metadata: Metadata = { title: 'Homepage Sections | CMS' };

export default async function AdminHomepagePage() {
  const sections = await prisma.homepageSection.findMany({
    orderBy: { order: 'asc' },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-serif)' }}>Homepage Sections</h1>
        <p className="text-sm text-gray-500">Manage the content sections displayed on your homepage.</p>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        {sections.length === 0 ? (
          <div className="text-center py-20">
            <Home size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-500 mb-2">No sections yet</h3>
            <p className="text-sm text-gray-400">Homepage sections are seeded from the database.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Order', 'Section', 'Visibility', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sections.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <GripVertical size={14} className="text-gray-300" />
                        {s.order}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-sm text-gray-800">{s.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Key: {s.key}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${s.isVisible ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {s.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                        {s.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/admin/homepage/${s.id}/edit`} className="p-2 text-gray-400 hover:text-secondary-600 rounded-lg hover:bg-secondary-50 transition-colors inline-flex">
                        <Pencil size={16} />
                      </Link>
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

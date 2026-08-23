import type { Metadata } from 'next';
import { Navigation, Eye, EyeOff, GripVertical } from 'lucide-react';
import prisma from '@/lib/db';

export const metadata: Metadata = { title: 'Navigation | CMS' };

export default async function AdminNavigationPage() {
  const items = await prisma.navigationItem.findMany({
    orderBy: { order: 'asc' },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-serif)' }}>Navigation</h1>
        <p className="text-sm text-gray-500">Manage your site navigation menu items.</p>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <Navigation size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-500 mb-2">No navigation items</h3>
            <p className="text-sm text-gray-400">Navigation items are seeded from the database.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Order', 'Label', 'URL', 'Visibility', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <GripVertical size={14} className="text-gray-300" />
                        {item.order}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-sm text-gray-800">{item.label}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 font-mono">{item.url}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${item.isVisible ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {item.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                        {item.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-gray-400">Edit via settings</span>
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

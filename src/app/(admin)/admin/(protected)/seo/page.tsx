import type { Metadata } from 'next';
import { Search, Globe } from 'lucide-react';
import prisma from '@/lib/db';

export const metadata: Metadata = { title: 'SEO Settings | CMS' };

export default async function AdminSeoPage() {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { contains: 'seo' } },
    orderBy: { key: 'asc' },
  }).catch(() => []);

  const seoItems = settings.filter(s => s.value);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-serif)' }}>SEO Settings</h1>
        <p className="text-sm text-gray-500">Manage search engine optimization settings for your website.</p>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        {seoItems.length === 0 ? (
          <div className="text-center py-20">
            <Search size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-500 mb-2">No SEO settings configured</h3>
            <p className="text-sm text-gray-400 mb-6">Configure SEO settings in the Settings page.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Setting', 'Value', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {seoItems.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="text-gray-400" />
                        <p className="font-semibold text-sm text-gray-800">{s.label || s.key}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-600 max-w-[400px] truncate">{s.value}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-gray-400">Edit via Settings page</span>
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

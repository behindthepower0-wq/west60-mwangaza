import type { Metadata } from 'next';
import { Mail, Phone, Calendar, Search } from 'lucide-react';
import prisma from '@/lib/db';

export const metadata: Metadata = { title: 'Enquiries — CMS' };

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: 'desc' },
    include: { property: { select: { name: true } } },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-serif)' }}>Enquiries</h1>
          <p className="text-sm text-gray-500">{enquiries.length} total enquiries</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search enquiries..." className="pl-9 input-field text-sm w-full sm:w-64" />
        </div>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        {enquiries.length === 0 ? (
          <div className="text-center py-20">
            <Mail size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-500 mb-2">No enquiries yet</h3>
            <p className="text-sm text-gray-400">When users contact you, their messages will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Contact', 'Property / Subject', 'Status', 'Date', 'Message'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {enquiries.map(e => (
                  <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-sm text-gray-800">{e.name}</p>
                      <div className="flex flex-col gap-1 mt-1">
                        <a href={`mailto:${e.email}`} className="text-xs text-gray-500 flex items-center gap-1 hover:text-primary-600"><Mail size={12}/> {e.email}</a>
                        {e.phone && <a href={`tel:${e.phone}`} className="text-xs text-gray-500 flex items-center gap-1 hover:text-primary-600"><Phone size={12}/> {e.phone}</a>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700 font-medium">
                      {e.property?.name || e.subject || '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                            e.status === 'NEW' ? 'bg-blue-100 text-blue-800' : e.status === 'CONTACTED' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(e.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {e.message}
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

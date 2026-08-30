import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Pencil, Eye, Building2 } from 'lucide-react';
import { DeleteButton } from '@/components/admin/DeleteButton';
import prisma from '@/lib/db';
import { formatPrice, getPropertyStatusLabel, getPropertyStatusClass } from '@/lib/utils';

export const metadata: Metadata = { title: 'Properties | CMS' };

export default async function AdminPropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    include: { images: { take: 1, orderBy: { order: 'asc' } } },
  }).catch(() => []);

  const propertyIds = properties.map((p) => p.id);
  const enquiries = propertyIds.length > 0
    ? await prisma.enquiry.findMany({
        where: { propertyId: { in: propertyIds } },
        select: { propertyId: true },
      }).catch(() => [])
    : [];
  const enquiryCountMap = new Map<string, number>();
  for (const e of enquiries) {
    const pid = e.propertyId as string;
    enquiryCountMap.set(pid, (enquiryCountMap.get(pid) || 0) + 1);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-serif)' }}>Properties</h1>
          <p className="text-sm text-gray-500">{properties.length} total properties</p>
        </div>
        <Link href="/admin/properties/new" className="btn-primary text-sm">
          <Plus size={16} /> Add Property
        </Link>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        {properties.length === 0 ? (
          <div className="text-center py-20">
            <Building2 size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-500 mb-2">No properties yet</h3>
            <p className="text-sm text-gray-400 mb-6">Add your first property to get started.</p>
            <Link href="/admin/properties/new" className="btn-primary text-sm"><Plus size={16} /> Add First Property</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Property', 'Location', 'Price', 'Status', 'Featured', 'Enquiries', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {properties.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {p.images[0] ? <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" /> : <Building2 size={20} className="text-gray-300 m-auto mt-3" />}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-800">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.propertyType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{p.location || '-'}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-700">{p.priceLabel || formatPrice(p.price, p.currency)}</td>
                    <td className="px-5 py-4"><span className={getPropertyStatusClass(p.status)}>{getPropertyStatusLabel(p.status)}</span></td>
                    <td className="px-5 py-4"><span className={`text-xs font-medium ${p.isFeatured ? 'text-secondary-600' : 'text-gray-400'}`}>{p.isFeatured ? 'Yes' : 'No'}</span></td>
                    <td className="px-5 py-4 text-sm text-gray-600">{enquiryCountMap.get(p.id) || 0}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/properties/${p.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                          <Eye size={16} />
                        </Link>
                        <Link href={`/admin/properties/${p.id}/edit`} className="p-2 text-gray-400 hover:text-secondary-600 rounded-lg hover:bg-secondary-50 transition-colors">
                          <Pencil size={16} />
                        </Link>
                        <DeleteButton id={p.id} apiPath="/api/properties" itemName="property" />
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

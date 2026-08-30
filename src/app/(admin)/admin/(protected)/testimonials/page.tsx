import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Pencil, Star, Eye, EyeOff } from 'lucide-react';
import { DeleteButton } from '@/components/admin/DeleteButton';
import prisma from '@/lib/db';

export const metadata: Metadata = { title: 'Testimonials | CMS' };

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-serif)' }}>Testimonials</h1>
          <p className="text-sm text-gray-500">{testimonials.length} testimonials</p>
        </div>
        <Link href="/admin/testimonials/new" className="btn-primary text-sm">
          <Plus size={16} /> Add Testimonial
        </Link>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        {testimonials.length === 0 ? (
          <div className="text-center py-20">
            <Star size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-500 mb-2">No testimonials yet</h3>
            <p className="text-sm text-gray-400 mb-6">Add client testimonials to build trust with visitors.</p>
            <Link href="/admin/testimonials/new" className="btn-primary text-sm"><Plus size={16} /> Add First Testimonial</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Client', 'Role', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {testimonials.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-sm text-gray-800">{t.clientName}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[300px]">{t.testimonial}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{t.position || '-'}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${t.isVisible ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {t.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                        {t.isVisible ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/testimonials/${t.id}/edit`} className="p-2 text-gray-400 hover:text-secondary-600 rounded-lg hover:bg-secondary-50 transition-colors">
                          <Pencil size={16} />
                        </Link>
                        <DeleteButton id={t.id} apiPath="/api/admin/testimonials" itemName="testimonial" />
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

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import prisma from '@/lib/db';
import { TestimonialForm } from '@/components/admin/TestimonialForm';

export const metadata: Metadata = { title: 'Edit Testimonial | CMS' };

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const testimonial = await prisma.testimonial.findUnique({ where: { id } });

  if (!testimonial) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Link href="/admin/testimonials" className="p-2 text-gray-400 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-serif)' }}>Testimonial Not Found</h1>
            <p className="text-sm text-gray-500">The testimonial you are looking for does not exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/testimonials" className="p-2 text-gray-400 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-serif)' }}>Edit Testimonial</h1>
          <p className="text-sm text-gray-500">Update testimonial details.</p>
        </div>
      </div>
      
      <div className="admin-card p-6">
        <TestimonialForm initialData={testimonial} />
      </div>
    </div>
  );
}

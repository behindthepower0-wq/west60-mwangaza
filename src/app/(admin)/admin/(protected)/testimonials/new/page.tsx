import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { TestimonialForm } from '@/components/admin/TestimonialForm';

export const metadata: Metadata = { title: 'Add Testimonial | CMS' };

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/testimonials" className="p-2 text-gray-400 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-serif)' }}>Add Testimonial</h1>
          <p className="text-sm text-gray-500">Add a client testimonial to build trust.</p>
        </div>
      </div>
      
      <div className="admin-card p-6">
        <TestimonialForm />
      </div>
    </div>
  );
}

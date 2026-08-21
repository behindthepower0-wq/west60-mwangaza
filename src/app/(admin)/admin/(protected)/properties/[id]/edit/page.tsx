import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PropertyForm } from '@/components/admin/PropertyForm';
import prisma from '@/lib/db';

export const metadata: Metadata = { title: 'Edit Property — CMS' };

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id },
    include: { features: true }
  });

  if (!property) {
    notFound();
  }

  const parsedProperty = {
    ...property,
    features: property.features?.map(f => f.feature) || [],
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/properties" className="p-2 text-gray-400 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-serif)' }}>Edit Property</h1>
          <p className="text-sm text-gray-500">Update listing details for {property.name}.</p>
        </div>
      </div>
      
      <div className="admin-card p-6">
        <PropertyForm initialData={parsedProperty} />
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Save, UploadCloud } from 'lucide-react';
import { PropertyForm } from '@/components/admin/PropertyForm';

export const metadata: Metadata = { title: 'Add Property — CMS' };

export default function NewPropertyPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/properties" className="p-2 text-gray-400 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-serif)' }}>Add Property</h1>
          <p className="text-sm text-gray-500">Create a new property listing.</p>
        </div>
      </div>
      
      <div className="admin-card p-6">
        <PropertyForm />
      </div>
    </div>
  );
}

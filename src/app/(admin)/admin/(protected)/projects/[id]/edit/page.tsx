import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import prisma from '@/lib/db';
import { ProjectForm } from '@/components/admin/ProjectForm';

export const metadata: Metadata = { title: 'Edit Project | CMS' };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { features: { orderBy: { order: 'asc' } }, images: { orderBy: { order: 'asc' } } },
  });

  if (!project) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects" className="p-2 text-gray-400 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-serif)' }}>Project Not Found</h1>
            <p className="text-sm text-gray-500">The project you are looking for does not exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const initialData = {
    ...project,
    description: project.fullDescription || '',
    features: project.features.map(f => f.feature),
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects" className="p-2 text-gray-400 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-serif)' }}>Edit Project</h1>
          <p className="text-sm text-gray-500">Update project details and images.</p>
        </div>
      </div>
      
      <div className="admin-card p-6">
        <ProjectForm initialData={initialData} />
      </div>
    </div>
  );
}

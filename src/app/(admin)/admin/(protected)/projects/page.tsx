import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Pencil, Eye, Trash2, FolderKanban } from 'lucide-react';
import prisma from '@/lib/db';

export const metadata: Metadata = { title: 'Projects — CMS' };

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-serif)' }}>Projects</h1>
          <p className="text-sm text-gray-500">{projects.length} total projects</p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary text-sm">
          <Plus size={16} /> Add Project
        </Link>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <FolderKanban size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-500 mb-2">No projects yet</h3>
            <p className="text-sm text-gray-400 mb-6">Group your properties into projects.</p>
            <Link href="/admin/projects/new" className="btn-primary text-sm"><Plus size={16} /> Add First Project</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Project', 'Status', 'Date', 'Properties', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {projects.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-sm text-gray-800">{p.name}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.status === 'COMPLETED' ? 'bg-secondary-50 text-secondary-600' : 'bg-gray-100 text-gray-600'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-700">0</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/projects/${p.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                          <Eye size={16} />
                        </Link>
                        <button className="p-2 text-gray-400 hover:text-secondary-600 rounded-lg hover:bg-secondary-50 transition-colors">
                          <Pencil size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 size={16} />
                        </button>
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

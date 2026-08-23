import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import prisma from '@/lib/db';

export const metadata: Metadata = { title: 'Team | CMS' };

export default async function AdminTeamPage() {
  const team = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-serif)' }}>Team Members</h1>
          <p className="text-sm text-gray-500">{team.length} members</p>
        </div>
        <Link href="/admin/team/new" className="btn-primary text-sm">
          <Plus size={16} /> Add Member
        </Link>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        {team.length === 0 ? (
          <div className="text-center py-20">
            <Users size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-500 mb-2">No team members</h3>
            <p className="text-sm text-gray-400 mb-6">Add your team members to display them on the website.</p>
            <Link href="/admin/team/new" className="btn-primary text-sm"><Plus size={16} /> Add First Member</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Member', 'Role', 'Order', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {team.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                          {member.photograph ? <img src={member.photograph} alt={member.name} className="w-full h-full object-cover" /> : <Users size={20} className="text-gray-300 m-auto mt-3" />}
                        </div>
                        <p className="font-semibold text-sm text-gray-800">{member.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{member.position || '-'}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{member.order}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
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

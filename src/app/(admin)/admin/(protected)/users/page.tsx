import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Pencil, UserCog, Shield, CheckCircle, XCircle } from 'lucide-react';
import { DeleteButton } from '@/components/admin/DeleteButton';
import prisma from '@/lib/db';

export const metadata: Metadata = { title: 'Users | CMS' };

const roleColors: Record<string, string> = {
  SUPER_ADMIN: 'bg-red-50 text-red-600',
  ADMINISTRATOR: 'bg-orange-50 text-orange-600',
  EDITOR: 'bg-blue-50 text-blue-600',
  CONTENT_STAFF: 'bg-gray-100 text-gray-600',
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, role: true, status: true, lastLogin: true, createdAt: true },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-serif)' }}>Users</h1>
          <p className="text-sm text-gray-500">{users.length} users</p>
        </div>
        <Link href="/admin/users/new" className="btn-primary text-sm">
          <Plus size={16} /> Add User
        </Link>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        {users.length === 0 ? (
          <div className="text-center py-20">
            <UserCog size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-500 mb-2">No users</h3>
            <p className="text-sm text-gray-400 mb-6">Add users to manage your CMS.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['User', 'Role', 'Status', 'Last Login', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-primary-700">{u.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-800">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${roleColors[u.role] || 'bg-gray-100 text-gray-600'}`}>
                        <Shield size={10} />
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${u.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {u.status === 'ACTIVE' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/users/${u.id}/edit`} className="p-2 text-gray-400 hover:text-secondary-600 rounded-lg hover:bg-secondary-50 transition-colors">
                          <Pencil size={16} />
                        </Link>
                        <DeleteButton id={u.id} apiPath="/api/admin/users" itemName="user" />
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

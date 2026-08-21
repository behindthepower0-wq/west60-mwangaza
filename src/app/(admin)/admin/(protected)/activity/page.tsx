import type { Metadata } from 'next';
import prisma from '@/lib/db';
import { Activity } from 'lucide-react';

export const metadata: Metadata = { title: 'Activity Log — CMS' };

export default async function AdminActivityPage() {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: { user: { select: { name: true, email: true } } },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-serif)' }}>Activity Log</h1>
        <p className="text-sm text-gray-500">Track all administrative actions on the CMS.</p>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        {logs.length === 0 ? (
          <div className="text-center py-20">
            <Activity size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-sm text-gray-400">No activity recorded yet. Actions taken in the CMS will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['User', 'Action', 'Entity', 'Date/Time'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-sm text-gray-800">{log.user?.name || 'System'}</p>
                      <p className="text-xs text-gray-400">{log.user?.email || ''}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">{log.action}</td>
                    <td className="px-5 py-4">
                      {log.entityLabel && <p className="text-sm text-primary-600 font-medium">{log.entityLabel}</p>}
                      {log.entityType && <p className="text-xs text-gray-400">{log.entityType}</p>}
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400">
                      {new Date(log.createdAt).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })}
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

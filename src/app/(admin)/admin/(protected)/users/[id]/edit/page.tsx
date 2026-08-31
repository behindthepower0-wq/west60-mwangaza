import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { auth, canManageUsers, type UserRole } from '@/lib/auth';
import prisma from '@/lib/db';
import { UserForm } from '@/components/admin/UserForm';

export const metadata: Metadata = { title: 'Edit User | CMS' };

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userRole = ((session?.user as { role?: string })?.role || 'CONTENT_STAFF') as UserRole;

  if (!canManageUsers(userRole)) {
    redirect('/admin');
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, status: true },
  });

  if (!user) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Link href="/admin/users" className="p-2 text-gray-400 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-serif)' }}>User Not Found</h1>
            <p className="text-sm text-gray-500">The user you are looking for does not exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/users" className="p-2 text-gray-400 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-serif)' }}>Edit User</h1>
          <p className="text-sm text-gray-500">Update user account details.</p>
        </div>
      </div>
      
      <div className="admin-card p-6">
        <UserForm initialData={user} currentUserRole={userRole} />
      </div>
    </div>
  );
}

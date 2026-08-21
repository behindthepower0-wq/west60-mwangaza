import type { Metadata } from 'next';
import { SettingsForm } from '@/components/admin/SettingsForm';
import prisma from '@/lib/db';

export const metadata: Metadata = { title: 'Settings — CMS' };

async function getSettings() {
  const settings = await prisma.siteSetting.findMany().catch(() => []);
  const map: Record<string, string> = {};
  settings.forEach(s => { if (s.value) map[s.key] = s.value; });
  return map;
}

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-serif)' }}>Website Settings</h1>
        <p className="text-sm text-gray-500">Manage company information, contact details and social media links.</p>
      </div>
      <SettingsForm initialSettings={settings} />
    </div>
  );
}

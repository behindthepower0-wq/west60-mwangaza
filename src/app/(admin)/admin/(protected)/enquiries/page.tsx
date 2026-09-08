import type { Metadata } from 'next';
import { Mail } from 'lucide-react';
import prisma from '@/lib/db';
import { EnquiriesTable, type EnquiryRow } from '@/components/admin/EnquiriesTable';

export const metadata: Metadata = { title: 'Enquiries | CMS' };

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 15;
const ENQUIRY_STATUSES = ['NEW', 'CONTACTED', 'FOLLOW_UP', 'CONVERTED', 'CLOSED'];

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q || '').trim();
  const status = (params.status || '').trim();
  const page = Math.max(1, parseInt(params.page || '1', 10) || 1);

  const where: Record<string, unknown> = {};
  if (status && ENQUIRY_STATUSES.includes(status)) {
    where.status = status;
  }
  if (query) {
    where.OR = [
      { name: { contains: query } },
      { email: { contains: query } },
      { phone: { contains: query } },
      { subject: { contains: query } },
      { message: { contains: query } },
    ];
  }

  const [enquiries, total] = await Promise.all([
    prisma.enquiry
      .findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: { property: { select: { name: true, slug: true } } },
      })
      .catch(() => []),
    prisma.enquiry.count({ where }).catch(() => 0),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const rows: EnquiryRow[] = (enquiries as unknown as EnquiryRow[]).map((e) => ({
    id: e.id,
    name: e.name,
    email: e.email,
    phone: e.phone,
    subject: e.subject,
    message: e.message,
    status: e.status as string,
    notes: e.notes,
    createdAt:
      typeof e.createdAt === 'string' ? e.createdAt : String(e.createdAt),
    property: e.property ? { name: e.property.name, slug: e.property.slug } : null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-serif)' }}>
          Enquiries
        </h1>
        <p className="text-sm text-gray-500 flex items-center gap-1.5">
          <Mail size={13} className="text-gray-400" />
          {total} total enquiries
        </p>
      </div>

      <EnquiriesTable
        enquiries={rows}
        total={total}
        page={page}
        totalPages={totalPages}
        currentQuery={query}
        currentStatus={status}
      />
    </div>
  );
}
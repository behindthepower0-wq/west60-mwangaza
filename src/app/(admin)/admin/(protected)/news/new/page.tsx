import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ArticleForm } from '@/components/admin/ArticleForm';

export const metadata: Metadata = { title: 'Write Article | CMS' };

export default function NewArticlePage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/news" className="p-2 text-gray-400 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-serif)' }}>Write Article</h1>
          <p className="text-sm text-gray-500">Publish a new news article or blog post.</p>
        </div>
      </div>
      
      <div className="admin-card p-6">
        <ArticleForm />
      </div>
    </div>
  );
}

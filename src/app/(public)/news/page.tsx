import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import prisma from "@/lib/db";
import { NewsCard } from "@/components/public/NewsSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "News & Insights",
  description: "Real estate news, property tips and investment insights from West 60 Mwangaza Properties Kenya.",
};

export default async function NewsPage() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { category: true, author: true },
  }).catch(() => []);

  return (
    <>
      <section className="relative pt-32 pb-16" style={{ background: "var(--color-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="section-eyebrow justify-center mb-4">
            <span className="w-8 h-px bg-secondary-400" />News &amp; Insights<span className="w-8 h-px bg-secondary-400" />
          </div>
          <h1 className="section-heading-white mb-4">
            Real Estate <span style={{ color: "#C9A84C" }}>Insights</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Stay informed with the latest property news, investment tips and market insights from our team.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-xl font-bold text-primary-700 mb-2" style={{ fontFamily: "var(--font-serif)" }}>Articles Coming Soon</h3>
              <p className="text-gray-500 text-sm">Our editorial team is working on content. Check back soon.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => <NewsCard key={post.id} post={post} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

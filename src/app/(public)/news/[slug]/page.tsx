import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Tag, User } from "lucide-react";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, seoTitle: true, metaDescription: true },
  });

  if (!post) return { title: "Article Not Found" };

  return {
    title: post.seoTitle || post.title,
    description: post.metaDescription || post.excerpt || undefined,
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true, slug: true } },
    },
  });

  if (!post) notFound();

  return (
    <div className="min-h-screen" style={{ background: "var(--color-warm-white)" }}>
      {/* Hero */}
      <section className="relative py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-medium mb-6 transition-colors"
            style={{ color: "var(--color-primary)" }}
          >
            <ArrowLeft size={16} /> Back to News
          </Link>

          {post.category && (
            <span
              className="inline-block text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-4"
              style={{
                background: "rgba(198,145,43,0.12)",
                color: "var(--color-secondary-dark)",
              }}
            >
              {post.category.name}
            </span>
          )}

          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6"
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--color-primary)",
            }}
          >
            {post.title}
          </h1>

          {post.excerpt && (
            <p
              className="text-lg md:text-xl max-w-3xl mb-8"
              style={{
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
              }}
            >
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm" style={{ color: "var(--color-text-muted)" }}>
            {post.author && (
              <span className="flex items-center gap-1.5">
                <User size={14} /> {post.author.name}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />{" "}
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-KE", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            {post.tags && (
              <span className="flex items-center gap-1.5">
                <Tag size={14} /> {post.tags}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.featuredImage && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={post.featuredImage}
              alt={post.title}
              width={1200}
              height={630}
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        </section>
      )}

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <article
          className="prose-brand"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />
      </section>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { formatDateShort } from "@/lib/utils";
import type { Post, Category, User } from "@prisma/client";

type PostWithRelations = Post & {
  category?: Category | null;
  author?: User | null;
};

interface NewsCardProps {
  post: PostWithRelations;
}

export function NewsCard({ post }: NewsCardProps) {
  return (
    <Link href={`/news/${post.slug}`} className="property-card group block">
      <div className="relative overflow-hidden aspect-[16/9]">
        <Image
          src={post.featuredImage || "/images/news-placeholder.jpg"}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {post.category && (
          <div className="absolute top-3 left-3">
            <span className="status-badge bg-primary-800/80 text-white border border-white/10">
              <Tag size={9} className="mr-1" />
              {post.category.name}
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        {post.publishedAt && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <Calendar size={11} />
            {formatDateShort(post.publishedAt)}
          </div>
        )}
        <h3 className="font-bold text-primary-800 text-base mb-2 group-hover:text-secondary-600 transition-colors line-clamp-2 leading-snug"
          style={{ fontFamily: "var(--font-serif)" }}>
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
        )}
        <div className="flex items-center gap-1 text-xs font-semibold text-primary-600 group-hover:text-secondary-600 transition-colors">
          Read More <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

interface NewsSectionProps {
  posts: PostWithRelations[];
}

export function NewsSection({ posts }: NewsSectionProps) {
  if (posts.length === 0) return null;

  return (
    <section id="news" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="section-eyebrow mb-3">
              <span className="w-8 h-px bg-secondary-400" />
              News &amp; Insights
            </div>
            <h2 className="section-heading">Latest From Our Blog</h2>
          </div>
          <Link href="/news" className="btn-outline-primary flex-shrink-0">
            All Articles <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

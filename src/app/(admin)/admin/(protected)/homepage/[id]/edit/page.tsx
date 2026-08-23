import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import prisma from "@/lib/db";
import { parseJsonSafe } from "@/lib/utils";
import { HomepageSectionEditForm } from "@/components/admin/HomepageSectionEditForm";

export const metadata: Metadata = { title: "Edit Homepage Section | CMS" };

export default async function EditHomepageSectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const section = await prisma.homepageSection.findUnique({
    where: { id },
  });

  if (!section) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/homepage"
            className="p-2 text-gray-400 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1
              className="text-xl font-bold text-gray-800"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Section Not Found
            </h1>
            <p className="text-sm text-gray-500">
              The homepage section you are looking for does not exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const content = parseJsonSafe<Record<string, unknown>>(
    section.content,
    {}
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/homepage"
          className="p-2 text-gray-400 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1
            className="text-xl font-bold text-gray-800"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Edit: {section.title}
          </h1>
          <p className="text-sm text-gray-500">
            Update section content and images.
          </p>
        </div>
      </div>

      <div className="admin-card p-6">
        <HomepageSectionEditForm
          sectionId={section.id}
          sectionKey={section.key}
          title={section.title}
          content={content}
          isVisible={section.isVisible}
        />
      </div>
    </div>
  );
}

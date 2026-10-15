import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { ProjectHero } from "@/components/public/ProjectHero";
import { MediaRow } from "@/components/public/MediaRow";
import { ProjectMediaCard } from "@/components/public/ProjectMediaCard";
import { VideoGallery } from "@/components/public/VideoGallery";
import { ContactForm } from "@/components/public/ContactForm";
import { Check } from "lucide-react";
import Image from "next/image";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.name,
    description: project.shortDescription || `${project.name} by West 60 Mwangaza Properties.`,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await prisma.project
    .findUnique({
      where: { slug, isPublished: true },
      include: {
        images: { orderBy: { order: "asc" } },
        features: { orderBy: { order: "asc" } },
        videos: { orderBy: { order: "asc" } },
      },
    })
    .catch(() => null);

  if (!project) notFound();

  const related = await prisma.project
    .findMany({
      where: { isPublished: true, id: { not: project.id } },
      take: 6,
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
    })
    .catch(() => []);

  const featureList: string[] = (project.features || []).map(
    (f: { feature: string }) => f.feature
  );

  return (
    <>
      <ProjectHero project={project} features={featureList} />

      <section className="py-16" style={{ background: "var(--color-warm-white)" }}>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="space-y-8 lg:col-span-2">
            {(project.fullDescription || project.shortDescription) && (
              <div className="glass-card p-6">
                <h2
                  className="mb-4 text-xl font-bold text-primary-800"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  About This Project
                </h2>
                <div className="prose-brand">
                  <p>{project.fullDescription || project.shortDescription}</p>
                </div>
              </div>
            )}

            {featureList.length > 0 && (
              <div className="glass-card p-6">
                <h2
                  className="mb-4 text-xl font-bold text-primary-800"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Key Features
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {featureList.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <Check size={16} className="mt-0.5 flex-shrink-0 text-secondary-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(project.images?.length || 0) > 1 && (
              <div className="glass-card p-6">
                <h2
                  className="mb-4 text-xl font-bold text-primary-800"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Gallery
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {(project.images || []).map(
                    (img: { id: string; url: string; altText?: string | null }) => (
                      <div
                        key={img.id}
                        className="relative aspect-square overflow-hidden rounded-xl"
                      >
                        <Image
                          src={img.url}
                          alt={img.altText || project.name}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            <VideoGallery
              videos={(project.videos || []).map(
                (v: { id: string; youtubeUrl: string; title?: string | null }) => ({
                  id: v.id,
                  youtubeUrl: v.youtubeUrl,
                  title: v.title,
                })
              )}
              details={{
                slug: project.slug,
                name: project.name,
                location: project.location,
                status: project.status,
                shortDescription: project.shortDescription,
                features: featureList,
              }}
            />
          </div>

          <div>
            <div className="glass-card p-6" id="enquire">
              <h3
                className="mb-4 text-lg font-bold text-primary-800"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Enquire About This Project
              </h3>
              <ContactForm projectId={project.id} projectName={project.name} />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <MediaRow
              title="Other Projects"
              viewAllHref="/projects"
              viewAllLabel="All Projects"
              edgeFadeClass="from-white"
            >
              {related.map((p) => (
                <ProjectMediaCard key={p.id} project={p} />
              ))}
            </MediaRow>
          </div>
        </section>
      )}
    </>
  );
}

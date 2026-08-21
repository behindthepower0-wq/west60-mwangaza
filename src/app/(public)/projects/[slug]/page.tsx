import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { ProjectCard } from "@/components/public/ProjectCard";
import { ContactForm } from "@/components/public/ContactForm";
import { MapPin, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { getProjectStatusLabel } from "@/lib/utils";

interface Props { params: Promise<{ slug: string }> }

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
  const project = await prisma.project.findUnique({
    where: { slug, isPublished: true },
    include: { images: { orderBy: { order: "asc" } } },
  }).catch(() => null);

  if (!project) notFound();

  const related = await prisma.project.findMany({
    where: { isPublished: true, id: { not: project.id } },
    take: 3,
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
  }).catch(() => []);

  const heroImage = project.images[0]?.url || project.mainImage || "/images/project-placeholder.jpg";

  return (
    <>
      <div className="pt-24 pb-4" style={{ background: "var(--color-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
            <span>/</span>
            <span className="text-white/80">{project.name}</span>
          </div>
        </div>
      </div>

      <div className="relative h-72 md:h-96 bg-primary-100">
        <Image src={heroImage} alt={project.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <span className="status-badge bg-secondary-400/20 text-secondary-100 border border-secondary-400/30">
            {getProjectStatusLabel(project.status)}
          </span>
        </div>
      </div>

      <section className="py-16" style={{ background: "var(--color-warm-white)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <Link href="/projects" className="flex items-center gap-1 text-sm text-gray-400 hover:text-primary-600 transition-colors mb-4">
                <ArrowLeft size={14} /> Back to Projects
              </Link>
              <h1 className="section-heading mb-2">{project.name}</h1>
              {project.location && (
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin size={15} className="text-secondary-500" />
                  <span>{project.location}</span>
                </div>
              )}
            </div>

            {(project.fullDescription || project.shortDescription) && (
              <div className="glass-card p-6">
                <h2 className="font-bold text-primary-800 text-xl mb-4" style={{ fontFamily: "var(--font-serif)" }}>About This Project</h2>
                <div className="prose-brand">
                  <p>{project.fullDescription || project.shortDescription}</p>
                </div>
              </div>
            )}

            {project.images.length > 1 && (
              <div className="glass-card p-6">
                <h2 className="font-bold text-primary-800 text-xl mb-4" style={{ fontFamily: "var(--font-serif)" }}>Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {project.images.map(img => (
                    <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden">
                      <Image src={img.url} alt={img.altText || project.name} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="glass-card p-6">
              <h3 className="font-bold text-primary-800 text-lg mb-4" style={{ fontFamily: "var(--font-serif)" }}>Enquire About This Project</h3>
              <ContactForm projectId={project.id} />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="section-heading text-2xl">Other Projects</h2>
              <Link href="/projects" className="flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-secondary-600 transition-colors">
                All Projects <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

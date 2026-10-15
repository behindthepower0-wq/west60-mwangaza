import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { getProjectStatusLabel } from "@/lib/utils";
import type { Project } from "@prisma/client";

interface ProjectCardProps {
  project: Project & {
    images?: { url: string; altText?: string | null }[];
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const mainImage = project.images?.[0]?.url || project.mainImage || "/images/project-placeholder.jpg";

  return (
    <Link href={`/projects/${project.slug}`} className="property-card group block">
      <div className="relative overflow-hidden aspect-[16/9]">
        <Image
          src={mainImage}
          alt={project.images?.[0]?.altText || project.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary-400/20 text-secondary-200 border border-secondary-400/30">
            {getProjectStatusLabel(project.status)}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-primary-800 text-lg mb-1.5 group-hover:text-secondary-600 transition-colors"
          style={{ fontFamily: "var(--font-serif)" }}>
          {project.name}
        </h3>
        {project.location && (
          <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-3">
            <MapPin size={13} />
            <span>{project.location}</span>
          </div>
        )}
        {project.shortDescription && (
          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
            {project.shortDescription}
          </p>
        )}
        <div className="flex items-center gap-1 text-xs font-semibold text-primary-600 group-hover:text-secondary-600 transition-colors">
          View Project <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

interface ProjectsSectionProps {
  projects: (Project & {
    images?: { url: string; altText?: string | null }[];
  })[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" style={{ background: "var(--color-warm-white)" }} className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="section-eyebrow mb-3">
              <span className="w-8 h-px bg-secondary-400" />
              Our Projects
            </div>
            <h2 className="section-heading">Current &amp; Completed Projects</h2>
          </div>
          <Link href="/projects" className="btn-outline-primary flex-shrink-0">
            All Projects <ArrowRight size={16} />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-white">
            <div className="text-6xl mb-4">🏗️</div>
            <h3 className="text-xl font-bold text-primary-700 mb-2" style={{ fontFamily: "var(--font-serif)" }}>
              Projects Coming Soon
            </h3>
            <p className="text-gray-500 text-sm">Our project listings are being added. Contact us for details.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

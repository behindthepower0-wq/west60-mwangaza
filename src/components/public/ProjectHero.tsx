"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, MapPin, ArrowLeft } from "lucide-react";
import { getProjectStatusLabel, getYouTubeId } from "@/lib/utils";
import { VideoModal } from "./VideoModal";
import type { ProjectMedia } from "./ProjectMediaCard";

interface ProjectHeroProps {
  project: ProjectMedia;
  features?: string[];
}

const PLACEHOLDER = "/images/property-1.jpg";

/** Full-bleed cinematic project hero with an inline "Watch Video" action. */
export function ProjectHero({ project, features }: ProjectHeroProps) {
  const [open, setOpen] = useState(false);

  const videos = (project.videos || []).filter((v) => getYouTubeId(v.youtubeUrl));
  const hero =
    project.images?.[0]?.url || project.mainImage || PLACEHOLDER;

  return (
    <>
      <div className="relative h-[60vh] max-h-[680px] min-h-[420px] bg-primary-900">
        <Image
          src={hero}
          alt={project.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/95 via-primary-950/50 to-primary-950/30" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary-950/80 to-transparent" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 sm:pb-12 lg:px-8">
            <Link
              href="/projects"
              className="mb-4 inline-flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-white"
            >
              <ArrowLeft size={14} /> Back to Projects
            </Link>

            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-secondary-400/40 bg-secondary-400/25 px-2.5 py-1 text-xs font-semibold text-secondary-100">
                {getProjectStatusLabel(project.status)}
              </span>
              {project.location && (
                <span className="inline-flex items-center gap-1.5 text-sm text-white/75">
                  <MapPin size={14} />
                  {project.location}
                </span>
              )}
            </div>

            <h1
              className="mb-3 text-3xl font-bold text-white md:text-5xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {project.name}
            </h1>

            {project.shortDescription && (
              <p className="mb-5 line-clamp-3 max-w-2xl text-sm text-white/75 md:text-base">
                {project.shortDescription}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              {videos.length > 0 && (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary-800 shadow-lg transition hover:bg-secondary-50"
                >
                  <Play size={16} fill="currentColor" /> Watch Video
                </button>
              )}
              <a
                href="#enquire"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Enquire Now
              </a>
            </div>
          </div>
        </div>
      </div>

      {open && videos[0] && (
        <VideoModal
          video={{
            id: videos[0].id,
            youtubeUrl: videos[0].youtubeUrl,
            title: videos[0].title,
          }}
          details={{
            slug: project.slug,
            name: project.name,
            location: project.location,
            status: project.status,
            shortDescription: project.shortDescription,
            features,
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

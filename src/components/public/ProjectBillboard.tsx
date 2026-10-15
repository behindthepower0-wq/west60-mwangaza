"use client";

import Link from "next/link";
import Image from "next/image";
import { Play, MapPin, ArrowRight } from "lucide-react";
import {
  getProjectStatusLabel,
  getYouTubeThumbnail,
} from "@/lib/utils";
import { firstPlayableVideo, type ProjectMedia } from "./ProjectMediaCard";

interface ProjectBillboardProps {
  project: ProjectMedia;
  onPlay?: (project: ProjectMedia) => void;
}

const PLACEHOLDER = "/images/property-1.jpg";

/** Large featured-project hero, cinehype-style (backdrop + title + actions). */
export function ProjectBillboard({ project, onPlay }: ProjectBillboardProps) {
  const video = firstPlayableVideo(project);
  const canPlay = Boolean(onPlay && video);

  const photo = project.images?.[0]?.url || project.mainImage || PLACEHOLDER;
  const backdrop = video
    ? getYouTubeThumbnail(video.youtubeUrl, "hq") || photo
    : photo;

  return (
    <div className="relative flex min-h-[380px] items-end overflow-hidden rounded-3xl md:min-h-[460px]">
      <Image
        src={backdrop}
        alt={project.name}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-950/95 via-primary-950/60 to-primary-950/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-950/80 via-primary-950/20 to-transparent" />

      <div className="relative z-10 max-w-2xl p-6 sm:p-10">
        <div className="section-eyebrow mb-3">
          <span className="h-px w-8 bg-secondary-400" /> Featured Project
        </div>
        <h3
          className="mb-3 text-3xl font-bold text-white md:text-5xl"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {project.name}
        </h3>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-xs font-semibold text-white">
            {getProjectStatusLabel(project.status)}
          </span>
          {project.location && (
            <span className="inline-flex items-center gap-1.5 text-sm text-white/75">
              <MapPin size={14} />
              {project.location}
            </span>
          )}
        </div>
        {project.shortDescription && (
          <p className="mb-6 line-clamp-3 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
            {project.shortDescription}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3">
          {canPlay && (
            <button
              type="button"
              onClick={() => onPlay?.(project)}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary-800 shadow-lg transition hover:bg-secondary-50"
            >
              <Play size={16} fill="currentColor" /> Watch Video
            </button>
          )}
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            View Project <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

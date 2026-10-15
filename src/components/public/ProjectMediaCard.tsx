"use client";

import Link from "next/link";
import Image from "next/image";
import { Play, MapPin, ArrowRight } from "lucide-react";
import {
  cn,
  getProjectStatusLabel,
  getYouTubeId,
  getYouTubeThumbnail,
} from "@/lib/utils";

export interface ProjectMediaVideo {
  id: string;
  youtubeUrl: string;
  title?: string | null;
}

export interface ProjectMedia {
  id: string;
  slug: string;
  name: string;
  location?: string | null;
  shortDescription?: string | null;
  status: string;
  mainImage?: string | null;
  images?: { url: string; altText?: string | null }[];
  videos?: ProjectMediaVideo[];
}

interface ProjectMediaCardProps {
  project: ProjectMedia;
  /** When provided, clicking the card plays the project's first video. */
  onPlay?: (project: ProjectMedia) => void;
  /** Above-the-fold card: skip lazy loading. */
  priority?: boolean;
}

const PLACEHOLDER = "/images/property-1.jpg";

/** First YouTube video that has a resolvable id. */
export function firstPlayableVideo(project: ProjectMedia) {
  return (project.videos || []).find((v) => getYouTubeId(v.youtubeUrl)) || null;
}

export function ProjectMediaCard({
  project,
  onPlay,
  priority = false,
}: ProjectMediaCardProps) {
  const video = firstPlayableVideo(project);
  const canPlay = Boolean(onPlay && video);

  const photo =
    project.images?.[0]?.url || project.mainImage || PLACEHOLDER;
  const backdrop = video
    ? getYouTubeThumbnail(video.youtubeUrl, "hq") || photo
    : photo;
  const href = `/projects/${project.slug}`;

  return (
    <div className="group relative w-[280px] shrink-0 snap-start sm:w-[330px] lg:w-[380px]">
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-primary-900 shadow-[var(--shadow-card)] ring-1 ring-black/5 transition-transform duration-500 group-hover:-translate-y-1">
        <Image
          src={backdrop}
          alt={project.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 280px, (max-width: 1024px) 330px, 380px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        <span className="absolute left-3 top-3 z-[3] inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-primary-700 shadow-sm">
          {getProjectStatusLabel(project.status)}
        </span>

        {canPlay && (
          <span className="absolute right-3 top-3 z-[3] inline-flex items-center gap-1.5 rounded-full bg-secondary/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            <Play size={11} fill="currentColor" /> Video
          </span>
        )}

        {canPlay && (
          <span className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:bg-white">
              <Play size={22} className="ml-0.5 text-primary-800" fill="currentColor" />
            </span>
          </span>
        )}

        <div className="absolute bottom-0 left-0 right-0 z-[3] p-4">
          <h3
            className="line-clamp-1 text-lg font-bold leading-tight text-white"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {project.name}
          </h3>
          {project.location && (
            <div className="mt-1 flex items-center gap-1.5 text-xs text-white/70">
              <MapPin size={12} />
              <span className="line-clamp-1">{project.location}</span>
            </div>
          )}
        </div>

        {/* Click layer: play when a video is available, otherwise navigate. */}
        {canPlay ? (
          <button
            type="button"
            onClick={() => onPlay?.(project)}
            aria-label={`Play ${project.name} video`}
            className="absolute inset-0 z-[1] cursor-pointer"
          />
        ) : (
          <Link
            href={href}
            aria-label={project.name}
            className="absolute inset-0 z-[1]"
          />
        )}
      </div>

      <div className="flex items-center justify-between gap-3 px-0.5 pt-3">
        {project.shortDescription ? (
          <p className="line-clamp-1 text-xs text-text-muted">
            {project.shortDescription}
          </p>
        ) : (
          <span />
        )}
        <Link
          href={href}
          className={cn(
            "relative z-[4] inline-flex flex-shrink-0 items-center gap-1 text-xs font-semibold text-primary-600 transition-colors hover:text-secondary-600"
          )}
        >
          View Project <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}

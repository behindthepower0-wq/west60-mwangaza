"use client";

import { useMemo, useState } from "react";
import { getYouTubeId } from "@/lib/utils";
import { MediaRow } from "./MediaRow";
import { ProjectBillboard } from "./ProjectBillboard";
import {
  ProjectMediaCard,
  firstPlayableVideo,
  type ProjectMedia,
} from "./ProjectMediaCard";
import { VideoModal, type ProjectVideo } from "./VideoModal";

interface ProjectsShowcaseProps {
  projects: ProjectMedia[];
  /** "home" adds a featured billboard; "listing" renders one row per status. */
  variant?: "home" | "listing";
}

const STATUS_ORDER: { key: string; title: string }[] = [
  { key: "ONGOING", title: "Ongoing Projects" },
  { key: "COMPLETED", title: "Completed Projects" },
  { key: "PLANNING", title: "Planning" },
  { key: "ON_HOLD", title: "On Hold" },
];

export function ProjectsShowcase({
  projects,
  variant = "home",
}: ProjectsShowcaseProps) {
  const [active, setActive] = useState<{
    project: ProjectMedia;
    videoIndex: number;
  } | null>(null);

  const openProject = (project: ProjectMedia) =>
    setActive({ project, videoIndex: 0 });

  const activeVideos: ProjectVideo[] = useMemo(() => {
    if (!active) return [];
    return (active.project.videos || [])
      .filter((v) => getYouTubeId(v.youtubeUrl))
      .map((v) => ({ id: v.id, youtubeUrl: v.youtubeUrl, title: v.title }));
  }, [active]);

  const groups = useMemo(() => {
    if (variant !== "listing") return [];
    const rows = STATUS_ORDER.map((o) => ({
      ...o,
      items: projects.filter((p) => p.status === o.key),
    })).filter((r) => r.items.length > 0);
    const known = new Set(STATUS_ORDER.map((o) => o.key));
    const others = projects.filter((p) => !known.has(p.status));
    if (others.length) rows.push({ key: "OTHER", title: "More Projects", items: others });
    return rows;
  }, [projects, variant]);

  if (projects.length === 0) {
    return (
      <div className="rounded-3xl bg-white py-20 text-center">
        <div className="mb-4 text-6xl">🏗️</div>
        <h3
          className="mb-2 text-xl font-bold text-primary-700"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Projects Coming Soon
        </h3>
        <p className="text-sm text-gray-500">
          Our project portfolio is being set up. Contact us for details.
        </p>
      </div>
    );
  }

  const withVideos = projects.filter((p) => firstPlayableVideo(p));

  const renderCard = (project: ProjectMedia, index: number) => (
    <ProjectMediaCard
      key={project.id}
      project={project}
      onPlay={openProject}
      priority={index < 2}
    />
  );

  const activeVideo =
    active && activeVideos.length > 0
      ? activeVideos[Math.min(active.videoIndex, activeVideos.length - 1)]
      : null;

  return (
    <div className="space-y-14">
      {variant === "home" ? (
        <>
          <ProjectBillboard project={projects[0]} onPlay={openProject} />

          {withVideos.length > 0 ? (
            <MediaRow
              title="Watch Our Projects"
              subtitle="Step onto site with our latest project videos."
              viewAllHref="/projects"
              viewAllLabel="All Projects"
            >
              {withVideos.map(renderCard)}
            </MediaRow>
          ) : (
            <MediaRow
              title="Our Projects"
              viewAllHref="/projects"
              viewAllLabel="All Projects"
            >
              {projects.map(renderCard)}
            </MediaRow>
          )}
        </>
      ) : (
        groups.map((group) => (
          <MediaRow key={group.key} title={group.title}>
            {group.items.map(renderCard)}
          </MediaRow>
        ))
      )}

      {active && activeVideo && (
        <VideoModal
          video={activeVideo}
          details={{
            slug: active.project.slug,
            name: active.project.name,
            location: active.project.location,
            status: active.project.status,
            shortDescription: active.project.shortDescription,
          }}
          onClose={() => setActive(null)}
          onNext={
            active.videoIndex < activeVideos.length - 1
              ? () =>
                  setActive((prev) =>
                    prev ? { ...prev, videoIndex: prev.videoIndex + 1 } : prev
                  )
              : undefined
          }
        />
      )}
    </div>
  );
}

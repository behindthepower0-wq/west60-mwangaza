"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { getYouTubeThumbnail, getYouTubeId } from "@/lib/utils";
import { VideoModal, type ProjectVideo, type VideoDetails } from "./VideoModal";

interface VideoGalleryProps {
  videos: ProjectVideo[];
  details: VideoDetails;
}

export function VideoGallery({ videos, details }: VideoGalleryProps) {
  const [active, setActive] = useState<number | null>(null);

  const valid = videos.filter((v) => getYouTubeId(v.youtubeUrl));
  if (valid.length === 0) return null;

  const current = active !== null ? valid[active] : null;

  return (
    <div className="glass-card p-6">
      <h2
        className="font-bold text-primary-800 text-xl mb-4"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Videos
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {valid.map((video, i) => {
          const thumb = getYouTubeThumbnail(video.youtubeUrl, "hq");
          return (
            <button
              key={video.id}
              type="button"
              onClick={() => setActive(i)}
              className="group relative block w-full text-left aspect-video rounded-xl overflow-hidden bg-primary-900 ring-1 ring-black/5"
            >
              {thumb && (
                <Image
                  src={thumb}
                  alt={video.title || details.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {/* Native play button */}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-14 h-14 rounded-full bg-white/95 group-hover:bg-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Play size={22} className="text-primary-800 ml-0.5" fill="currentColor" />
                </span>
              </span>
              {video.title && (
                <span className="absolute bottom-0 left-0 right-0 p-3 text-white text-sm font-semibold line-clamp-2">
                  {video.title}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {current && (
        <VideoModal
          video={current}
          details={details}
          onClose={() => setActive(null)}
          onNext={active !== null && active < valid.length - 1 ? () => setActive(active + 1) : undefined}
        />
      )}
    </div>
  );
}

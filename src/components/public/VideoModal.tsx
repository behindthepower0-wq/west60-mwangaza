"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useRef } from "react";
import Link from "next/link";
import { X, Maximize2, MapPin, Play, Check, ArrowRight } from "lucide-react";
import { getYouTubeEmbedUrl, getProjectStatusLabel } from "@/lib/utils";

export interface ProjectVideo {
  id: string;
  youtubeUrl: string;
  title?: string | null;
}

export interface VideoDetails {
  slug: string;
  name: string;
  location?: string | null;
  status?: string | null;
  shortDescription?: string | null;
  features?: string[];
}

interface VideoModalProps {
  video: ProjectVideo;
  details: VideoDetails;
  onClose: () => void;
  onNext?: () => void;
}

export function VideoModal({ video, details, onClose, onNext }: VideoModalProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const embed = getYouTubeEmbedUrl(video.youtubeUrl);

  const toggleFullscreen = () => {
    const el = playerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void el.requestFullscreen?.();
    }
  };

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed inset-0 z-[101] overflow-y-auto focus:outline-none animate-fade-up"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">{video.title || details.name}</Dialog.Title>

          <div className="min-h-full flex items-start sm:items-center justify-center p-3 sm:p-8">
            <div className="relative w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl bg-primary-950 ring-1 ring-white/10 grid lg:grid-cols-5">
              {/* Player */}
              <div className="lg:col-span-3 bg-black">
                <div ref={playerRef} className="relative aspect-video bg-black">
                  {embed && (
                    <iframe
                      src={embed}
                      title={video.title || details.name}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  )}
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    title="Fullscreen"
                    className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-black/60 text-white/90 hover:bg-black/80 hover:text-white transition-colors"
                  >
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>

              {/* Details (Netflix-style title panel) */}
              <div className="lg:col-span-2 p-6 sm:p-8 text-white space-y-5">
                <div className="space-y-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary-400/20 text-secondary-200 border border-secondary-400/30">
                    {getProjectStatusLabel(details.status || "ONGOING")}
                  </span>
                  <h2
                    className="text-2xl sm:text-3xl font-bold leading-tight"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {details.name}
                  </h2>
                  {details.location && (
                    <div className="flex items-center gap-1.5 text-white/50 text-sm">
                      <MapPin size={14} />
                      <span>{details.location}</span>
                    </div>
                  )}
                </div>

                {details.shortDescription && (
                  <p className="text-white/70 text-sm leading-relaxed">{details.shortDescription}</p>
                )}

                {details.features && details.features.length > 0 && (
                  <ul className="space-y-2">
                    {details.features.slice(0, 6).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-white/75">
                        <Check size={15} className="mt-0.5 flex-shrink-0 text-secondary-400" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href={`/projects/${details.slug}`}
                    className="btn-secondary text-sm px-5 py-2.5"
                    onClick={onClose}
                  >
                    View Full Project <ArrowRight size={14} />
                  </Link>
                  {onNext && (
                    <button
                      type="button"
                      onClick={onNext}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors"
                    >
                      <Play size={14} /> Next Video
                    </button>
                  )}
                </div>
              </div>

              {/* Close */}
              <Dialog.Close
                className="absolute top-3 left-3 z-10 p-2 rounded-lg bg-black/60 text-white/90 hover:bg-black/80 hover:text-white transition-colors"
                aria-label="Close video"
              >
                <X size={18} />
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

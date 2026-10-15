"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaRowProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  /** Tailwind color class used by the scroll edge fades (must match the section background). */
  edgeFadeClass?: string;
  children: ReactNode;
}

/**
 * Netflix/cinehype-style horizontal carousel: a snap-scrolling track with
 * arrow controls and edge fades. Cards are supplied as children and should
 * include `snap-start shrink-0`.
 */
export function MediaRow({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "View all",
  edgeFadeClass = "from-[var(--color-warm-white)]",
  children,
}: MediaRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
  }, []);

  useEffect(() => {
    update();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollByDir = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.8, 320);
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * amount, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="relative">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="section-heading text-2xl md:text-3xl">{title}</h2>
          {subtitle && (
            <p className="section-subheading mt-2 max-w-2xl text-sm">{subtitle}</p>
          )}
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="mr-1 hidden items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-secondary-600 sm:inline-flex"
            >
              {viewAllLabel} <ArrowRight size={14} />
            </Link>
          )}
          <button
            type="button"
            onClick={() => scrollByDir(-1)}
            disabled={atStart}
            aria-label={`Scroll ${title} left`}
            className="rounded-full border border-primary-100 p-2 text-primary-600 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollByDir(1)}
            disabled={atEnd}
            aria-label={`Scroll ${title} right`}
            className="rounded-full border border-primary-100 p-2 text-primary-600 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r to-transparent transition-opacity duration-300",
            edgeFadeClass,
            atStart ? "opacity-0" : "opacity-100"
          )}
          aria-hidden
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l to-transparent transition-opacity duration-300",
            edgeFadeClass,
            atEnd ? "opacity-0" : "opacity-100"
          )}
          aria-hidden
        />
        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x gap-5 overflow-x-auto pb-2"
          style={{ scrollBehavior: "smooth" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number | null | undefined,
  currency = "KES"
): string {
  if (!price) return "Price on Request";
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateShort(date: Date | string | null | undefined): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + "…";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getWhatsAppUrl(phone: string, message?: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const withCode = cleaned.startsWith("0")
    ? "254" + cleaned.slice(1)
    : cleaned;
  const encoded = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${withCode}${encoded ? `?text=${encoded}` : ""}`;
}

export function getPropertyStatusLabel(status: string): string {
  const map: Record<string, string> = {
    AVAILABLE: "Available",
    RESERVED: "Reserved",
    SOLD_OUT: "Sold Out",
    COMING_SOON: "Coming Soon",
    UNDER_CONSTRUCTION: "Under Construction",
    COMPLETED: "Completed",
  };
  return map[status] || status;
}

export function getPropertyStatusClass(status: string): string {
  const map: Record<string, string> = {
    AVAILABLE: "status-available",
    RESERVED: "status-reserved",
    SOLD_OUT: "status-sold",
    COMING_SOON: "status-coming-soon",
    UNDER_CONSTRUCTION: "status-construction",
    COMPLETED: "status-completed",
  };
  return `status-badge ${map[status] || ""}`;
}

export function getProjectStatusLabel(status: string): string {
  const map: Record<string, string> = {
    PLANNING: "Planning",
    ONGOING: "Ongoing",
    COMPLETED: "Completed",
    ON_HOLD: "On Hold",
  };
  return map[status] || status;
}

// ─── YouTube helpers ──────────────────────────────────────────────────

/** Extract the 11-character video id from any common YouTube URL form. */
export function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/watch\?[^#]*\bv=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
    /youtube\.com\/live\/([\w-]{11})/,
    /youtube-nocookie\.com\/embed\/([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  // Allow a bare 11-char id
  const bare = url.trim().match(/^[\w-]{11}$/);
  return bare ? bare[0] : null;
}

/** Thumbnail image URL for a YouTube video. */
export function getYouTubeThumbnail(
  url: string | null | undefined,
  quality: "max" | "hq" | "mq" = "hq",
): string | null {
  const id = getYouTubeId(url);
  if (!id) return null;
  const file =
    quality === "max" ? "maxresdefault" : quality === "mq" ? "mqdefault" : "hqdefault";
  return `https://i.ytimg.com/vi/${id}/${file}.jpg`;
}

/** Privacy-enhanced, autoplay embed URL for a YouTube video. */
export function getYouTubeEmbedUrl(url: string | null | undefined): string | null {
  const id = getYouTubeId(url);
  if (!id) return null;
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
}

export interface PlotStats {
  total: number;
  sold: number;
  remaining: number;
  percent: number;
}

export function getPlotStats(
  totalPlots: number | null | undefined,
  soldPlots: number | null | undefined
): PlotStats | null {
  if (!totalPlots || totalPlots <= 0) return null;
  const total = Math.round(totalPlots);
  const sold = Math.max(0, Math.min(Math.round(soldPlots || 0), total));
  return {
    total,
    sold,
    remaining: total - sold,
    percent: Math.round((sold / total) * 100),
  };
}

export function parseJsonSafe<T>(json: string | null | undefined, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

export function isScheduledPublished(
  status: string,
  scheduledAt: Date | null | undefined
): boolean {
  if (status === "PUBLISHED") return true;
  if (status === "SCHEDULED" && scheduledAt) {
    return new Date(scheduledAt) <= new Date();
  }
  return false;
}

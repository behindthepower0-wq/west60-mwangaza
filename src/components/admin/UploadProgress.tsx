"use client";

import { Loader2 } from "lucide-react";

interface UploadProgressProps {
  progress: number; // 0-100
  isUploading: boolean;
  fileName?: string;
}

export function UploadProgress({
  progress,
  isUploading,
  fileName,
}: UploadProgressProps) {
  if (!isUploading) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 size={12} className="animate-spin" />
          <span className="truncate max-w-[200px]">
            {fileName || "Uploading..."}
          </span>
        </div>
        <span className="font-medium text-primary-600">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            background:
              progress < 100
                ? "linear-gradient(90deg, var(--color-primary), var(--color-primary-light))"
                : "var(--color-primary)",
          }}
        />
      </div>
    </div>
  );
}

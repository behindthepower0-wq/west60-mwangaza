"use client";

import { useState, useCallback } from "react";

interface UploadResult {
  url: string;
  urls?: { large: string; medium: string; thumbnail: string };
  name: string;
}

interface UseFileUploadOptions {
  category?: string;
  onProgress?: (percent: number) => void;
}

/**
 * Custom hook that uploads files via XMLHttpRequest to get progress events.
 * Falls back to fetch if XHR fails.
 */
export function useFileUpload(options: UseFileUploadOptions = {}) {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File): Promise<UploadResult | null> => {
      // Validate before uploading
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/svg+xml",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError("Only image files are allowed (JPEG, PNG, WebP, GIF, SVG)");
        return null;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Image must be less than 10MB");
        return null;
      }

      setIsUploading(true);
      setProgress(0);
      setError(null);

      try {
        const result = await uploadWithProgress(file, options.category);
        setProgress(100);
        options.onProgress?.(100);
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Upload failed";
        setError(message);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [options.category, options.onProgress],
  );

  const reset = useCallback(() => {
    setProgress(0);
    setIsUploading(false);
    setError(null);
  }, []);

  return { upload, progress, isUploading, error, reset };
}

/**
 * Upload a file using XMLHttpRequest for progress tracking.
 * Returns the parsed JSON response from /api/upload.
 */
function uploadWithProgress(
  file: File,
  category?: string,
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    if (category) formData.append("category", category);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percent = (e.loaded / e.total) * 100;
        // Dispatch a custom event so parent components can react
        window.dispatchEvent(
          new CustomEvent("upload-progress", {
            detail: { percent, fileName: file.name },
          }),
        );
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } catch {
          reject(new Error("Invalid response from server"));
        }
      } else if (xhr.status === 401) {
        reject(new Error("Unauthorized — please log in again"));
      } else {
        reject(
          new Error(xhr.responseText || `Upload failed (${xhr.status})`),
        );
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error during upload"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload cancelled"));
    });

    xhr.open("POST", "/api/upload");
    xhr.send(formData);
  });
}

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, Image } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { UploadProgress } from "@/components/admin/UploadProgress";

interface ImageUploaderProps {
  currentUrl?: string | null;
  onUpload: (url: string, filename: string) => void;
  label?: string;
  className?: string;
  category?: string;
}

export function ImageUploader({
  currentUrl,
  onUpload,
  label = "Upload Image",
  className = "",
  category,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadFileName, setUploadFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { upload, progress, isUploading, error } = useFileUpload({
    category,
  });

  // Listen for progress events from XHR
  const [xhrProgress, setXhrProgress] = useState(0);
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setXhrProgress(detail.percent);
    };
    window.addEventListener("upload-progress", handler);
    return () => window.removeEventListener("upload-progress", handler);
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      // Show local preview immediately
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);
      setUploadFileName(file.name);

      const result = await upload(file);

      if (result) {
        URL.revokeObjectURL(localPreview);
        setPreview(result.url);
        onUpload(result.url, result.name);
      } else {
        URL.revokeObjectURL(localPreview);
        setPreview(currentUrl || null);
      }
    },
    [upload, currentUrl, onUpload],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload("", "");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={className}>
      <label className="form-label">{label}</label>

      {preview ? (
        <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          {/* Overlay controls */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2 bg-white/90 rounded-lg text-sm font-medium text-gray-800 hover:bg-white transition-colors flex items-center gap-2"
            >
              <Upload size={14} /> Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 bg-red-500/90 rounded-lg text-sm font-medium text-white hover:bg-red-500 transition-colors flex items-center gap-2"
            >
              <X size={14} /> Remove
            </button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center px-8">
              <div className="w-full max-w-xs">
                <UploadProgress
                  progress={xhrProgress || progress}
                  isUploading={isUploading}
                  fileName={uploadFileName}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !isUploading && inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging
              ? "border-primary-500 bg-primary-50/50"
              : "border-gray-200 hover:border-primary-400 hover:bg-gray-50"
          } ${isUploading ? "cursor-wait" : "cursor-pointer"}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <UploadProgress
                progress={xhrProgress || progress}
                isUploading={isUploading}
                fileName={uploadFileName}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center">
                <Image size={24} className="text-primary-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, WebP up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}

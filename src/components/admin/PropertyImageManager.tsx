"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  X,
  Image,
  Loader2,
  Star,
  Plus,
} from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { UploadProgress } from "@/components/admin/UploadProgress";

interface PropertyImage {
  id: string;
  url: string;
  altText: string | null;
  caption: string | null;
  order: number;
}

interface PropertyImageManagerProps {
  propertyId: string;
  mainImage?: string | null;
  images: PropertyImage[];
  onUpdate: () => void;
}

export function PropertyImageManager({
  propertyId,
  mainImage,
  images: initialImages,
  onUpdate,
}: PropertyImageManagerProps) {
  const [images, setImages] = useState<PropertyImage[]>(initialImages);
  const [currentMainImage, setCurrentMainImage] = useState<string | null>(
    mainImage || null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingMainId, setSettingMainId] = useState<string | null>(null);
  const [uploadFileName, setUploadFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { upload, progress, isUploading, error: uploadError } = useFileUpload({ category: "PROPERTIES" });
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
      setError("");
      setUploadFileName(file.name);

      const uploadData = await upload(file);
      if (!uploadData) return;

      try {
        // Add as property image
        const isFirst = images.length === 0;
        const imageRes = await fetch(`/api/properties/${propertyId}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: uploadData.url,
            altText: file.name.replace(/\.[^.]+$/, ""),
            setAsMain: isFirst,
          }),
        });

        if (!imageRes.ok) throw new Error("Failed to add image");

        const newImage = await imageRes.json();
        setImages((prev) => [...prev, newImage]);

        if (isFirst) {
          setCurrentMainImage(uploadData.url);
        }

        onUpdate();
      } catch {
        setError("Failed to add image to property.");
      }
    },
    [upload, images.length, propertyId, onUpdate]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => handleFile(file));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    Array.from(files).forEach((file) => handleFile(file));
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Remove this image from the property?")) return;

    setDeletingId(imageId);
    try {
      const res = await fetch(
        `/api/properties/${propertyId}/images?imageId=${imageId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== imageId));
        // If we deleted the main image, the API already handled reassigning
        const deletedImage = images.find((img) => img.id === imageId);
        if (deletedImage?.url === currentMainImage) {
          const remaining = images.filter((img) => img.id !== imageId);
          setCurrentMainImage(remaining[0]?.url || null);
        }
        onUpdate();
      }
    } catch {
      setError("Failed to delete image");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetMain = async (imageId: string) => {
    setSettingMainId(imageId);
    try {
      const res = await fetch(`/api/properties/${propertyId}/images`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId, setAsMain: true }),
      });

      if (res.ok) {
        const image = images.find((img) => img.id === imageId);
        if (image) {
          setCurrentMainImage(image.url);
        }
        onUpdate();
      }
    } catch {
      setError("Failed to set main image");
    } finally {
      setSettingMainId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="form-label mb-0">Property Images</label>
        <span className="text-xs text-gray-400">
          {images.length} image{images.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Main Image Display */}
      {currentMainImage && (
        <div className="relative rounded-xl overflow-hidden border border-primary-200 bg-primary-50/30">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 border-b border-primary-100">
            <Star size={12} className="text-primary-500 fill-primary-500" />
            <span className="text-xs font-semibold text-primary-700">
              Main Image
            </span>
          </div>
          <img
            src={currentMainImage}
            alt="Main property image"
            className="w-full h-56 object-cover"
          />
        </div>
      )}

      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-6 text-center transition-all
          ${
            isDragging
              ? "border-primary-500 bg-primary-50/50"
              : "border-gray-200 hover:border-primary-400 hover:bg-gray-50"
          } ${isUploading ? "cursor-wait" : "cursor-pointer"}`}
      >
        {isUploading ? (
          <div className="flex justify-center py-2">
            <UploadProgress
              progress={xhrProgress || progress}
              isUploading={isUploading}
              fileName={uploadFileName}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
              <Plus size={20} className="text-primary-500" />
            </div>
            <p className="text-sm text-gray-600">
              Click or drag to add more images
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, WebP up to 10MB</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      {(error || uploadError) && (
        <p className="text-xs text-red-500 flex items-center gap-1">{error || uploadError}</p>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className={`group relative rounded-xl overflow-hidden border-2 transition-colors ${
                img.url === currentMainImage
                  ? "border-primary-400 ring-2 ring-primary-200"
                  : "border-gray-100 hover:border-gray-300"
              }`}
            >
              <img
                src={img.url}
                alt={img.altText || "Property image"}
                className="w-full aspect-square object-cover"
              />
              {/* Hover controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {img.url !== currentMainImage && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetMain(img.id);
                    }}
                    disabled={settingMainId === img.id}
                    className="p-2 bg-white/90 rounded-lg text-gray-700 hover:bg-white transition-colors"
                    title="Set as main image"
                  >
                    {settingMainId === img.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Star size={14} />
                    )}
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(img.id);
                  }}
                  disabled={deletingId === img.id}
                  className="p-2 bg-red-500/90 rounded-lg text-white hover:bg-red-500 transition-colors"
                  title="Remove image"
                >
                  {deletingId === img.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <X size={14} />
                  )}
                </button>
              </div>
              {/* Main badge */}
              {img.url === currentMainImage && (
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 bg-primary-500 rounded text-[10px] text-white font-semibold flex items-center gap-1">
                    <Star size={8} className="fill-white" /> Main
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

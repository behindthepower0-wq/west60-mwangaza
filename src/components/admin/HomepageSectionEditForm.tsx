"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Loader2,
  Upload,
  X,
  Image,
  Eye,
  EyeOff,
} from "lucide-react";

interface HomepageSectionEditFormProps {
  sectionId: string;
  sectionKey: string;
  title: string;
  content: Record<string, unknown>;
  isVisible: boolean;
}

// Define which image fields each section type has
const sectionImageFields: Record<string, { key: string; label: string }[]> = {
  hero: [
    { key: "backgroundImage", label: "Hero Background Image" },
    { key: "mobileImage", label: "Hero Mobile Image" },
  ],
  about: [
    { key: "image", label: "About Section Image" },
    { key: "secondaryImage", label: "Secondary Image" },
  ],
  properties: [
    { key: "backgroundImage", label: "Properties Background Image" },
  ],
  projects: [
    { key: "backgroundImage", label: "Projects Background Image" },
  ],
  whychooseus: [
    { key: "image", label: "Why Choose Us Image" },
    { key: "backgroundImage", label: "Background Image" },
  ],
  team: [
    { key: "backgroundImage", label: "Team Section Background" },
  ],
  testimonials: [
    { key: "backgroundImage", label: "Testimonials Background" },
  ],
  cta: [
    { key: "backgroundImage", label: "CTA Background Image" },
  ],
  statistics: [],
  news: [],
};

export function HomepageSectionEditForm({
  sectionId,
  sectionKey,
  title,
  content: initialContent,
  isVisible: initialVisible,
}: HomepageSectionEditFormProps) {
  const router = useRouter();
  const [content, setContent] = useState<Record<string, unknown>>(
    initialContent
  );
  const [isVisible, setIsVisible] = useState(initialVisible);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savingImageKey, setSavingImageKey] = useState<string | null>(null);
  const [error, setError] = useState("");

  const imageFields = sectionImageFields[sectionKey] || [];

  const handleContentChange = (key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = useCallback(
    async (imageKey: string, file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      setSavingImageKey(imageKey);
      setError("");

      try {
        // Upload the file
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Upload failed");
        const uploadData = await uploadRes.json();

        // Update the section's content with the new image URL
        const updateRes = await fetch(
          `/api/admin/homepage/${sectionId}/image`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageKey,
              imageUrl: uploadData.url,
            }),
          }
        );

        if (!updateRes.ok) throw new Error("Failed to update section");

        // Update local state
        setContent((prev) => ({ ...prev, [imageKey]: uploadData.url }));
      } catch {
        setError("Image upload failed. Please try again.");
      } finally {
        setSavingImageKey(null);
      }
    },
    [sectionId]
  );

  const handleRemoveImage = useCallback(
    async (imageKey: string) => {
      setSavingImageKey(imageKey);
      setError("");

      try {
        const updateRes = await fetch(
          `/api/admin/homepage/${sectionId}/image`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageKey,
              imageUrl: "",
            }),
          }
        );

        if (!updateRes.ok) throw new Error("Failed to update section");

        setContent((prev) => ({ ...prev, [imageKey]: "" }));
      } catch {
        setError("Failed to remove image.");
      } finally {
        setSavingImageKey(null);
      }
    },
    [sectionId]
  );

  const handleSave = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [`homepage_section_${sectionKey}`]: JSON.stringify(content),
        }),
      });

      // Also update visibility
      await fetch(`/api/admin/homepage/${sectionId}/visibility`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible }),
      }).catch(() => {});

      if (!res.ok) throw new Error("Failed to save");

      router.push("/admin/homepage");
      router.refresh();
    } catch {
      setError("Failed to save changes.");
      setIsSubmitting(false);
    }
  };

  // Generic text fields based on section key
  const textFieldEntries = Object.entries(content).filter(
    ([key, val]) =>
      typeof val === "string" &&
      !imageFields.some((f) => f.key === key) &&
      !key.includes("image") &&
      !key.includes("Image")
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Visibility toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3">
          {isVisible ? (
            <Eye size={18} className="text-green-500" />
          ) : (
            <EyeOff size={18} className="text-gray-400" />
          )}
          <div>
            <p className="text-sm font-medium text-gray-700">
              Section Visibility
            </p>
            <p className="text-xs text-gray-500">
              {isVisible
                ? "This section is visible on the homepage"
                : "This section is hidden from the homepage"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isVisible ? "bg-primary-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isVisible ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Image Fields */}
      {imageFields.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm">
            Section Images
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {imageFields.map((field) => {
              const currentUrl = content[field.key] as string | null;
              return (
                <ImageField
                  key={field.key}
                  label={field.label}
                  currentUrl={currentUrl}
                  isUploading={savingImageKey === field.key}
                  onUpload={(file) => handleImageUpload(field.key, file)}
                  onRemove={() => handleRemoveImage(field.key)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Text Content Fields */}
      {textFieldEntries.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm">
            Section Content
          </h3>
          {textFieldEntries.map(([key, val]) => (
            <div key={key}>
              <label className="form-label capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </label>
              {typeof val === "string" && val.length > 100 ? (
                <textarea
                  value={val}
                  onChange={(e) => handleContentChange(key, e.target.value)}
                  rows={4}
                  className="form-input resize-y"
                />
              ) : (
                <input
                  type="text"
                  value={typeof val === "string" ? val : ""}
                  onChange={(e) => handleContentChange(key, e.target.value)}
                  className="form-input"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className="btn-primary text-sm"
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save Changes
        </button>
      </div>
    </div>
  );
}

// Sub-component for individual image fields
function ImageField({
  label,
  currentUrl,
  isUploading,
  onUpload,
  onRemove,
}: {
  label: string;
  currentUrl: string | null;
  isUploading: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onUpload(file);
  };

  return (
    <div className="space-y-2">
      <label className="form-label">{label}</label>
      {currentUrl ? (
        <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          <img
            src={currentUrl}
            alt={label}
            className="w-full h-40 object-cover"
          />
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
              onClick={onRemove}
              className="px-4 py-2 bg-red-500/90 rounded-lg text-sm font-medium text-white hover:bg-red-500 transition-colors flex items-center gap-2"
            >
              <X size={14} /> Remove
            </button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="flex items-center gap-2 text-white text-sm">
                <Loader2 size={18} className="animate-spin" /> Uploading...
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
          onClick={() => inputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
            ${
              isDragging
                ? "border-primary-500 bg-primary-50/50"
                : "border-gray-200 hover:border-primary-400 hover:bg-gray-50"
            }
          `}
        >
          {isUploading ? (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Loader2 size={16} className="animate-spin" /> Uploading...
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                <Image size={20} className="text-primary-500" />
              </div>
              <p className="text-sm text-gray-600">
                Click or drag to upload
              </p>
            </div>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}

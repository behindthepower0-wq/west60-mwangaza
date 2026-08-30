"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Upload, X, Image } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { UploadProgress } from "@/components/admin/UploadProgress";

interface ProjectFormProps {
  initialData?: any;
}

export function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [mainImage, setMainImage] = useState<string | null>(
    initialData?.mainImage || null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [uploadFileName, setUploadFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { upload, progress, isUploading, error: uploadError } = useFileUpload({ category: "PROJECTS" });
  const [xhrProgress, setXhrProgress] = useState(0);
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setXhrProgress(detail.percent);
    };
    window.addEventListener("upload-progress", handler);
    return () => window.removeEventListener("upload-progress", handler);
  }, []);

  const handleImageUpload = useCallback(
    async (file: File) => {
      setError("");
      setUploadFileName(file.name);
      const result = await upload(file);
      if (result) {
        setMainImage(result.url);
      }
    },
    [upload]
  );

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const removeImage = () => {
    setMainImage(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      location: formData.get("location"),
      description: formData.get("description"),
      status: formData.get("status"),
      startDate: formData.get("startDate") || null,
      completionDate: formData.get("completionDate") || null,
      isPublished: formData.get("isPublished") === "on",
      features: (formData.get("features") as string)
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      mainImage,
    };

    try {
      const res = await fetch(
        initialData ? `/api/admin/projects/${initialData.id}` : "/api/admin/projects",
        {
          method: initialData ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) throw new Error(await res.text());

      router.push("/admin/projects");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save project.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          {error || uploadError}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="form-label">Project Name *</label>
            <input
              type="text"
              name="name"
              required
              defaultValue={initialData?.name}
              className="form-input"
              placeholder="e.g. Mwangaza Phase 2"
            />
          </div>
          <div>
            <label className="form-label">Slug (URL friendly)</label>
            <input
              type="text"
              name="slug"
              defaultValue={initialData?.slug}
              className="form-input"
              placeholder="e.g. mwangaza-phase-2"
            />
          </div>
          <div>
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              defaultValue={initialData?.location}
              className="form-input"
              placeholder="e.g. Kitengela, Kenya"
            />
          </div>
          <div>
            <label className="form-label">Status</label>
            <select
              name="status"
              defaultValue={initialData?.status || "ONGOING"}
              className="form-input bg-white"
            >
              <option value="PLANNING">Planning</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="ON_HOLD">On Hold</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Start Date</label>
              <input
                type="date"
                name="startDate"
                defaultValue={initialData?.startDate?.split("T")[0] || ""}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Completion Date</label>
              <input
                type="date"
                name="completionDate"
                defaultValue={initialData?.completionDate?.split("T")[0] || ""}
                className="form-input"
              />
            </div>
          </div>
          <div>
            <label className="form-label">Features (Comma separated)</label>
            <input
              type="text"
              name="features"
              defaultValue={initialData?.features?.join(", ")}
              className="form-input"
              placeholder="e.g. Gated Community, Schools Nearby, Ready Title Deeds"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isPublished"
                defaultChecked={initialData?.isPublished}
                className="w-5 h-5 text-secondary-500 rounded border-gray-300 focus:ring-secondary-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Publish on website
              </span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="form-label">Description *</label>
        <textarea
          name="description"
          required
          defaultValue={initialData?.description}
          rows={6}
          className="form-input resize-y"
          placeholder="Detailed project description..."
        />
      </div>

      {/* Main Image Upload */}
      <div>
        <label className="form-label">Main Image</label>
        {mainImage ? (
          <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <img
              src={mainImage}
              alt="Project image"
              className="w-full h-48 object-cover"
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
                onClick={removeImage}
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
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleImageDrop}
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
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 10MB</p>
                </div>
              </div>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleImageInputChange}
          className="hidden"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary text-sm"
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {initialData ? "Save Changes" : "Create Project"}
        </button>
      </div>
    </form>
  );
}

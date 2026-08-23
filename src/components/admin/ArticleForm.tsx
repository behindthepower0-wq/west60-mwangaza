"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Upload, X, Image } from "lucide-react";

interface ArticleFormProps {
  initialData?: any;
}

export function ArticleForm({ initialData }: ArticleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [featuredImage, setFeaturedImage] = useState<string | null>(
    initialData?.featuredImage || null
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be less than 10MB");
      return;
    }

    setError("");
    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setFeaturedImage(data.url);
    } catch {
      setError("Image upload failed. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  }, []);

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
    setFeaturedImage(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      tags: formData.get("tags"),
      status: formData.get("status"),
      isFeatured: formData.get("isFeatured") === "on",
      featuredImage,
    };

    try {
      const res = await fetch(
        initialData ? `/api/admin/news/${initialData.id}` : "/api/admin/news",
        {
          method: initialData ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) throw new Error(await res.text());

      router.push("/admin/news");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save article.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              required
              defaultValue={initialData?.title}
              className="form-input"
              placeholder="Article title..."
            />
          </div>
          <div>
            <label className="form-label">Slug (URL friendly)</label>
            <input
              type="text"
              name="slug"
              defaultValue={initialData?.slug}
              className="form-input"
              placeholder="e.g. getting-started-with-real-estate"
            />
          </div>
          <div>
            <label className="form-label">Excerpt</label>
            <textarea
              name="excerpt"
              defaultValue={initialData?.excerpt || ""}
              rows={3}
              className="form-input resize-y"
              placeholder="Brief summary for previews..."
            />
          </div>
          <div>
            <label className="form-label">Tags (Comma separated)</label>
            <input
              type="text"
              name="tags"
              defaultValue={initialData?.tags || ""}
              className="form-input"
              placeholder="e.g. real estate, investment, tips"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="form-label">Status</label>
            <select
              name="status"
              defaultValue={initialData?.status || "DRAFT"}
              className="form-input bg-white"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={initialData?.isFeatured}
                className="w-5 h-5 text-secondary-500 rounded border-gray-300 focus:ring-secondary-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Feature this article
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Featured Image Upload */}
      <div>
        <label className="form-label">Featured Image</label>
        {featuredImage ? (
          <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <img
              src={featuredImage}
              alt="Featured image"
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
            {isUploadingImage && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="flex items-center gap-2 text-white text-sm">
                  <Loader2 size={18} className="animate-spin" /> Uploading...
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleImageDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? "border-primary-500 bg-primary-50/50"
                : "border-gray-200 hover:border-primary-400 hover:bg-gray-50"
            }`}
          >
            {isUploadingImage ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={32} className="text-primary-500 animate-spin" />
                <p className="text-sm text-gray-500">Uploading...</p>
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

      <div>
        <label className="form-label">Content *</label>
        <textarea
          name="content"
          required
          defaultValue={initialData?.content || ""}
          rows={15}
          className="form-input resize-y"
          placeholder="Write your article content here... (HTML supported)"
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
          {initialData ? "Save Changes" : "Publish Article"}
        </button>
      </div>
    </form>
  );
}

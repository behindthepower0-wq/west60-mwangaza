"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Upload, X, Image } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { UploadProgress } from "@/components/admin/UploadProgress";

interface PropertyFormProps {
  initialData?: any;
  children?: React.ReactNode; // For image manager slot (edit mode)
}

export function PropertyForm({ initialData, children }: PropertyFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [mainImage, setMainImage] = useState<string | null>(
    initialData?.mainImage || null
  );
  const [isDragging, setIsDragging] = useState(false);
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
      description: formData.get("description"),
      price: parseFloat(formData.get("price") as string) || 0,
      priceLabel: formData.get("priceLabel"),
      currency: formData.get("currency") || "KES",
      location: formData.get("location"),
      propertyType: formData.get("propertyType"),
      status: formData.get("status"),
      size: parseFloat(formData.get("size") as string) || null,
      sizeUnit: formData.get("sizeUnit"),
      features: (formData.get("features") as string)
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      isFeatured: formData.get("isFeatured") === "on",
      mainImage,
    };

    try {
      const res = await fetch(
        initialData ? `/api/properties/${initialData.id}` : "/api/properties",
        {
          method: initialData ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) throw new Error(await res.text());

      if (!initialData) {
        const newProperty = await res.json();
        router.push(`/admin/properties/${newProperty.id}/edit`);
      } else {
        router.push("/admin/properties");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save property.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {(error || uploadError) && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          {error || uploadError}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Name *
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={initialData?.name}
              className="form-input"
              placeholder="e.g. Mwangaza Heights"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug (URL friendly)
            </label>
            <input
              type="text"
              name="slug"
              defaultValue={initialData?.slug}
              className="form-input"
              placeholder="e.g. mwangaza-heights"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              name="location"
              required
              defaultValue={initialData?.location}
              className="form-input"
              placeholder="e.g. Syokimau, Nairobi"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                name="propertyType"
                defaultValue={initialData?.propertyType || "RESIDENTIAL"}
                className="form-input bg-white"
              >
                <option value="RESIDENTIAL">Residential</option>
                <option value="LAND">Land / Plot</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="MIXED_USE">Mixed Use</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                defaultValue={initialData?.status || "AVAILABLE"}
                className="form-input bg-white"
              >
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="SOLD">Sold</option>
                <option value="COMING_SOON">Coming Soon</option>
                <option value="UNDER_CONSTRUCTION">Under Construction</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (Number)
              </label>
              <input
                type="number"
                name="price"
                defaultValue={initialData?.price}
                className="form-input"
                placeholder="e.g. 1500000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <input
                type="text"
                name="currency"
                defaultValue={initialData?.currency || "KES"}
                className="form-input"
                placeholder="KES"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Price Label (Optional)
            </label>
            <input
              type="text"
              name="priceLabel"
              defaultValue={initialData?.priceLabel}
              className="form-input"
              placeholder="e.g. From KES 1.5M"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size (Number)
              </label>
              <input
                type="number"
                step="0.01"
                name="size"
                defaultValue={initialData?.size}
                className="form-input"
                placeholder="e.g. 50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size Unit
              </label>
              <input
                type="text"
                name="sizeUnit"
                defaultValue={initialData?.sizeUnit || "x 100 ft"}
                className="form-input"
                placeholder="e.g. x 100 ft, acres"
              />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 mt-8 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={initialData?.isFeatured}
                className="w-5 h-5 text-secondary-500 rounded border-gray-300 focus:ring-secondary-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Feature this property on the homepage
              </span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          name="description"
          required
          defaultValue={initialData?.description}
          rows={6}
          className="form-input resize-y"
          placeholder="Detailed description of the property..."
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Features (Comma separated)
        </label>
        <input
          type="text"
          name="features"
          defaultValue={initialData?.features?.join(", ")}
          className="form-input"
          placeholder="e.g. Ready Title Deeds, Borehole Water, Electricity, Fenced"
        />
      </div>

      {/* Main Image Upload */}
      <div>
        <label className="form-label">Main Image</label>
        {mainImage ? (
          <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <img
              src={mainImage}
              alt="Main property image"
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
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
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
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, WebP up to 10MB
                  </p>
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

      {/* Additional images slot (only shown in edit mode) */}
      {children}

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-outline"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {initialData ? "Save Changes" : "Create Property"}
        </button>
      </div>
    </form>
  );
}

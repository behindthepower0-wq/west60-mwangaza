"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload,
  X,
  Image,
  Loader2,
  Trash2,
  Search,
  Grid3X3,
  List,
} from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { UploadProgress } from "@/components/admin/UploadProgress";

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl: string | null;
  webpUrl: string | null;
  altText: string | null;
  caption: string | null;
  category: string;
  createdAt: string;
}

interface MediaLibraryManagerProps {
  initialMedia: MediaItem[];
}

export function MediaLibraryManager({ initialMedia }: MediaLibraryManagerProps) {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [uploadFileName, setUploadFileName] = useState("");

  const { upload, progress, isUploading, error: uploadError } = useFileUpload();
  const [xhrProgress, setXhrProgress] = useState(0);
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setXhrProgress(detail.percent);
    };
    window.addEventListener("upload-progress", handler);
    return () => window.removeEventListener("upload-progress", handler);
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = [
    "ALL",
    "GENERAL",
    "HOMEPAGE",
    "PROPERTIES",
    "PROJECTS",
    "SERVICES",
    "TEAM",
    "NEWS",
    "BRANDING",
  ];

  const filteredMedia = media.filter((m) => {
    const matchesSearch =
      m.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.altText && m.altText.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === "ALL" || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFile = useCallback(async (file: File) => {
    setError("");
    setUploadFileName(file.name);

    const result = await upload(file);
    if (result) {
      // Refresh media list
      const listRes = await fetch("/api/admin/media");
      if (listRes.ok) {
        const items = await listRes.json();
        setMedia(items);
      }
    }
  }, [upload]);

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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media item?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMedia((prev) => prev.filter((m) => m.id !== id));
      }
    } catch {
      setError("Failed to delete media item");
    } finally {
      setDeletingId(null);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
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
          border-2 border-dashed rounded-xl p-10 text-center transition-all
          ${
            isDragging
              ? "border-primary-500 bg-primary-50/50"
              : "border-gray-200 hover:border-primary-400 hover:bg-gray-50"
          } ${isUploading ? "cursor-wait" : "cursor-pointer"}`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-3 max-w-xs mx-auto">
            <UploadProgress
              progress={xhrProgress || progress}
              isUploading={isUploading}
              fileName={uploadFileName}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
              <Upload size={28} className="text-primary-500" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-700">
                Drop images here or click to upload
              </p>
              <p className="text-sm text-gray-400 mt-1">
                PNG, JPG, WebP up to 10MB each. Multiple files supported.
              </p>
            </div>
          </div>
        )}
      </div>

      {(error || uploadError) && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
          {error || uploadError}
          <button onClick={() => setError("")} className="ml-auto">
            <X size={14} />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Toolbar */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "grid"
                ? "bg-white shadow-sm text-primary-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "list"
                ? "bg-white shadow-sm text-primary-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? "bg-primary-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Media Grid/List */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-16">
          <Image size={48} className="text-gray-200 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-500 mb-2">No media files</h3>
          <p className="text-sm text-gray-400">
            Upload images to use across your website.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((m) => (
            <div
              key={m.id}
              className="group relative rounded-xl overflow-hidden bg-gray-100 aspect-square"
            >
              {m.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                <img
                  src={m.thumbnailUrl || m.url}
                  alt={m.altText || m.filename}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image size={32} className="text-gray-300" />
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(m.id);
                    }}
                    disabled={deletingId === m.id}
                    className="p-1.5 bg-red-500/90 rounded-lg text-white hover:bg-red-500 transition-colors"
                  >
                    {deletingId === m.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
                <div>
                  <p className="text-white text-xs font-medium truncate">
                    {m.originalName}
                  </p>
                  <p className="text-white/60 text-[10px] mt-0.5">
                    {formatSize(m.size)} &middot; {m.category}
                  </p>
                </div>
              </div>
              {/* Category badge */}
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-2 py-0.5 bg-black/60 rounded text-[10px] text-white font-medium">
                  {m.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                  Preview
                </th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                  Name
                </th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                  Category
                </th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                  Size
                </th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                  Uploaded
                </th>
                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredMedia.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                      {m.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                        <img
                          src={m.thumbnailUrl || m.url}
                          alt={m.altText || m.filename}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image size={16} className="text-gray-300" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                      {m.originalName}
                    </p>
                    <p className="text-xs text-gray-400 truncate max-w-[200px]">
                      {m.filename}
                    </p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">
                      {m.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">
                    {formatSize(m.size)}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleDelete(m.id)}
                      disabled={deletingId === m.id}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      {deletingId === m.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Count */}
      <p className="text-xs text-gray-400 text-right">
        Showing {filteredMedia.length} of {media.length} files
      </p>
    </div>
  );
}

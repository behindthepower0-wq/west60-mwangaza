"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, X } from "lucide-react";
import Link from "next/link";
import { ImageUploader } from "@/components/admin/ImageUploader";

type TeamMember = {
  id?: string;
  name: string;
  position?: string | null;
  biography?: string | null;
  qualifications?: string | null;
  photograph?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  isVisible?: boolean | null;
  order?: number | null;
};

interface TeamMemberFormProps {
  initialData?: TeamMember;
}

export default function TeamMemberForm({ initialData }: TeamMemberFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: initialData?.name || "",
    position: initialData?.position || "",
    biography: initialData?.biography || "",
    qualifications: initialData?.qualifications || "",
    photograph: initialData?.photograph || "",
    facebookUrl: initialData?.facebookUrl || "",
    twitterUrl: initialData?.twitterUrl || "",
    linkedinUrl: initialData?.linkedinUrl || "",
    instagramUrl: initialData?.instagramUrl || "",
    isVisible: initialData?.isVisible ?? true,
    order: initialData?.order || 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const isEditing = !!initialData?.id;
      const url = isEditing ? `/api/team/${initialData.id}` : "/api/team";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save team member");
      }

      router.push("/admin/team");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">
            Position *
          </label>
          <input
            type="text"
            id="position"
            name="position"
            required
            value={formData.position || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="biography" className="block text-sm font-medium text-gray-700">
          Biography
        </label>
        <textarea
          id="biography"
          name="biography"
          rows={4}
          value={formData.biography || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">
          Qualifications
        </label>
        <input
          type="text"
          id="qualifications"
          name="qualifications"
          value={formData.qualifications || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <ImageUploader
        currentUrl={formData.photograph || ""}
        onUpload={(url) => setFormData(prev => ({ ...prev, photograph: url || "" }))}
        label="Photograph"
        category="TEAM"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-700">
            Facebook URL
          </label>
          <input
            type="url"
            id="facebookUrl"
            name="facebookUrl"
            value={formData.facebookUrl || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700">
            Twitter URL
          </label>
          <input
            type="url"
            id="twitterUrl"
            name="twitterUrl"
            value={formData.twitterUrl || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700">
            LinkedIn URL
          </label>
          <input
            type="url"
            id="linkedinUrl"
            name="linkedinUrl"
            value={formData.linkedinUrl || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-700">
            Instagram URL
          </label>
          <input
            type="url"
            id="instagramUrl"
            name="instagramUrl"
            value={formData.instagramUrl || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="order" className="block text-sm font-medium text-gray-700">
            Display Order (Number)
          </label>
          <input
            type="number"
            id="order"
            name="order"
            value={formData.order || 0}
            onChange={handleChange}
            className="w-full md:w-1/3 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Visible on Website
          </label>
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, isVisible: !(prev.isVisible ?? true) }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                (formData.isVisible ?? true) ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  (formData.isVisible ?? true) ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm text-gray-600">
              {(formData.isVisible ?? true) ? "Visible" : "Hidden"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Saving..." : "Save Member"}
        </button>
        <Link
          href="/admin/team"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Link>
      </div>
    </form>
  );
}

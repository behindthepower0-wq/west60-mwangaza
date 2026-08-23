"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";

interface UserFormProps {
  initialData?: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  };
}

export function UserForm({ initialData }: UserFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password") || undefined,
      role: formData.get("role"),
      status: formData.get("status"),
    };

    try {
      const res = await fetch(
        initialData
          ? `/api/admin/users/${initialData.id}`
          : "/api/admin/users",
        {
          method: initialData ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) throw new Error(await res.text());

      router.push("/admin/users");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save user.");
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
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="name"
              required
              defaultValue={initialData?.name}
              className="form-input"
              placeholder="e.g. John Kamau"
            />
          </div>
          <div>
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              required
              defaultValue={initialData?.email}
              className="form-input"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label className="form-label">
              {initialData ? "New Password (leave blank to keep)" : "Password *"}
            </label>
            <input
              type="password"
              name="password"
              required={!initialData}
              className="form-input"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="form-label">Role</label>
            <select
              name="role"
              defaultValue={initialData?.role || "EDITOR"}
              className="form-input bg-white"
            >
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMINISTRATOR">Administrator</option>
              <option value="EDITOR">Editor</option>
              <option value="CONTENT_STAFF">Content Staff</option>
            </select>
          </div>
          <div>
            <label className="form-label">Status</label>
            <select
              name="status"
              defaultValue={initialData?.status || "ACTIVE"}
              className="form-input bg-white"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
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
          {initialData ? "Save Changes" : "Create User"}
        </button>
      </div>
    </form>
  );
}

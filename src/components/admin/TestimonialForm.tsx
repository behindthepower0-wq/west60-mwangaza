"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";

interface TestimonialFormProps {
  initialData?: any;
}

export function TestimonialForm({ initialData }: TestimonialFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      clientName: formData.get("clientName"),
      company: formData.get("company"),
      position: formData.get("position"),
      testimonial: formData.get("testimonial"),
      rating: parseInt(formData.get("rating") as string) || 5,
      order: parseInt(formData.get("order") as string) || 0,
      isVisible: formData.get("isVisible") === "on",
    };

    try {
      const res = await fetch(
        initialData
          ? `/api/admin/testimonials/${initialData.id}`
          : "/api/admin/testimonials",
        {
          method: initialData ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) throw new Error(await res.text());

      router.push("/admin/testimonials");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save testimonial.");
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
            <label className="form-label">Client Name *</label>
            <input
              type="text"
              name="clientName"
              required
              defaultValue={initialData?.clientName}
              className="form-input"
              placeholder="e.g. John Kamau"
            />
          </div>
          <div>
            <label className="form-label">Company</label>
            <input
              type="text"
              name="company"
              defaultValue={initialData?.company || ""}
              className="form-input"
              placeholder="e.g. Kamau Enterprises"
            />
          </div>
          <div>
            <label className="form-label">Position</label>
            <input
              type="text"
              name="position"
              defaultValue={initialData?.position || ""}
              className="form-input"
              placeholder="e.g. CEO"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="form-label">Rating</label>
            <select
              name="rating"
              defaultValue={initialData?.rating || 5}
              className="form-input bg-white"
            >
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
          </div>
          <div>
            <label className="form-label">Order</label>
            <input
              type="number"
              name="order"
              defaultValue={initialData?.order || 0}
              className="form-input"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isVisible"
                defaultChecked={initialData?.isVisible ?? true}
                className="w-5 h-5 text-secondary-500 rounded border-gray-300 focus:ring-secondary-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Visible on website
              </span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="form-label">Testimonial *</label>
        <textarea
          name="testimonial"
          required
          defaultValue={initialData?.testimonial}
          rows={6}
          className="form-input resize-y"
          placeholder="What the client said..."
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
          {initialData ? "Save Changes" : "Add Testimonial"}
        </button>
      </div>
    </form>
  );
}

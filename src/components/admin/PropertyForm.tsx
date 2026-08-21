"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft } from "lucide-react";

export function PropertyForm({ initialData }: { initialData?: any }) {
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
      features: (formData.get("features") as string).split(",").map(f => f.trim()).filter(Boolean),
      isFeatured: formData.get("isFeatured") === "on",
    };

    try {
      const res = await fetch(initialData ? `/api/properties/${initialData.id}` : "/api/properties", {
        method: initialData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(await res.text());
      
      router.push("/admin/properties");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save property.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Name *</label>
            <input type="text" name="name" required defaultValue={initialData?.name} className="input-field" placeholder="e.g. Mwangaza Heights" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL friendly)</label>
            <input type="text" name="slug" defaultValue={initialData?.slug} className="input-field" placeholder="e.g. mwangaza-heights" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <input type="text" name="location" required defaultValue={initialData?.location} className="input-field" placeholder="e.g. Syokimau, Nairobi" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select name="propertyType" defaultValue={initialData?.propertyType || "LAND"} className="input-field bg-white">
                <option value="LAND">Land / Plot</option>
                <option value="HOUSE">House / Villa</option>
                <option value="APARTMENT">Apartment</option>
                <option value="COMMERCIAL">Commercial Space</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" defaultValue={initialData?.status || "AVAILABLE"} className="input-field bg-white">
                <option value="AVAILABLE">Available</option>
                <option value="SOLD">Sold</option>
                <option value="RESERVED">Reserved</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (Number)</label>
              <input type="number" name="price" defaultValue={initialData?.price} className="input-field" placeholder="e.g. 1500000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <input type="text" name="currency" defaultValue={initialData?.currency || "KES"} className="input-field" placeholder="KES" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Price Label (Optional)</label>
            <input type="text" name="priceLabel" defaultValue={initialData?.priceLabel} className="input-field" placeholder="e.g. From KES 1.5M" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size (Number)</label>
              <input type="number" step="0.01" name="size" defaultValue={initialData?.size} className="input-field" placeholder="e.g. 50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size Unit</label>
              <input type="text" name="sizeUnit" defaultValue={initialData?.sizeUnit || "x 100 ft"} className="input-field" placeholder="e.g. x 100 ft, acres" />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 mt-8 cursor-pointer">
              <input type="checkbox" name="isFeatured" defaultChecked={initialData?.isFeatured} className="w-5 h-5 text-secondary-500 rounded border-gray-300 focus:ring-secondary-500" />
              <span className="text-sm font-medium text-gray-700">Feature this property on the homepage</span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea name="description" required defaultValue={initialData?.description} rows={6} className="input-field resize-y" placeholder="Detailed description of the property..."></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Features (Comma separated)</label>
        <input type="text" name="features" defaultValue={initialData?.features?.join(", ")} className="input-field" placeholder="e.g. Ready Title Deeds, Borehole Water, Electricity, Fenced" />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button type="button" onClick={() => router.back()} className="btn-outline">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {initialData ? "Save Changes" : "Create Property"}
        </button>
      </div>
    </form>
  );
}

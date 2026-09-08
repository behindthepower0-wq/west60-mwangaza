"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2, MapPin, Save } from "lucide-react";

export function LocationsManager() {
  const router = useRouter();
  const [locations, setLocations] = useState<string[]>([]);
  const [newLocation, setNewLocation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/locations")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setLocations(data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const addLocation = useCallback(() => {
    const val = newLocation.trim();
    if (!val) return;
    if (locations.some((l) => l.toLowerCase() === val.toLowerCase())) {
      setError("This location already exists.");
      return;
    }
    setLocations((prev) => [...prev, val]);
    setNewLocation("");
    setError("");
  }, [newLocation, locations]);

  const removeLocation = useCallback((index: number) => {
    setLocations((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locations }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const saved = await res.json();
      if (Array.isArray(saved)) setLocations(saved);
      router.refresh();
    } catch {
      setError("Failed to save locations.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 py-8">
        <Loader2 size={16} className="animate-spin" /> Loading locations...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: "var(--font-serif)" }}>
            Property Locations
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage the areas/locations shown in property filters and the CMS form.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Changes
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
      )}

      {/* Add new */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newLocation}
          onChange={(e) => { setNewLocation(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLocation())}
          placeholder="e.g. Katani, Kitengela, Joska..."
          className="form-input flex-1"
        />
        <button
          onClick={addLocation}
          disabled={!newLocation.trim()}
          className="btn-outline flex items-center gap-2"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {/* Location list */}
      {locations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <MapPin size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No locations yet. Add your first location above.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {locations.map((loc, i) => (
            <div
              key={`${loc}-${i}`}
              className="flex items-center justify-between gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl shadow-sm group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <MapPin size={14} className="text-secondary-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 truncate">{loc}</span>
              </div>
              <button
                onClick={() => removeLocation(i)}
                className="p-1 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                aria-label={`Remove ${loc}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">
        {locations.length} location{locations.length !== 1 ? "s" : ""} configured.
      </p>
    </div>
  );
}

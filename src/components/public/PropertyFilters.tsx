"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";

const DEFAULT_LOCATIONS = ["Katani", "Kitengela", "Joska", "Malaa", "Kitui"];
const statuses = ["All", "AVAILABLE", "COMING_SOON", "UNDER_CONSTRUCTION", "COMPLETED", "SOLD_OUT"];
const statusLabels: Record<string, string> = {
  All: "All", AVAILABLE: "Available", COMING_SOON: "Coming Soon",
  UNDER_CONSTRUCTION: "Under Construction", COMPLETED: "Completed", SOLD_OUT: "Sold Out",
};

export function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [locations, setLocations] = useState<string[]>(DEFAULT_LOCATIONS);

  const currentArea = searchParams.get("area") || "All";
  const currentStatus = searchParams.get("status") || "All";
  const hasActiveFilters = currentArea !== "All" || currentStatus !== "All";

  useEffect(() => {
    fetch("/api/admin/locations")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setLocations(data);
      })
      .catch(() => {});
  }, []);

  function navigate(area: string, status: string) {
    const params = new URLSearchParams();
    if (area !== "All") params.set("area", area);
    if (status !== "All") params.set("status", status);
    const qs = params.toString();
    router.push(`/properties${qs ? `?${qs}` : ""}`, { scroll: false });
  }

  function handleArea(area: string) {
    navigate(area, currentStatus);
  }

  function handleStatus(status: string) {
    navigate(currentArea, status);
  }

  function clearFilters() {
    navigate("All", "All");
  }

  return (
    <section className="sticky top-[72px] z-30 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toggle bar */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary-700 transition-colors"
            >
              <Filter size={16} />
              Filters
              {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {/* Show active filter badges when collapsed */}
            {!open && hasActiveFilters && (
              <div className="flex flex-wrap gap-1.5">
                {currentArea !== "All" && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-700 text-white">
                    {currentArea}
                  </span>
                )}
                {currentStatus !== "All" && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary-400 text-primary-900">
                    {statusLabels[currentStatus]}
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="px-2.5 py-1 rounded-full text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Quick area pills always visible */}
          {!open && (
            <div className="hidden sm:flex flex-wrap gap-1.5">
              {locations.map((area) => (
                <button
                  key={area}
                  onClick={() => handleArea(area)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    currentArea === area
                      ? "bg-primary-700 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-primary-700"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Expanded filter panel */}
        {open && (
          <div className="pb-4 space-y-3 border-t border-gray-100 pt-3">
            {/* Areas */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-medium text-gray-400 self-center mr-1">Area:</span>
              {locations.map((area) => (
                <button
                  key={area}
                  onClick={() => handleArea(area)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    currentArea === area
                      ? "bg-primary-700 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>

            {/* Statuses */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-medium text-gray-400 self-center mr-1">Status:</span>
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatus(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    currentStatus === s
                      ? "bg-secondary-400 text-primary-900"
                      : "bg-gray-100 text-gray-600 hover:bg-secondary-50 hover:text-secondary-700"
                  }`}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>

            {/* Clear all */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
              >
                ✕ Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";

const areas = ["All", "Katani", "Kitengela", "Joska", "Malaa", "Kitui"];
const statuses = ["All", "AVAILABLE", "COMING_SOON", "UNDER_CONSTRUCTION", "COMPLETED", "SOLD"];
const statusLabels: Record<string, string> = {
  All: "All", AVAILABLE: "Available", COMING_SOON: "Coming Soon",
  UNDER_CONSTRUCTION: "Under Construction", COMPLETED: "Completed", SOLD: "Sold",
};

interface PropertyFiltersProps {
  activeArea?: string;
  activeStatus?: string;
}

export function PropertyFilters({ activeArea, activeStatus }: PropertyFiltersProps) {
  const [open, setOpen] = useState(false);
  const currentArea = activeArea || "All";
  const currentStatus = activeStatus || "All";

  const hasActiveFilters = currentArea !== "All" || currentStatus !== "All";

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
                <a
                  href="/properties"
                  className="px-2.5 py-1 rounded-full text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
                >
                  Clear
                </a>
              </div>
            )}
          </div>

          {/* Quick area pills always visible */}
          {!open && (
            <div className="hidden sm:flex flex-wrap gap-1.5">
              {areas.map((area) => (
                <a
                  key={area}
                  href={`/properties?${area !== "All" ? `area=${area}` : ""}${currentStatus !== "All" ? `&status=${currentStatus}` : ""}`}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    currentArea === area
                      ? "bg-primary-700 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-primary-700"
                  }`}
                >
                  {area}
                </a>
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
              {areas.map((area) => (
                <a
                  key={area}
                  href={`/properties?${area !== "All" ? `area=${area}` : ""}${currentStatus !== "All" ? `&status=${currentStatus}` : ""}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    currentArea === area
                      ? "bg-primary-700 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700"
                  }`}
                >
                  {area}
                </a>
              ))}
            </div>

            {/* Statuses */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-medium text-gray-400 self-center mr-1">Status:</span>
              {statuses.map((s) => (
                <a
                  key={s}
                  href={`/properties?${currentArea !== "All" ? `area=${currentArea}&` : ""}status=${s}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    currentStatus === s
                      ? "bg-secondary-400 text-primary-900"
                      : "bg-gray-100 text-gray-600 hover:bg-secondary-50 hover:text-secondary-700"
                  }`}
                >
                  {statusLabels[s]}
                </a>
              ))}
            </div>

            {/* Clear all */}
            {hasActiveFilters && (
              <a
                href="/properties"
                className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
              >
                ✕ Clear all filters
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

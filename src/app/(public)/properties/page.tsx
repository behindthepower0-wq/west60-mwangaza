import type { Metadata } from "next";
import { Suspense } from "react";
import prisma from "@/lib/db";
import { PropertyCard } from "@/components/public/PropertyCard";
import { Filter } from "lucide-react";

export const metadata: Metadata = {
  title: "Properties",
  description: "Browse all available land and properties from West 60 Mwangaza Properties across Kenya: Katani, Kitengela, Joska, Malaa and Kitui.",
};

const areas = ["All", "Katani", "Kitengela", "Joska", "Malaa", "Kitui"];
const statuses = ["All", "AVAILABLE", "COMING_SOON", "UNDER_CONSTRUCTION", "COMPLETED", "SOLD"];
const statusLabels: Record<string, string> = {
  All: "All", AVAILABLE: "Available", COMING_SOON: "Coming Soon",
  UNDER_CONSTRUCTION: "Under Construction", COMPLETED: "Completed", SOLD: "Sold",
};

async function getProperties(searchParams: { area?: string; status?: string; search?: string }) {
  const where: Record<string, unknown> = { isPublished: true };

  if (searchParams.area && searchParams.area !== "All") {
    where.area = { contains: searchParams.area };
  }
  if (searchParams.status && searchParams.status !== "All") {
    where.status = searchParams.status;
  }
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search } },
      { location: { contains: searchParams.search } },
    ];
  }

  return prisma.property.findMany({
    where,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
  });
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; status?: string; search?: string }>;
}) {
  const params = await searchParams;
  const properties = await getProperties(params).catch(() => []);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16" style={{ background: "var(--color-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="section-eyebrow justify-center mb-4">
            <span className="w-8 h-px bg-secondary-400" />Properties<span className="w-8 h-px bg-secondary-400" />
          </div>
          <h1 className="section-heading-white mb-4">Find Your Perfect <span style={{ color: "#c6912b" }}>Space</span></h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Browse available land and properties across Kenya&apos;s most promising locations.
            All with ready title deeds and flexible payment plans.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-[72px] z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600 flex-shrink-0">
            <Filter size={16} /> Filter:
          </div>
          <div className="flex flex-wrap gap-2">
            {areas.map((area) => (
              <a
                key={area}
                href={`/properties?area=${area}`}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  (params.area || "All") === area
                    ? "bg-primary-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700"
                }`}
              >
                {area}
              </a>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 sm:ml-4">
            {statuses.map((s) => (
              <a
                key={s}
                href={`/properties?${params.area ? `area=${params.area}&` : ""}status=${s}`}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  (params.status || "All") === s
                    ? "bg-secondary-400 text-primary-900"
                    : "bg-gray-100 text-gray-600 hover:bg-secondary-50 hover:text-secondary-700"
                }`}
              >
                {statusLabels[s]}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16" style={{ background: "var(--color-warm-white)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 mb-8">
            Showing <strong>{properties.length}</strong> propert{properties.length === 1 ? "y" : "ies"}
          </p>
          {properties.length === 0 ? (
            <div className="text-center py-24 rounded-3xl bg-white">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-primary-700 mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                No Properties Found
              </h3>
              <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or contact us directly.</p>
              <a href="/properties" className="btn-outline-primary">Clear Filters</a>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

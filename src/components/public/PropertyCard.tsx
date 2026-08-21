import Link from "next/link";
import { ArrowRight, MapPin, Maximize2, Building2 } from "lucide-react";
import type { Property, PropertyImage } from "@prisma/client";
import { ScrollReveal } from "./ScrollReveal";
import { formatPrice } from "@/lib/utils";

type PropertyWithImages = Property & { images: PropertyImage[] };

interface FeaturedPropertiesSectionProps {
  properties: PropertyWithImages[];
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    AVAILABLE: "Available",
    SOLD: "Sold",
    RESERVED: "Reserved",
    COMING_SOON: "Coming Soon",
    UNDER_CONSTRUCTION: "Under Construction",
    COMPLETED: "Completed",
  };
  return map[status] || status;
}

function getStatusClass(status: string) {
  const map: Record<string, string> = {
    AVAILABLE: "status-available",
    SOLD: "status-sold",
    RESERVED: "status-reserved",
    COMING_SOON: "status-coming-soon",
    UNDER_CONSTRUCTION: "status-construction",
    COMPLETED: "status-completed",
  };
  return `status-badge ${map[status] || ""}`;
}

export function FeaturedPropertiesSection({ properties }: FeaturedPropertiesSectionProps) {
  const displayProperties = properties.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    location: p.location,
    price: p.price,
    currency: p.currency,
    priceLabel: p.priceLabel,
    propertyType: p.propertyType,
    status: p.status,
    area: p.area,
    mainImage: p.images[0]?.url || p.mainImage || "/images/property-1.jpg",
    shortDescription: p.shortDescription,
  }));

  return (
    <section id="properties" className="py-20 lg:py-28 relative overflow-hidden" style={{ background: "#FFFFFF" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <ScrollReveal>
            <div className="section-eyebrow justify-center mb-4">
              <span className="w-8 h-px bg-secondary-400" />
              Featured Properties
              <span className="w-8 h-px bg-secondary-400" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="section-heading mb-4">
              Discover Your <span style={{ color: "#C9A84C" }}>Dream Property</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <div className="gold-divider mx-auto mb-6" />
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="section-subheading">
              Handpicked properties across Kenya&apos;s most promising growth corridors — all verified with ready title deeds.
            </p>
          </ScrollReveal>
        </div>

        {/* Property Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProperties.map((property, i) => (
            <ScrollReveal key={property.id} delay={i * 120} direction="up">
              <Link
                href={`/properties/${property.slug}`}
                className="property-card group block h-full"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={property.mainImage}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "linear-gradient(to top, rgba(26,58,42,0.6) 0%, transparent 50%)" }}
                  />
                  {/* Status badge */}
                  <div className="absolute top-4 left-4">
                    <span className={getStatusClass(property.status)}>
                      {getStatusLabel(property.status)}
                    </span>
                  </div>
                  {/* Price tag */}
                  <div
                    className="absolute bottom-4 right-4 px-4 py-2 rounded-xl text-sm font-bold"
                    style={{
                      background: "rgba(26,58,42,0.85)",
                      backdropFilter: "blur(8px)",
                      color: "#C9A84C",
                      border: "1px solid rgba(201,168,76,0.2)",
                    }}
                  >
                    {property.priceLabel || formatPrice(property.price, property.currency)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3
                    className="font-bold text-primary-800 text-lg mb-2 group-hover:text-secondary-600 transition-colors duration-300"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {property.name}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-secondary-500" />
                      {property.location || "Kenya"}
                    </div>
                    {property.area && (
                      <div className="flex items-center gap-1">
                        <Maximize2 size={12} className="text-secondary-500" />
                        {property.area}
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
                    {property.shortDescription}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 group-hover:text-secondary-600 transition-all duration-300">
                    View Details{" "}
                    <ArrowRight
                      size={12}
                      className="group-hover:translate-x-1.5 transition-transform duration-300"
                    />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal delay={400}>
          <div className="text-center mt-12">
            <Link href="/properties" className="btn-outline-primary">
              View All Properties <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function PropertyCard({ property }: { property: any }) {
  const displayImage = property.images?.[0]?.url || property.mainImage || "/images/property-1.jpg";
  return (
    <Link
      href={`/properties/${property.slug}`}
      className="property-card group block h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={displayImage}
          alt={property.name}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "linear-gradient(to top, rgba(26,58,42,0.6) 0%, transparent 50%)" }}
        />
        <div className="absolute top-4 left-4">
          <span className={getStatusClass(property.status)}>
            {getStatusLabel(property.status)}
          </span>
        </div>
        <div
          className="absolute bottom-4 right-4 px-4 py-2 rounded-xl text-sm font-bold"
          style={{
            background: "rgba(26,58,42,0.85)",
            backdropFilter: "blur(8px)",
            color: "#C9A84C",
            border: "1px solid rgba(201,168,76,0.2)",
          }}
        >
          {property.priceLabel || formatPrice(property.price, property.currency)}
        </div>
      </div>

      <div className="p-6">
        <h3
          className="font-bold text-primary-800 text-lg mb-2 group-hover:text-secondary-600 transition-colors duration-300"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {property.name}
        </h3>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-secondary-500" />
            {property.location || "Kenya"}
          </div>
          {property.area && (
            <div className="flex items-center gap-1">
              <Maximize2 size={12} className="text-secondary-500" />
              {property.area}
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
          {property.shortDescription}
        </p>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 group-hover:text-secondary-600 transition-all duration-300">
          View Details{" "}
          <ArrowRight
            size={12}
            className="group-hover:translate-x-1.5 transition-transform duration-300"
          />
        </div>
      </div>
    </Link>
  );
}


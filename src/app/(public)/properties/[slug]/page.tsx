import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, BedDouble, Bath, Maximize, Phone, ArrowLeft, ArrowRight } from "lucide-react";
import prisma from "@/lib/db";
import { formatPrice, getPropertyStatusLabel, getPropertyStatusClass, getWhatsAppUrl } from "@/lib/utils";
import { ContactForm } from "@/components/public/ContactForm";
import { PropertyCard } from "@/components/public/PropertyCard";
import { PricingCard } from "@/components/public/PricingCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await prisma.property.findUnique({ where: { slug } });
  if (!property) return { title: "Property Not Found" };
  return {
    title: property.name,
    description: property.shortDescription || `${property.name}, ${property.location || "Kenya"}. Available from West 60 Mwangaza Properties.`,
    openGraph: { title: property.name, images: property.mainImage ? [property.mainImage] : [] },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;

  const property = await prisma.property.findUnique({
    where: { slug, isPublished: true },
    include: {
      images: { orderBy: { order: "asc" } },
      features: { orderBy: { order: "asc" } },
      amenities: { orderBy: { order: "asc" } },
    },
  }).catch(() => null);

  if (!property) notFound();

  const related = await prisma.property.findMany({
    where: { isPublished: true, id: { not: property.id }, area: property.area || undefined },
    take: 3,
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
  }).catch(() => []);

  const heroImage = property.images[0]?.url || property.mainImage || "/images/property-placeholder.jpg";

  return (
    <>
      {/* Breadcrumb */}
      <div className="pt-24 pb-4" style={{ background: "var(--color-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-white transition-colors">Properties</Link>
            <span>/</span>
            <span className="text-white/80">{property.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-72 md:h-96 lg:h-[480px] bg-primary-100">
        <Image src={heroImage} alt={property.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <span className={getPropertyStatusClass(property.status)}>
            {getPropertyStatusLabel(property.status)}
          </span>
        </div>
      </div>

      {/* Main content */}
      <section className="py-16" style={{ background: "var(--color-warm-white)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-10">

          {/* Left col: detail */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title */}
            <div>
              <Link href="/properties" className="flex items-center gap-1 text-sm text-gray-400 hover:text-primary-600 transition-colors mb-4">
                <ArrowLeft size={14} /> Back to Properties
              </Link>
              <h1 className="section-heading mb-2">{property.name}</h1>
              {property.location && (
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin size={15} className="text-secondary-500" />
                  <span>{property.location}</span>
                </div>
              )}
            </div>

            {/* Price + specs */}
            <div className="glass-card p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Price</p>
                <p className="font-bold text-primary-700 text-lg" style={{ fontFamily: "var(--font-serif)" }}>
                  {property.priceLabel || formatPrice(property.price, property.currency)}
                </p>
              </div>
              {property.bedrooms && (
                <div className="flex items-center gap-2">
                  <BedDouble size={18} className="text-secondary-500" />
                  <div>
                    <p className="text-xs text-gray-400">Bedrooms</p>
                    <p className="font-semibold text-primary-700">{property.bedrooms}</p>
                  </div>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-2">
                  <Bath size={18} className="text-secondary-500" />
                  <div>
                    <p className="text-xs text-gray-400">Bathrooms</p>
                    <p className="font-semibold text-primary-700">{property.bathrooms}</p>
                  </div>
                </div>
              )}
              {property.landSize && (
                <div className="flex items-center gap-2">
                  <Maximize size={18} className="text-secondary-500" />
                  <div>
                    <p className="text-xs text-gray-400">Land Size</p>
                    <p className="font-semibold text-primary-700">{property.landSize} sqm</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {(property.fullDescription || property.shortDescription) && (
              <div className="glass-card p-6">
                <h2 className="font-bold text-primary-800 text-xl mb-4" style={{ fontFamily: "var(--font-serif)" }}>About This Property</h2>
                <div className="prose-brand">
                  <p>{property.fullDescription || property.shortDescription}</p>
                </div>
              </div>
            )}

            {/* Features */}
            {property.features.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="font-bold text-primary-800 text-xl mb-4" style={{ fontFamily: "var(--font-serif)" }}>Property Features</h2>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {property.features.map((f) => (
                    <li key={f.id} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-400 flex-shrink-0" />
                      {f.feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Gallery */}
            {property.images.length > 1 && (
              <div className="glass-card p-6">
                <h2 className="font-bold text-primary-800 text-xl mb-4" style={{ fontFamily: "var(--font-serif)" }}>Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.images.map((img) => (
                    <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden">
                      <Image src={img.url} alt={img.altText || property.name} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right col: Pricing & CTA sidebar */}
          <div className="space-y-6">
            <PricingCard
              price={property.price}
              currency={property.currency}
              priceLabel={property.priceLabel}
              location={property.location ?? undefined}
              propertyType={property.propertyType}
              area={property.area ?? undefined}
            />
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="section-heading text-2xl">Related Properties</h2>
              <Link href="/properties" className="flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-secondary-600 transition-colors">
                All Properties <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

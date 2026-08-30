import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import prisma from "@/lib/db";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { PropertyImageManager } from "@/components/admin/PropertyImageManager";

export const metadata: Metadata = { title: "Edit Property | CMS" };

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      features: { orderBy: { order: "asc" } },
    },
  });

  if (!property) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/properties"
            className="p-2 text-gray-400 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1
              className="text-xl font-bold text-gray-800"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Property Not Found
            </h1>
            <p className="text-sm text-gray-500">
              The property you are looking for does not exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const initialData = {
    ...property,
    description: property.fullDescription || "",
    size: property.area ? parseFloat(property.area) : null,
    sizeUnit: property.area
      ? property.area.replace(/[\d.]+\s*/, "").trim()
      : "x 100 ft",
    features: property.features.map((f) => f.feature),
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/properties"
          className="p-2 text-gray-400 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1
            className="text-xl font-bold text-gray-800"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Edit Property
          </h1>
          <p className="text-sm text-gray-500">
            Update property details and images.
          </p>
        </div>
      </div>

      <div className="admin-card p-6">
        <PropertyForm initialData={initialData}>
          {/* Additional images manager - only shown in edit mode */}
          <PropertyImageManager
            propertyId={property.id}
            mainImage={property.mainImage}
            images={property.images.map((img) => ({
              id: img.id,
              url: img.url,
              altText: img.altText,
              caption: img.caption,
              order: img.order,
            }))}
          />
        </PropertyForm>
      </div>
    </div>
  );
}

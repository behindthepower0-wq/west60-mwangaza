import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Home, MessageSquare, TrendingUp, Settings, ArrowRight, type LucideIcon } from "lucide-react";
import prisma from "@/lib/db";
import { getWhatsAppUrl } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Home,
  MessageSquare,
  TrendingUp,
  Settings,
};

function getServiceIcon(iconName?: string | null): LucideIcon {
  return (iconName && iconMap[iconName]) || Home;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) return { title: "Service Not Found" };
  return {
    title: service.name,
    description: service.shortDescription || `Learn more about ${service.name} from West 60 Mwangaza Properties.`,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;

  const service = await prisma.service.findUnique({
    where: { slug, status: "PUBLISHED" },
  });

  if (!service) notFound();

  const otherServices = await prisma.service.findMany({
    where: { status: "PUBLISHED", slug: { not: slug } },
    orderBy: { order: "asc" },
  });

  const Icon = getServiceIcon(service.icon);

  return (
    <>
      {/* Hero */}
      <section
        className="relative py-24 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0f3021 0%, #1d4f38 50%, #0f3021 100%)",
        }}
      >
        {/* Decorative */}
        <div
          className="absolute top-0 right-0 w-96 h-96 opacity-[0.04] pointer-events-none"
          style={{ background: "radial-gradient(circle, #c6912b, transparent 60%)" }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/#services"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors mb-8"
          >
            <ArrowLeft size={16} /> Back to Services
          </Link>

          <div className="flex items-center gap-5 mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(198,145,43,0.15), rgba(198,145,43,0.05))",
                border: "1px solid rgba(198,145,43,0.2)",
              }}
            >
              <Icon size={30} className="text-secondary-400" />
            </div>
            <h1
              className="text-3xl md:text-4xl font-bold text-white"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {service.name}
            </h1>
          </div>

          {service.shortDescription && (
            <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
              {service.shortDescription}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="md:col-span-2">
              {(service.fullDescription || service.shortDescription) && (
                <div className="glass-card p-8">
                  <h2
                    className="font-bold text-primary-800 text-xl mb-5"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    About This Service
                  </h2>
                  <div className="prose-brand space-y-4">
                    {(service.fullDescription || service.shortDescription || "")
                      .split("\n")
                      .map((para, i) => (
                        <p key={i} className="text-gray-600 leading-relaxed">
                          {para}
                        </p>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar CTA */}
            <div className="space-y-6">
              <div className="glass-card p-6">
                <h3
                  className="font-bold text-primary-800 text-lg mb-4"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Interested?
                </h3>
                <p className="text-sm text-gray-500 mb-5">
                  Get in touch to learn how we can help you with {service.name.toLowerCase()}.
                </p>
                <div className="space-y-3">
                  <a
                    href="tel:0711400933"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-primary-700 hover:bg-primary-50 transition-colors"
                  >
                    <Phone size={16} className="text-secondary-500" /> 0711 400 933
                  </a>
                  <a
                    href={getWhatsAppUrl(
                      "0711400933",
                      `Hello! I would like to know more about your ${service.name.toLowerCase()} services.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Services */}
      {otherServices.length > 0 && (
        <section className="py-16" style={{ background: "var(--color-warm-white)" }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="font-bold text-primary-800 text-xl mb-6"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Other Services
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {otherServices.map((s) => {
                const SvcIcon = getServiceIcon(s.icon);
                return (
                  <Link
                    key={s.id}
                    href={`/services/${s.slug}`}
                    className="glass-card p-5 flex items-center gap-4 hover:shadow-md transition-shadow group"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg, rgba(29,79,56,0.08), rgba(29,79,56,0.03))",
                        border: "1px solid rgba(29,79,56,0.10)",
                      }}
                    >
                      <SvcIcon size={20} className="text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-primary-800 text-sm group-hover:text-secondary-600 transition-colors">
                        {s.name}
                      </h3>
                      <p className="text-xs text-gray-400 truncate">
                        {s.shortDescription}
                      </p>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-gray-300 group-hover:text-secondary-500 group-hover:translate-x-1 transition-all flex-shrink-0"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

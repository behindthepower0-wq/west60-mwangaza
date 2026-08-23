import Link from "next/link";
import { ArrowRight, Home, TrendingUp, Settings, MessageSquare, type LucideIcon } from "lucide-react";
import type { Service } from "@prisma/client";
import { ScrollReveal } from "./ScrollReveal";

interface ServicesSectionProps {
  services: Service[];
}

const iconMap: Record<string, LucideIcon> = {
  Home,
  MessageSquare,
  TrendingUp,
  Settings,
};

function getServiceIcon(iconName?: string | null): LucideIcon {
  return (iconName && iconMap[iconName]) || Home;
}

const defaultServices = [
  {
    id: "land-selling",
    icon: "Home",
    name: "Land Selling",
    shortDescription:
      "Prime residential and commercial plots across Katani, Kitengela, Joska, Malaa and Kitui, all with ready title deeds and flexible payment plans.",
    slug: "land-selling",
  },
  {
    id: "consultancy",
    icon: "MessageSquare",
    name: "Real Estate Consultancy",
    shortDescription:
      "Professional guidance through the entire property buying process, from enquiry and site viewing to documentation and ownership.",
    slug: "real-estate-consultancy",
  },
  {
    id: "sales-marketing",
    icon: "TrendingUp",
    name: "Sales & Marketing",
    shortDescription:
      "Strategic property marketing for developers and landowners. We connect buyers to the right properties through targeted campaigns.",
    slug: "sales-and-marketing",
  },
];

export function ServicesSection({ services }: ServicesSectionProps) {
  const displayServices = services.length > 0 ? services : defaultServices;

  return (
    <section id="services" className="py-20 lg:py-28 relative overflow-hidden" style={{ background: "var(--color-warm-white)" }}>
      {/* Decorative elements */}
      <div
        className="absolute top-20 left-0 w-72 h-72 rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: "radial-gradient(circle, #c6912b, transparent 60%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <ScrollReveal>
            <div className="section-eyebrow justify-center mb-4">
              <span className="w-8 h-px bg-secondary-400" />
              Our Services
              <span className="w-8 h-px bg-secondary-400" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="section-heading mb-4">What We Do</h2>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <div className="gold-divider mx-auto mb-6" />
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="section-subheading">
              End-to-end real estate solutions tailored to your needs, from land acquisition to sales and marketing.
            </p>
          </ScrollReveal>
        </div>

        {/* Service Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayServices.map((service, i) => (
            <ScrollReveal key={service.id} delay={i * 100} direction="up">
              <Link
                href={`/services/${service.slug}`}
                className="group glass-card p-7 flex flex-col gap-5 h-full relative overflow-hidden"
              >
                {/* Hover glow effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at 50% 0%, rgba(198,145,43,0.06) 0%, transparent 70%)",
                  }}
                />

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-primary-600 transition-all duration-400 group-hover:scale-110 group-hover:shadow-lg relative z-10"
                  style={{
                    background: "linear-gradient(135deg, rgba(29,79,56,0.08), rgba(29,79,56,0.03))",
                    border: "1px solid rgba(29,79,56,0.10)",
                  }}
                >
                  {(() => {
                    const Icon = getServiceIcon("icon" in service ? (service.icon as string) : undefined);
                    return <Icon size={26} />;
                  })()}
                </div>

                <div className="flex-1 relative z-10">
                  <h3
                    className="font-bold text-primary-800 mb-2.5 text-base leading-snug group-hover:text-secondary-600 transition-colors duration-300"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {service.shortDescription || "Professional real estate services tailored to your needs."}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 group-hover:text-secondary-600 transition-all duration-300 relative z-10">
                  Learn More{" "}
                  <ArrowRight
                    size={12}
                    className="group-hover:translate-x-1.5 transition-transform duration-300"
                  />
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

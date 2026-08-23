import { Home, MessageSquare, TrendingUp, type LucideIcon } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

export interface ServiceItem {
  id: string;
  name: string;
  shortDescription: string | null;
  icon: string | null;
}

const iconMap: Record<string, LucideIcon> = {
  Home,
  MessageSquare,
  TrendingUp,
};

export function ServicesSection({ services }: { services: ServiceItem[] }) {
  if (services.length === 0) return null;

  return (
    <section
      id="services"
      className="py-20 lg:py-28 relative overflow-hidden"
      style={{ background: "var(--color-primary)" }}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-5"
        style={{ background: "radial-gradient(circle, #c6912b, transparent)", transform: "translate(-30%, -30%)" }} />
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-5"
        style={{ background: "radial-gradient(circle, #c6912b, transparent)", transform: "translate(30%, 30%)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="section-eyebrow justify-center mb-4">
              <span className="w-8 h-px bg-secondary-400" />
              Our Services
              <span className="w-8 h-px bg-secondary-400" />
            </div>
            <h2 className="section-heading-white mb-4">
              What We{" "}
              <span style={{ color: "#c6912b" }}>Do</span>
            </h2>
            <div className="gold-divider mx-auto mb-5" />
            <p className="text-white/60 text-base leading-relaxed">
              From finding the right plot to final ownership, we offer
              end-to-end real estate services tailored to your goals.
            </p>
          </div>
        </ScrollReveal>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = (service.icon && iconMap[service.icon]) || Home;
            return (
              <ScrollReveal key={service.id} delay={i * 80}>
                <div
                  className="glass-light rounded-2xl p-6 h-full hover:bg-white/15 transition-all duration-300 group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-secondary-400 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: "rgba(198,145,43,0.12)", border: "1px solid rgba(198,145,43,0.22)" }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-white text-base mb-2.5"
                    style={{ fontFamily: "var(--font-serif)" }}>
                    {service.name}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { Star } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import type { Testimonial } from "@prisma/client";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const visible = testimonials.filter((t) => t.isVisible).sort((a, b) => a.order - b.order);

  if (visible.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "#FFFFFF" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <ScrollReveal>
            <div className="section-eyebrow justify-center mb-4">
              <span className="w-8 h-px bg-secondary-400" />
              Testimonials
              <span className="w-8 h-px bg-secondary-400" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="section-heading mb-4">
              What Our Clients <span style={{ color: "#c6912b" }}>Say</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <div className="gold-divider mx-auto mb-6" />
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="section-subheading">
              Hear from property owners who trusted us with their investment.
            </p>
          </ScrollReveal>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visible.map((t, i) => (
            <ScrollReveal key={t.id} delay={i * 120} direction="up">
              <div className="h-full rounded-2xl p-6 sm:p-8 border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(29,79,56,0.06)] transition-all duration-500 flex flex-col">
                {/* Stars */}
                {t.rating && (
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star
                        key={si}
                        size={16}
                        className={si < t.rating! ? "text-secondary-400 fill-secondary-400" : "text-gray-200"}
                      />
                    ))}
                  </div>
                )}

                {/* Quote */}
                <p className="text-gray-600 leading-relaxed text-sm mb-6 flex-1">
                  &ldquo;{t.testimonial}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                    {t.photograph ? (
                      <img src={t.photograph} alt={t.clientName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-primary-700">{t.clientName.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-800">{t.clientName}</p>
                    {(t.position || t.company) && (
                      <p className="text-xs text-gray-400">
                        {[t.position, t.company].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

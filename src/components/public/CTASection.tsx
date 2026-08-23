import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

export function CTASection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/cta-bg.jpg')",
          filter: "brightness(0.35) saturate(1.2)",
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, rgba(29,79,56,0.85) 0%, rgba(15,34,24,0.75) 50%, rgba(29,79,56,0.80) 100%),
            radial-gradient(ellipse at center, rgba(198,145,43,0.08) 0%, transparent 70%)
          `,
        }}
      />

      {/* Decorative gold line at top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(198,145,43,0.4), transparent)" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <ScrollReveal>
          <div className="section-eyebrow justify-center mb-6">
            <span className="w-10 h-px bg-secondary-400" />
            Start Your Journey
            <span className="w-10 h-px bg-secondary-400" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Ready to Own Your{" "}
            <span className="gradient-text-gold">Dream Property?</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="text-white/55 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Whether you&apos;re looking for a residential plot, commercial property, or your
            dream home — we&apos;re here to make it happen. Book a free site visit today.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties" className="btn-secondary">
              Explore Properties <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="btn-outline">
              Book Free Site Visit <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>

        {/* Trust line */}
        <ScrollReveal delay={500}>
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-wrap items-center justify-center gap-8">
              {["Ready Title Deeds", "Lipa Pole Pole Plans", "Free Site Visits", "Professional Support"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary-400" />
                  <span className="text-xs text-white/40 font-medium tracking-wide">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

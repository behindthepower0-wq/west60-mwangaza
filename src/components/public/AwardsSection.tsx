"use client";

import { Award, Trophy, Star, Medal, Shield, Crown } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const awards = [
  {
    icon: Trophy,
    title: "Best Real Estate Company",
    year: "2024",
    description: "Recognized for excellence in land sales and customer service",
    color: "#c6912b",
  },
  {
    icon: Award,
    title: "Customer Service Excellence",
    year: "2024",
    description: "Awarded for outstanding client satisfaction and support",
    color: "#1d4f38",
  },
  {
    icon: Star,
    title: "Most Trusted Brand",
    year: "2023",
    description: "Trusted by hundreds of families for genuine property transactions",
    color: "#2a6b50",
  },
  {
    icon: Medal,
    title: "Quality Land Provider",
    year: "2023",
    description: "Recognized for providing verified, high-quality properties",
    color: "#9e7420",
  },
];

export function AwardsSection() {
  return (
    <section
      className="py-20 md:py-28"
      style={{ background: "var(--color-primary-dark)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="section-eyebrow mb-4 block">
              <Crown size={14} /> Our Achievements
            </span>
            <h2 className="section-heading-white mb-4">
              Awards & Recognition
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Our commitment to excellence has been recognized by industry
              leaders and most importantly, by our satisfied clients.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {awards.map((award, index) => (
            <ScrollReveal key={award.title} delay={index * 100}>
              <div
                className="rounded-2xl p-6 h-full text-center transition-transform hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ background: `${award.color}25` }}
                >
                  <award.icon size={28} style={{ color: award.color }} />
                </div>
                <span className="text-secondary text-xs font-bold tracking-wider">
                  {award.year}
                </span>
                <h3
                  className="text-white font-bold mt-2 mb-2"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {award.title}
                </h3>
                <p className="text-white/50 text-sm">{award.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal>
          <div className="mt-12 text-center">
            <a
              href="/about"
              className="inline-flex items-center gap-2 text-secondary hover:text-secondary-light transition-colors font-semibold text-sm"
            >
              Learn More About Us →
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

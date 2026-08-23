"use client";

import { FileCheck, Clock, MapPin, Users, Shield, Award } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const badges = [
  {
    icon: FileCheck,
    title: "Ready Title Deeds",
    description: "All properties come with ready title deeds for immediate transfer",
    color: "#1d4f38",
  },
  {
    icon: Clock,
    title: "10+ Years Experience",
    description: "Trusted by hundreds of families since our founding",
    color: "#c6912b",
  },
  {
    icon: MapPin,
    title: "Prime Locations",
    description: "Strategically located in Kenya's fastest-growing areas",
    color: "#2a6b50",
  },
  {
    icon: Users,
    title: "500+ Happy Clients",
    description: "Join hundreds of satisfied property owners",
    color: "#9e7420",
  },
  {
    icon: Shield,
    title: "Verified Properties",
    description: "Every property undergoes thorough due diligence",
    color: "#1d4f38",
  },
  {
    icon: Award,
    title: "Award Winning",
    description: "Recognized for excellence in real estate services",
    color: "#c6912b",
  },
];

export function TrustBadges() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2
              className="text-2xl md:text-3xl font-bold mb-3"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--color-primary)",
              }}
            >
              Why Trust West 60 Mwangaza?
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              We are committed to providing genuine, verified properties with
              complete transparency
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map((badge, index) => (
            <ScrollReveal key={badge.title} delay={index * 80}>
              <div className="text-center group">
                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: `${badge.color}12` }}
                >
                  <badge.icon size={28} style={{ color: badge.color }} />
                </div>
                <h3
                  className="font-bold text-sm mb-1"
                  style={{ color: "var(--color-primary)" }}
                >
                  {badge.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  {badge.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

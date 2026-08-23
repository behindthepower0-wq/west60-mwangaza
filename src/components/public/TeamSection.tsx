import { ScrollReveal } from "./ScrollReveal";
import type { TeamMember } from "@prisma/client";

interface TeamSectionProps {
  teamMembers: TeamMember[];
}

export function TeamSection({ teamMembers }: TeamSectionProps) {
  // Only show visible members, ordered by 'order'
  const visibleMembers = teamMembers.filter((m) => m.isVisible).sort((a, b) => a.order - b.order);

  if (visibleMembers.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden bg-[#FAFAF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <ScrollReveal>
            <div className="section-eyebrow justify-center mb-4">
              <span className="w-8 h-px bg-secondary-400" />
              Our People
              <span className="w-8 h-px bg-secondary-400" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="section-heading mb-4">
              Meet The People <span style={{ color: "#c6912b" }}>Behind The Brand</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <div className="gold-divider mx-auto mb-6" />
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="section-subheading">
              Our dedicated team of professionals is committed to helping you find your dream property.
            </p>
          </ScrollReveal>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {visibleMembers.map((member, i) => (
            <ScrollReveal key={member.id} delay={i * 100} direction="up">
              <div className="group relative overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_rgb(29,79,56,0.08)] transition-all duration-500">
                {/* Photo area */}
                <div className="aspect-[4/5] overflow-hidden relative">
                  {member.photograph ? (
                    <img 
                      src={member.photograph} 
                      alt={member.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center justify-center text-gray-400">
                      <span className="text-5xl font-serif text-gray-300 group-hover:text-secondary-300 transition-colors duration-500">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  {/* Subtle glass overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1d4f38]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 relative bg-white z-10 transition-transform duration-500 group-hover:-translate-y-2">
                  <h3 className="text-lg font-bold text-primary-800 mb-1" style={{ fontFamily: "var(--font-serif)" }}>
                    {member.name}
                  </h3>
                  <p className="text-sm font-semibold tracking-wide text-secondary-600 uppercase">
                    {member.position || "Team Member"}
                  </p>
                  
                  {/* Decorative line */}
                  <div className="w-8 h-0.5 bg-secondary-400 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

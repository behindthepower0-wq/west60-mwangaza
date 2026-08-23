import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const values = [
  "Quality Construction",
  "Transparent Process",
  "Prime Locations",
  "After-Sales Support",
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 lg:py-28 relative overflow-hidden" style={{ background: "#FFFFFF" }}>
      {/* Subtle decorative background */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.03] pointer-events-none"
        style={{ background: "radial-gradient(circle, #1d4f38, transparent 60%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Image side */}
          <ScrollReveal direction="left" className="relative order-2 lg:order-1">
            <div className="relative">
              {/* Main image */}
              <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl relative group">
                <img
                  src="/images/about-building.jpg"
                  alt="Modern property development by West 60 Mwangaza"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay gradient */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{ background: "linear-gradient(135deg, #1d4f38, transparent)" }}
                />
              </div>

              {/* Floating glass card */}
              <div
                className="absolute -bottom-6 -right-6 rounded-2xl p-6 shadow-xl animate-float"
                style={{
                  background: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(198,145,43,0.2)",
                  boxShadow: "0 12px 40px rgba(29,79,56,0.15)",
                }}
              >
                <p className="text-xs text-secondary-600 font-semibold tracking-wider uppercase mb-1.5">
                  Our Commitment
                </p>
                <p className="text-base font-bold text-primary-800" style={{ fontFamily: "var(--font-serif)" }}>
                  Ready Title Deeds.<br />Always.
                </p>
              </div>

              {/* Experience badge */}
              <div
                className="absolute -top-4 -left-4 w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #1d4f38, #2a6b50)",
                  border: "2px solid rgba(198,145,43,0.3)",
                  animation: "float 5s ease-in-out infinite reverse",
                }}
              >
                <span className="text-2xl font-bold text-secondary-400" style={{ fontFamily: "var(--font-serif)" }}>8+</span>
                <span className="text-[9px] text-white/60 font-medium tracking-wider uppercase">Years</span>
              </div>

              {/* Decorative blob */}
              <div
                className="absolute -top-12 -left-12 w-64 h-64 rounded-full -z-10"
                style={{ background: "radial-gradient(circle, rgba(198,145,43,0.08), transparent 60%)" }}
              />
            </div>
          </ScrollReveal>

          {/* Text side */}
          <div className="order-1 lg:order-2">
            <ScrollReveal>
              <div className="section-eyebrow mb-4">
                <span className="w-10 h-px bg-secondary-400" />
                About Us
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <h2 className="section-heading mb-6">
                Building With Purpose.{" "}
                <span style={{ color: "#c6912b" }}>Delivering Value.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="gold-divider mb-6" />
            </ScrollReveal>

            <ScrollReveal delay={250}>
              <p className="section-subheading mb-5">
                West 60 Mwangaza Properties Ltd is committed to delivering quality properties
                that enhance lives and stand the test of time. We specialize in genuine
                property investments across Kenya&apos;s fastest-growing corridors.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <p className="section-subheading mb-8">
                From land selling and real estate consultancy to sales, marketing and
                property management — we provide end-to-end real estate solutions tailored
                to your needs. Our properties come with ready title deeds and flexible
                payment plans designed to make property ownership accessible to everyone.
              </p>
            </ScrollReveal>

            {/* Value list */}
            <ScrollReveal delay={400}>
              <ul className="space-y-3 mb-8">
                {values.map((v, i) => (
                  <li key={v} className="flex items-center gap-3 group">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: "linear-gradient(135deg, rgba(198,145,43,0.15), rgba(198,145,43,0.05))",
                        border: "1px solid rgba(198,145,43,0.25)",
                      }}
                    >
                      <CheckCircle size={14} className="text-secondary-500" />
                    </div>
                    <span className="text-sm font-medium transition-colors duration-300 group-hover:text-primary-700" style={{ color: "var(--color-text-secondary)" }}>
                      {v}
                    </span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            <ScrollReveal delay={500}>
              <Link href="/about" className="btn-outline-primary">
                Learn More <ArrowRight size={16} />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

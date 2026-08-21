"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Shield, MapPin, Users, Play, ChevronDown } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";

const glassFeatures = [
  {
    icon: <Shield size={22} className="text-secondary-400" />,
    title: "Quality & Trust",
    desc: "Genuine properties with ready title deeds — no legal complications.",
  },
  {
    icon: <MapPin size={22} className="text-secondary-400" />,
    title: "Prime Locations",
    desc: "Katani, Kitengela, Joska, Malaa, Kitui — Kenya's growth corridors.",
  },
  {
    icon: <Users size={22} className="text-secondary-400" />,
    title: "Client Focused",
    desc: "Free site visits, flexible payment plans, and dedicated support.",
  },
];

const stats = [
  { value: "8+", label: "Years Experience" },
  { value: "500+", label: "Properties Sold" },
  { value: "1,200+", label: "Happy Clients" },
  { value: "15+", label: "Active Projects" },
];

function CountUpNumber({ value, delay }: { value: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <span
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ display: "inline-block" }}
    >
      {value}
    </span>
  );
}

export function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "#080E0C" }}
    >
      {/* Parallax background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-hero-parallax"
        style={{
          backgroundImage: `url('/images/hero-bg.jpg')`,
          filter: "brightness(0.4) saturate(1.2)",
          transform: `scale(1.1) translateY(${scrollY * 0.15}px)`,
        }}
        aria-hidden="true"
      />

      {/* Multi-layered gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, rgba(8,14,12,0.92) 0%, rgba(8,14,12,0.70) 40%, rgba(8,14,12,0.35) 70%, rgba(8,14,12,0.50) 100%),
            radial-gradient(ellipse at 80% 80%, rgba(201,168,76,0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 20% 20%, rgba(26,58,42,0.15) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Decorative gold orbs */}
      <div
        className="absolute top-20 right-20 w-96 h-96 rounded-full animate-float opacity-[0.03]"
        style={{
          background: "radial-gradient(circle, #C9A84C, transparent 60%)",
        }}
      />
      <div
        className="absolute bottom-40 left-10 w-64 h-64 rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, #C9A84C, transparent 60%)",
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />

      {/* Gold accent line at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent 5%, rgba(201,168,76,0.3) 30%, rgba(201,168,76,0.5) 50%, rgba(201,168,76,0.3) 70%, transparent 95%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-28 lg:pt-40 lg:pb-36">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left: Copy */}
          <div>
            {/* Eyebrow */}
            <div
              className={`section-eyebrow mb-6 transition-all duration-1000 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <span className="w-10 h-px bg-secondary-400 flex-shrink-0" />
              Welcome to West 60 Mwangaza
            </div>

            {/* Headline */}
            <h1
              className={`text-4xl sm:text-5xl xl:text-[3.5rem] font-bold leading-[1.1] mb-7 transition-all duration-1000 delay-200 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ fontFamily: "var(--font-serif)", color: "white" }}
            >
              Creating Spaces.{" "}
              <br className="hidden sm:block" />
              <span className="gradient-text-gold">Building Futures.</span>
            </h1>

            {/* Description */}
            <p
              className={`text-base md:text-lg text-white/60 leading-relaxed max-w-xl mb-9 transition-all duration-1000 delay-300 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              Premium residential and commercial properties across Kenya&apos;s
              fastest-growing corridors — with ready title deeds, free site
              visits, and flexible Lipa Pole Pole payment plans.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-3 transition-all duration-1000 delay-400 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <Link href="/properties" className="btn-secondary">
                Explore Properties <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className="btn-outline">
                Book a Site Visit <ArrowRight size={16} />
              </Link>
            </div>

            {/* Trust badges */}
            <div
              className={`flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-white/8 transition-all duration-1000 delay-500 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {["Ready Title Deeds", "Free Site Visits", "Lipa Pole Pole Plans"].map(
                (badge) => (
                  <div key={badge} className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-secondary-400 animate-pulse-glow" />
                    <span className="text-xs text-white/50 font-medium tracking-wide">
                      {badge}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right: Glass feature cards */}
          <div
            className={`flex flex-col gap-4 transition-all duration-1000 delay-500 ${
              loaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            {glassFeatures.map((feat, i) => (
              <div
                key={feat.title}
                className="glass-premium rounded-2xl p-5 flex items-start gap-4 transition-all duration-400 hover:bg-white/12 group cursor-default"
                style={{
                  transitionDelay: `${(i + 4) * 100}ms`,
                  animation: loaded
                    ? `fadeInRight 0.7s cubic-bezier(0.16,1,0.3,1) ${600 + i * 120}ms forwards`
                    : "none",
                  opacity: 0,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))",
                    border: "1px solid rgba(201,168,76,0.25)",
                  }}
                >
                  {feat.icon}
                </div>
                <div>
                  <h3
                    className="text-white font-semibold text-sm mb-1"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {feat.title}
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}

            {/* WhatsApp quick contact */}
            <a
              href={getWhatsAppUrl(
                "0711400933",
                "Hello! I would like to enquire about your properties."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-gold rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
              style={{
                animation: loaded
                  ? `fadeInRight 0.7s cubic-bezier(0.16,1,0.3,1) 960ms forwards`
                  : "none",
                opacity: 0,
              }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-green-500/15 border border-green-500/25 group-hover:bg-green-500/25 transition-colors">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-green-400"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
              <div className="flex-1">
                <p
                  className="text-white font-semibold text-sm"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Chat on WhatsApp
                </p>
                <p className="text-white/45 text-xs">
                  Quick response · 0711 400 933
                </p>
              </div>
              <ArrowRight
                size={16}
                className="text-white/25 group-hover:text-white/60 group-hover:translate-x-1 transition-all"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Statistics bar */}
      <div
        className="absolute bottom-0 left-0 right-0 hidden lg:block"
        style={{
          background: "rgba(10,20,16,0.6)",
          backdropFilter: "blur(20px) saturate(1.3)",
          WebkitBackdropFilter: "blur(20px) saturate(1.3)",
          borderTop: "1px solid rgba(201,168,76,0.12)",
        }}
      >
        <div className="max-w-7xl mx-auto px-8 py-6 grid grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-3xl font-bold text-secondary-400"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                <CountUpNumber value={stat.value} delay={1200 + i * 200} />
              </div>
              <div className="text-xs text-white/40 mt-1 tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-24 lg:bottom-28 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 animate-fade-in-up delay-800">
        <span className="text-[10px] text-white/30 tracking-[0.2em] uppercase">
          Scroll
        </span>
        <ChevronDown size={16} className="text-white/20 animate-bounce" />
      </div>
    </section>
  );
}

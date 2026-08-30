import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { getWhatsAppUrl } from "@/lib/utils";
import prisma from "@/lib/db";

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Properties", href: "/properties" },
  { label: "Projects", href: "/projects" },
  { label: "Our Team", href: "/team" },
  { label: "News & Insights", href: "/news" },
  { label: "Contact Us", href: "/contact" },
];

const areas = [
  "Katani", "Kitengela", "Joska", "Malaa", "Kitui"
];

export async function Footer() {
  const currentYear = new Date().getFullYear();

  const settingsRows = await prisma.siteSetting.findMany().catch(() => []);
  const settings: Record<string, string> = {};
  settingsRows.forEach((s) => { if (s.value) settings[s.key] = s.value; });

  const whatsappUrl = settings.whatsapp_url || getWhatsAppUrl("0711400933");
  const facebookUrl = settings.facebook_url || "https://www.facebook.com/west60mwangaza/";
  const instagramUrl = settings.instagram_url || "https://www.instagram.com/west60mwangazaproperties";
  const youtubeUrl = settings.youtube_url || "";
  const tiktokUrl = settings.tiktok_url || "https://vm.tiktok.com/ZS9BxDPojLPhc-YKyKL/";

  return (
    <footer style={{ background: "rgba(8,18,12,0.99)" }} className="text-white">
      {/* CTA Banner */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1d4f38 0%, #2a6b50 60%, #1d4f38 100%)",
          borderTop: "1px solid rgba(198,145,43,0.20)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-18 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="section-eyebrow mb-2">
              <span className="w-5 h-px" style={{ background: "#c6912b" }}></span>
              Get In Touch
            </div>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "white" }}>
              Let&apos;s Build Something<br className="hidden md:block" />{" "}
              <span style={{ color: "#c6912b" }}>Great Together</span>
            </h2>
            <p className="text-white/65 mt-2 text-sm">
              Talk to us today and let&apos;s turn your vision into reality.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link href="/contact" className="btn-secondary">
              Get In Touch →
            </Link>
            <a
              href={getWhatsAppUrl("0711400933", "Hello! I would like to enquire about your properties.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <Logo variant="white" size="md" />
            <p className="mt-5 text-white/55 text-sm leading-relaxed">
              West 60 Mwangaza Properties Ltd is committed to delivering quality
              properties that enhance lives and stand the test of time. Your trusted
              partner in real estate across Kenya.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-red-500 hover:bg-white/10 transition-all border border-white/10"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-blue-500 hover:bg-white/10 transition-all border border-white/10"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-pink-400 hover:bg-white/10 transition-all border border-white/10"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </a>
              )}
              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all border border-white/10"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
              )}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-green-400 hover:bg-white/10 transition-all border border-white/10"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-5 tracking-wider uppercase" style={{ fontFamily: "var(--font-sans)" }}>
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 hover:text-secondary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Areas */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-5 tracking-wider uppercase" style={{ fontFamily: "var(--font-sans)" }}>
              Our Areas
            </h3>
            <div className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <Link
                  key={area}
                  href={`/properties?area=${area.toLowerCase()}`}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/12 text-white/50 hover:text-secondary-400 hover:border-secondary-400/30 transition-all"
                >
                  {area}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-5 tracking-wider uppercase" style={{ fontFamily: "var(--font-sans)" }}>
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-secondary-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white/55 leading-relaxed">
                  Repen Complex, Block B, 4th Floor,<br />
                  Suite 412, Katani Rd at the<br />
                  Junction of Katani Rd &amp; Mombasa Rd,<br />
                  Syokimau, Nairobi
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-secondary-400 flex-shrink-0" />
                <div className="space-y-0.5">
                  <a href="tel:0711400933" className="block text-sm text-white/55 hover:text-white transition-colors">
                    0711 400 933
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-secondary-400 flex-shrink-0" />
                <a href="mailto:info@west60mwangaza.com" className="text-sm text-white/55 hover:text-white transition-colors">
                  info@west60mwangaza.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={15} className="text-secondary-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white/55 leading-relaxed">
                  Mon–Fri: 8:00 a.m – 4:30 p.m<br />
                  Sat: 9:00 a.m – 1:00 p.m
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/35">
            &copy; {currentYear} West 60 Mwangaza Properties Ltd. All rights reserved. | Designed &amp; Developed by{" "}
            <a href="https://m26media.co.ke" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">M26 Media</a>
          </p>
          <div className="flex items-center gap-4 text-xs text-white/35">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms of Service</Link>
            <span>·</span>
            <Link href="/sitemap.xml" className="hover:text-white/60 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { getWhatsAppUrl } from "@/lib/utils";

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Properties", href: "/properties" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Our Team", href: "/team" },
  { label: "News & Insights", href: "/news" },
  { label: "Contact Us", href: "/contact" },
];

const serviceLinks = [
  { label: "Land Selling", href: "/services/land-selling" },
  { label: "Real Estate Consultancy", href: "/services/real-estate-consultancy" },
  { label: "Sales & Marketing", href: "/services/sales-and-marketing" },
];

const areas = [
  "Katani", "Kitengela", "Joska", "Malaa", "Kitui"
];

export function Footer() {
  const currentYear = new Date().getFullYear();

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
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all border border-white/10"
              >
                FB
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all border border-white/10"
              >
                IG
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all border border-white/10"
              >
                IN
              </a>
              <a
                href={getWhatsAppUrl("0711400933")}
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

          {/* Column 3: Services + Areas */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-5 tracking-wider uppercase" style={{ fontFamily: "var(--font-sans)" }}>
              Our Services
            </h3>
            <ul className="space-y-2.5 mb-8">
              {serviceLinks.map((link) => (
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
            <h3 className="text-sm font-semibold text-white mb-3 tracking-wider uppercase" style={{ fontFamily: "var(--font-sans)" }}>
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
            &copy; {currentYear} West 60 Mwangaza Properties Ltd. All rights reserved.
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

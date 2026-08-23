import { Shield, Eye, MapPin, Award, Headphones, FileCheck } from "lucide-react";

const reasons = [
  {
    icon: <Shield size={24} />,
    title: "Quality Construction",
    description:
      "Every property we offer meets rigorous quality standards. We partner with trusted developers who share our commitment to excellence.",
  },
  {
    icon: <Eye size={24} />,
    title: "Transparent Process",
    description:
      "No hidden fees. No surprises. We guide you through every step of the property buying journey with complete transparency.",
  },
  {
    icon: <MapPin size={24} />,
    title: "Prime Locations",
    description:
      "Our properties are strategically located in high-growth areas: Katani, Kitengela, Joska, Malaa and Kitui for maximum value.",
  },
  {
    icon: <Award size={24} />,
    title: "Ready Title Deeds",
    description:
      "All our land comes with ready, clean title deeds. Your ownership is secure from day one, without legal complications.",
  },
  {
    icon: <Headphones size={24} />,
    title: "After-Sales Support",
    description:
      "Our relationship doesn't end at purchase. We provide ongoing support, site visit assistance, and property guidance.",
  },
  {
    icon: <FileCheck size={24} />,
    title: "Flexible Payment Plans",
    description:
      "Our Lipa Pole Pole payment structure makes property ownership accessible: spread your payments over a comfortable period.",
  },
];

export function WhyChooseUsSection() {
  return (
    <section
      id="why-choose-us"
      className="py-20 lg:py-28 relative overflow-hidden"
      style={{ background: "var(--color-primary)" }}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
        style={{ background: "radial-gradient(circle, #c6912b, transparent)", transform: "translate(30%, -30%)" }} />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-5"
        style={{ background: "radial-gradient(circle, #c6912b, transparent)", transform: "translate(-30%, 30%)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="section-eyebrow justify-center mb-4">
            <span className="w-8 h-px bg-secondary-400" />
            Why Choose Us
            <span className="w-8 h-px bg-secondary-400" />
          </div>
          <h2 className="section-heading-white mb-4">
            We Deliver More Than{" "}
            <span style={{ color: "#c6912b" }}>Properties</span>
          </h2>
          <div className="gold-divider mx-auto mb-5" />
          <p className="text-white/60 text-base leading-relaxed">
            Our commitment goes beyond selling land. We build relationships,
            deliver trust and create lasting value for every client we serve.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, i) => (
            <div
              key={reason.title}
              className="glass-light rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-secondary-400 transition-transform duration-300 group-hover:scale-110"
                style={{ background: "rgba(198,145,43,0.12)", border: "1px solid rgba(198,145,43,0.22)" }}
              >
                {reason.icon}
              </div>
              <h3 className="font-bold text-white text-base mb-2.5"
                style={{ fontFamily: "var(--font-serif)" }}>
                {reason.title}
              </h3>
              <p className="text-white/55 text-sm leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

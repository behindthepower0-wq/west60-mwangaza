"use client";

import { CheckCircle, Clock, CreditCard, Shield } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const plans = [
  {
    title: "Cash Purchase",
    highlight: true,
    badge: "Best Value",
    price: "From KES 650,000",
    description: "Get the best price when you pay in full",
    features: [
      "Up to 10% discount on listed price",
      "Immediate title deed processing",
      "No interest charges",
      "Priority site visit scheduling",
    ],
    cta: "View Properties",
    href: "/properties",
  },
  {
    title: "Installment Plan",
    highlight: false,
    badge: "Flexible",
    price: "From KES 50,000/month",
    description: "Spread your payment over 3-6 months",
    features: [
      "0% interest on installments",
      "Flexible 3-6 month terms",
      "Small down payment to secure your plot",
      "Title deed after final payment",
    ],
    cta: "Learn More",
    href: "/contact",
  },
  {
    title: "Mortgage Partner",
    highlight: false,
    badge: "Bank Financed",
    price: "From KES 40,000/month",
    description: "Extended payment through our bank partners",
    features: [
      "Up to 12 months financing",
      "Competitive interest rates",
      "Quick approval process",
      "Dedicated loan officer support",
    ],
    cta: "Apply Now",
    href: "/contact",
  },
];

export function PaymentPlansSection() {
  return (
    <section
      className="py-20 md:py-28"
      style={{ background: "var(--color-warm-white)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="section-eyebrow mb-4 block">
              <CreditCard size={14} /> Payment Options
            </span>
            <h2 className="section-heading mb-4">
              Flexible Payment Plans
            </h2>
            <p className="section-subheading max-w-2xl mx-auto">
              We believe everyone deserves the opportunity to own land. Choose
              the payment plan that works best for your budget.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <ScrollReveal key={plan.title} delay={index * 100}>
              <div
                className={`relative rounded-2xl p-8 h-full flex flex-col ${
                  plan.highlight
                    ? "bg-primary text-white shadow-xl scale-105"
                    : "bg-white"
                }`}
                style={
                  !plan.highlight
                    ? {
                        boxShadow: "var(--shadow-card)",
                        border: "1px solid rgba(198,145,43,0.12)",
                      }
                    : {}
                }
              >
                {/* Badge */}
                <span
                  className={`inline-block self-start text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-6 ${
                    plan.highlight
                      ? "bg-white/20 text-white"
                      : "bg-secondary/10 text-secondary-dark"
                  }`}
                >
                  {plan.badge}
                </span>

                {/* Title & Price */}
                <h3
                  className={`text-xl font-bold mb-2 ${
                    plan.highlight ? "text-white" : "text-primary"
                  }`}
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {plan.title}
                </h3>
                <p
                  className={`text-2xl font-bold mb-2 ${
                    plan.highlight ? "text-secondary" : "text-primary"
                  }`}
                >
                  {plan.price}
                </p>
                <p
                  className={`text-sm mb-6 ${
                    plan.highlight ? "text-white/70" : "text-text-secondary"
                  }`}
                >
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle
                        size={18}
                        className={`flex-shrink-0 mt-0.5 ${
                          plan.highlight ? "text-secondary" : "text-primary"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          plan.highlight ? "text-white/90" : "text-text-secondary"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={plan.href}
                  className={`block text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all ${
                    plan.highlight
                      ? "bg-secondary text-primary-dark hover:bg-secondary-light"
                      : "bg-primary text-white hover:bg-primary-light"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Trust note */}
        <ScrollReveal>
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-text-secondary">
              <Shield size={16} className="text-primary" />
              <span>
                All plans include ready title deeds and free site visits
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

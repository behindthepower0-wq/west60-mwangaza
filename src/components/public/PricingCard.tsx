"use client";

import { CheckCircle, CreditCard, Phone, Calculator } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface PricingCardProps {
  price: number | null;
  currency?: string | null;
  priceLabel?: string | null;
  location?: string | null;
  propertyType?: string | null;
  area?: string | null;
}

export function PricingCard({
  price,
  currency = "KES",
  priceLabel,
  location,
  propertyType,
  area,
}: PricingCardProps) {
  const displayPrice = priceLabel || formatPrice(price, currency ?? undefined);
  const installmentMonthly = price ? Math.round(price / 6) : null;
  const cashDiscount = price ? Math.round(price * 0.9) : null;

  return (
    <div
      className="rounded-2xl overflow-hidden sticky top-6"
      style={{
        boxShadow: "var(--shadow-card)",
        border: "1px solid rgba(198,145,43,0.12)",
      }}
    >
      {/* Header */}
      <div
        className="p-6 text-white"
        style={{
          background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
        }}
      >
        <p className="text-white/70 text-sm mb-1">Starting From</p>
        <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)" }}>
          {displayPrice}
        </p>
        {location && (
          <p className="text-white/60 text-sm mt-2">{location}</p>
        )}
      </div>

      {/* Pricing Options */}
      <div className="p-6 space-y-4">
        {/* Cash Price */}
        {cashDiscount && (
          <div
            className="p-4 rounded-xl"
            style={{ background: "rgba(29,79,56,0.05)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-primary">
                Cash Price
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                Save 10%
              </span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {formatPrice(cashDiscount, currency ?? undefined)}
            </p>
            <p className="text-xs text-text-muted mt-1">
              One-time payment, immediate title deed
            </p>
          </div>
        )}

        {/* Installment Price */}
        {installmentMonthly && (
          <div
            className="p-4 rounded-xl"
            style={{ background: "rgba(198,145,43,0.05)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-secondary-dark">
                6-Month Plan
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary-dark">
                0% Interest
              </span>
            </div>
            <p className="text-2xl font-bold text-secondary-dark">
              {formatPrice(installmentMonthly, currency ?? undefined)}
              <span className="text-sm font-normal text-text-muted">/month</span>
            </p>
            <p className="text-xs text-text-muted mt-1">
              Spread over 6 months, title deed after final payment
            </p>
          </div>
        )}

        {/* Property Details */}
        <div className="space-y-2 pt-2">
          {propertyType && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <CheckCircle size={14} className="text-primary" />
              <span>Property Type: {propertyType}</span>
            </div>
          )}
          {area && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <CheckCircle size={14} className="text-primary" />
              <span>Size: {area}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <CheckCircle size={14} className="text-primary" />
            <span>Ready Title Deed</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <CheckCircle size={14} className="text-primary" />
            <span>Free Site Visit</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="pt-4 space-y-3">
          <a
            href="/contact"
            className="block w-full py-3 px-6 rounded-xl font-semibold text-sm text-center text-white transition-all hover:shadow-lg"
            style={{ background: "var(--color-primary)" }}
          >
            <Phone size={16} className="inline mr-2" />
            Enquire Now
          </a>
          <a
            href={`https://wa.me/254711400933?text=Hi, I'm interested in this property`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 px-6 rounded-xl font-semibold text-sm text-center transition-all hover:shadow-lg"
            style={{
              background: "#25D366",
              color: "white",
            }}
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  );
}

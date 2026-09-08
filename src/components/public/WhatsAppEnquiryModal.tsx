"use client";

import { useEffect, useState } from "react";
import { X, Loader2, Send, Calendar, MapPin } from "lucide-react";

interface PropertyOption {
  id: string;
  name: string;
  location: string | null;
}

interface WhatsAppEnquiryModalProps {
  open: boolean;
  onClose: () => void;
  defaultPropertyId?: string;
}

export function WhatsAppEnquiryModal({
  open,
  onClose,
  defaultPropertyId,
}: WhatsAppEnquiryModalProps) {
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [propertyId, setPropertyId] = useState(defaultPropertyId || "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Load published properties once for the selector
  useEffect(() => {
    if (!open || properties.length > 0) return;
    fetch("/api/properties")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProperties(data);
      })
      .catch(() => {
        /* property selector is optional; leave empty */
      });
  }, [open, properties.length]);

  // Sync when a default property is passed in
  useEffect(() => {
    if (defaultPropertyId) setPropertyId(defaultPropertyId);
  }, [defaultPropertyId]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/enquiries/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          propertyId: propertyId || undefined,
          visitDate: visitDate || undefined,
          message: message || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Something went wrong");
      }

      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank", "noopener,noreferrer");
      }
      onClose();
      setName("");
      setEmail("");
      setPhone("");
      setVisitDate("");
      setMessage("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to open WhatsApp. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3
            className="font-semibold text-gray-800"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Chat With Us on WhatsApp
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-gray-500">
            Tell us about your interest and we&apos;ll continue the conversation on
            WhatsApp — or book a free site visit.
          </p>

          {properties.length > 0 && (
            <div>
              <label className="form-label">Interested Property</label>
              <select
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="form-input bg-white"
              >
                <option value="">General enquiry (no specific property)</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                    {p.location ? ` — ${p.location}` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="form-label">Phone *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
                placeholder="07xx xxx xxx"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="form-label flex items-center gap-1.5">
              <Calendar size={14} className="text-secondary-500" />
              Preferred Site Visit Date
            </label>
            <input
              type="date"
              value={visitDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setVisitDate(e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Message (Optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="form-input resize-none"
              placeholder="Any questions about payment plans, title deeds, or the area?"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm p-3 rounded-xl bg-red-50">
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-60"
            style={{ background: "#25D366" }}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Opening WhatsApp...
              </>
            ) : (
              <>
                <Send size={16} /> Continue on WhatsApp
              </>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
            <MapPin size={11} /> Free site visits available · Repen Complex,
            Syokimau
          </p>
        </form>
      </div>
    </div>
  );
}
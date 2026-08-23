"use client";

import { useState } from "react";
import { Save, Loader2, CheckCircle } from "lucide-react";

interface SettingsFormProps {
  initialSettings: Record<string, string>;
}

const settingGroups = [
  {
    title: "Company Information",
    fields: [
      { key: "company_name", label: "Company Name", type: "text", placeholder: "West 60 Mwangaza Properties Ltd" },
      { key: "company_tagline", label: "Tagline / Slogan", type: "text", placeholder: "Creating Spaces. Building Futures." },
      { key: "company_description", label: "Company Description", type: "textarea", placeholder: "Brief company description..." },
    ],
  },
  {
    title: "Contact Details",
    fields: [
      { key: "phone_primary", label: "Phone / WhatsApp", type: "tel", placeholder: "0711 400 933" },
      { key: "email", label: "Email Address", type: "email", placeholder: "info@west60mwangaza.com" },
      { key: "address", label: "Physical Address", type: "textarea", placeholder: "At the Junction of Katani Rd and Mombasa Rd..." },
      { key: "working_hours", label: "Working Hours", type: "text", placeholder: "Mon-Fri: 8a.m-4:30p.m, Sat: 9a.m-1p.m" },
    ],
  },
  {
    title: "Social Media",
    fields: [
      { key: "facebook_url", label: "Facebook URL", type: "url", placeholder: "https://facebook.com/..." },
      { key: "instagram_url", label: "Instagram URL", type: "url", placeholder: "https://instagram.com/..." },
      { key: "linkedin_url", label: "LinkedIn URL", type: "url", placeholder: "https://linkedin.com/..." },
      { key: "twitter_url", label: "X / Twitter URL", type: "url", placeholder: "https://x.com/..." },
      { key: "youtube_url", label: "YouTube URL", type: "url", placeholder: "https://youtube.com/..." },
      { key: "tiktok_url", label: "TikTok URL", type: "url", placeholder: "https://tiktok.com/..." },
    ],
  },
  {
    title: "SEO Defaults",
    fields: [
      { key: "default_seo_title", label: "Default SEO Title", type: "text", placeholder: "West 60 Mwangaza Properties | Premium Real Estate in Kenya" },
      { key: "default_meta_description", label: "Default Meta Description", type: "textarea", placeholder: "Your trusted real estate partner in Kenya..." },
    ],
  },
];

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [values, setValues] = useState<Record<string, string>>(initialSettings);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const handleChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {settingGroups.map(group => (
        <div key={group.title} className="admin-card">
          <h2 className="font-bold text-gray-800 text-base mb-6 pb-4 border-b border-gray-100"
            style={{ fontFamily: "var(--font-serif)" }}>
            {group.title}
          </h2>
          <div className="space-y-4">
            {group.fields.map(field => (
              <div key={field.key}>
                <label className="form-label">{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    value={values[field.key] || ""}
                    onChange={e => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className="form-input resize-none"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={values[field.key] || ""}
                    onChange={e => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="form-input"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between py-4 px-6 bg-white rounded-xl border border-gray-100 shadow-sm sticky bottom-4">
        {status === "saved" && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle size={16} /> Settings saved successfully
          </div>
        )}
        {status === "error" && (
          <p className="text-red-500 text-sm">Failed to save. Please try again.</p>
        )}
        {(status === "idle" || status === "saving") && <div />}
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="btn-primary text-sm"
        >
          {status === "saving" ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Settings</>}
        </button>
      </div>
    </div>
  );
}

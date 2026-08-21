"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Please enter a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  propertyRef: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface ContactFormProps {
  propertyName?: string;
  propertyId?: string;
  projectId?: string;
}

export function ContactForm({ propertyName, propertyId, projectId }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      subject: propertyName ? `Enquiry about: ${propertyName}` : "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, propertyId, projectId }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: "rgba(34,197,94,0.10)" }}>
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-primary-800 mb-2" style={{ fontFamily: "var(--font-serif)" }}>
          Message Sent!
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          Thank you for reaching out. We&apos;ll get back to you shortly.
        </p>
        <button onClick={() => setStatus("idle")} className="btn-outline-primary text-sm">
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Full Name *</label>
          <input {...register("name")} className="form-input" placeholder="Your full name" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="form-label">Email Address *</label>
          <input {...register("email")} type="email" className="form-input" placeholder="your@email.com" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Phone Number</label>
          <input {...register("phone")} type="tel" className="form-input" placeholder="07xx xxx xxx" />
        </div>
        <div>
          <label className="form-label">Subject *</label>
          <input {...register("subject")} className="form-input" placeholder="What is this about?" />
          {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
        </div>
      </div>

      <div>
        <label className="form-label">Message *</label>
        <textarea
          {...register("message")}
          rows={5}
          className="form-input resize-none"
          placeholder="Tell us more about what you're looking for..."
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-red-500 text-sm p-3 rounded-xl bg-red-50">
          <AlertCircle size={16} />
          <span>Something went wrong. Please try again or call us directly.</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary w-full justify-center"
      >
        {status === "loading" ? (
          <><Loader2 size={16} className="animate-spin" /> Sending...</>
        ) : (
          <><Send size={16} /> Send Message</>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Your information is secure and will not be shared with third parties.
      </p>
    </form>
  );
}

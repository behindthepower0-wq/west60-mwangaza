"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, Mail, AlertCircle } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setErrorMsg("Please fill in all fields."); setStatus("error"); return; }
    setStatus("loading");
    setErrorMsg("");

    const result = await signIn("credentials", {
      email, password, redirect: false,
    });

    if (result?.ok) {
      router.push(callbackUrl);
      router.refresh();
    } else {
      setStatus("error");
      setErrorMsg("Invalid email or password. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div>
        <label className="block text-xs font-medium text-white/60 mb-1.5">Email Address</label>
        <div className="relative">
          <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@west60mwangaza.com"
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
            onFocus={(e) => e.target.style.borderColor = "rgba(198,145,43,0.50)"}
            onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.10)"}
            autoComplete="email"
            required
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-xs font-medium text-white/60 mb-1.5">Password</label>
        <div className="relative">
          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-10 pr-11 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
            onFocus={(e) => e.target.style.borderColor = "rgba(198,145,43,0.50)"}
            onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.10)"}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {/* Error */}
      {status === "error" && (
        <div className="flex items-center gap-2 text-red-400 text-xs p-3 rounded-xl"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
          <AlertCircle size={14} className="flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3.5 rounded-xl font-semibold text-sm text-primary-900 transition-all duration-200 mt-2 flex items-center justify-center gap-2"
        style={{
          background: status === "loading"
            ? "rgba(198,145,43,0.60)"
            : "linear-gradient(135deg, #c6912b, #d9a94e)",
          boxShadow: "0 4px 16px rgba(198,145,43,0.25)",
        }}
      >
        {status === "loading" ? (
          <><Loader2 size={16} className="animate-spin" /> Signing in...</>
        ) : (
          "Sign In to Dashboard"
        )}
      </button>
    </form>
  );
}

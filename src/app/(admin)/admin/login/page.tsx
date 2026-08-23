import { Suspense } from "react";
import { Logo } from "@/components/ui/Logo";
import LoginForm from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #081a10 0%, #0f3021 50%, #081a10 100%)" }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
        style={{ background: "radial-gradient(circle, #c6912b, transparent)", transform: "translate(30%, -30%)" }} />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-5"
        style={{ background: "radial-gradient(circle, #2a6b50, transparent)", transform: "translate(-30%, 30%)" }} />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div
          className="rounded-3xl p-8 md:p-10"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
          }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo variant="white" size="lg" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-serif)" }}>
              CMS Sign In
            </h1>
            <p className="text-white/45 text-sm">Enter your credentials to access the dashboard.</p>
          </div>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>

          <p className="text-center text-[10px] text-white/25 mt-8">
            West 60 Mwangaza Properties · Secure CMS Access
          </p>
        </div>
      </div>
    </div>
  );
}

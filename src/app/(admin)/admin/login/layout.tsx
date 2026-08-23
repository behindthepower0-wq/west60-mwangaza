import type { Metadata } from "next";
import type { Viewport } from "next";

export const metadata: Metadata = {
  title: "Admin Login | West 60 Mwangaza CMS",
  description: "Sign in to the West 60 Mwangaza Properties content management system.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#1d4f38" };

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

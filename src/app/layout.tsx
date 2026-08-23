import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | West 60 Mwangaza Properties",
    default: "West 60 Mwangaza Properties | Premium Real Estate in Kenya",
  },
  description:
    "West 60 Mwangaza Properties, your trusted partner for quality land and property in Kenya. Serving Katani, Kitengela, Joska, Malaa and Kitui with ready title deeds and flexible payment plans.",
  keywords: [
    "West 60 Mwangaza",
    "properties Kenya",
    "land for sale Nairobi",
    "Katani land",
    "Kitengela plots",
    "Joska land",
    "Malaa plots",
    "Syokimau real estate",
    "Kenya real estate",
    "title deed",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: "West 60 Mwangaza Properties",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

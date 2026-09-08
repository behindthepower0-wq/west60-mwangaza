import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { FloatingWhatsApp } from "@/components/public/FloatingWhatsApp";
import { WhatsAppModalProvider } from "@/components/public/WhatsAppModalProvider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WhatsAppModalProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </WhatsAppModalProvider>
  );
}

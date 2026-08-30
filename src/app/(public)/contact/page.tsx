import type { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
import { ContactForm } from '@/components/public/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with West 60 Mwangaza Properties. Office in Syokimau, Nairobi. Call 0711 400 933 or email info@west60mwangaza.com.',
};

export default function ContactPage() {
  return (
    <>
      <section className="relative pt-32 pb-16" style={{ background: 'var(--color-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="section-eyebrow justify-center mb-4"><span className="w-8 h-px bg-secondary-400" />Contact Us<span className="w-8 h-px bg-secondary-400" /></div>
          <h1 className="section-heading-white mb-4">Get In <span style={{ color: '#c6912b' }}>Touch</span></h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">We&apos;d love to hear from you. Reach out and our team will respond promptly.</p>
        </div>
      </section>

      <section className="py-20" style={{ background: 'var(--color-warm-white)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="section-heading mb-8">Contact Information</h2>
              <div className="space-y-5">
                {[
                  { icon: MapPin, label: 'Office Address', value: 'Repen Complex, Block B, 4th Floor,\nSuite 412, Katani Rd at the Junction\nof Katani Rd and Mombasa Rd, Syokimau' },
                  { icon: Phone, label: 'Phone / WhatsApp', value: '0711 400 933', href: 'tel:0711400933' },
                  { icon: Mail, label: 'Email', value: 'info@west60mwangaza.com', href: 'mailto:info@west60mwangaza.com' },
                  { icon: Clock, label: 'Working Hours', value: 'Monday–Friday: 8:00 a.m – 4:30 p.m\nSaturday: 9:00 a.m – 1:00 p.m' },
                ].map((item) => (
                  <div key={item.label} className="glass-card p-5 flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(29,79,56,0.07)' }}>
                      <item.icon size={20} className="text-secondary-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wider mb-1">{item.label}</p>
                      {'href' in item && item.href ? (
                        <a href={item.href} className="text-sm text-primary-700 font-medium hover:text-secondary-600 transition-colors whitespace-pre-line">{item.value}</a>
                      ) : (
                        <p className="text-sm text-gray-600 whitespace-pre-line">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl overflow-hidden border border-primary-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7!2d36.87!3d-1.38!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMsKwMjInNDguMCJTIDM2wrA1MicyNC4wIkU!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="West 60 Mwangaza Office Location"
                  className="w-full h-56 sm:h-64"
                />
                <a href="https://maps.app.goo.gl/TssHVf3wLmF9Tb5D8" target="_blank" rel="noopener noreferrer"
                  className="block text-center text-xs text-primary-600 hover:text-secondary-600 transition-colors py-2 bg-primary-50">
                  Open in Google Maps →
                </a>
              </div>
            </div>
            <div className="glass-card p-5 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare size={20} className="text-secondary-500" />
                <h2 className="text-xl font-bold text-primary-800" style={{ fontFamily: 'var(--font-serif)' }}>Send Us a Message</h2>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

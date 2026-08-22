import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about West 60 Mwangaza Properties — our mission, vision, values and commitment to quality real estate in Kenya.',
};

const values = [
  { title: 'Integrity', desc: 'We conduct all our business with complete honesty and transparency.' },
  { title: 'Quality', desc: 'We never compromise on the standards of properties we represent.' },
  { title: 'Customer Focus', desc: 'Every decision we make is guided by the best interests of our clients.' },
  { title: 'Innovation', desc: 'We continuously improve our services and adopt better ways of serving you.' },
];

import prisma from '@/lib/db';
import { TeamSection } from '@/components/public/TeamSection';

export default async function AboutPage() {
  const teamMembers = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' },
  }).catch(() => []);

  return (
    <>
      <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: 'var(--color-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="section-eyebrow justify-center mb-4">
            <span className="w-8 h-px bg-secondary-400" />About Us<span className="w-8 h-px bg-secondary-400" />
          </div>
          <h1 className="section-heading-white mb-6">Building With Purpose. <span style={{ color: '#C9A84C' }}>Delivering Value.</span></h1>
          <p className="text-white/65 text-lg max-w-2xl mx-auto leading-relaxed">
            West 60 Mwangaza Properties Ltd — your trusted real estate partner across Kenya.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-eyebrow mb-4"><span className="w-8 h-px bg-secondary-400" />Our Story</div>
          <h2 className="section-heading mb-6">Who We Are</h2>
          <div className="prose-brand space-y-4">
            <p>West 60 Mwangaza Properties Ltd is a Kenyan real estate company committed to delivering quality, genuine property investment opportunities to Kenyans and the diaspora alike.</p>
            <p>Based at Repen Complex, Syokimau — at the strategic junction of Katani Road and Mombasa Road — we are positioned at the heart of Nairobi&apos;s fastest growing property corridor. Our office at Block B, 4th Floor, Suite 412 serves clients across Kenya and beyond.</p>
            <p>We specialize in land selling, real estate consultancy, sales and marketing, and property management. All our properties come with ready title deeds, flexible payment plans including our Lipa Pole Pole installment option, and free site visits for prospective buyers.</p>
            <p>Our property areas include Katani, Kitengela, Joska, Malaa and Kitui — all high-growth locations within and around Nairobi with excellent access to infrastructure and amenities.</p>
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: 'var(--color-warm-white)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
          <div className="glass-card p-8">
            <div className="w-12 h-12 rounded-xl mb-5 flex items-center justify-center" style={{ background: 'rgba(26,58,42,0.08)' }}>
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="section-heading text-2xl mb-4">Our Mission</h3>
            <p className="section-subheading">To provide accessible, genuine and quality property investment opportunities that enhance the lives of our clients and communities while delivering exceptional value and lasting legacies.</p>
          </div>
          <div className="glass-card p-8">
            <div className="w-12 h-12 rounded-xl mb-5 flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.08)' }}>
              <span className="text-2xl">🔭</span>
            </div>
            <h3 className="section-heading text-2xl mb-4">Our Vision</h3>
            <p className="section-subheading">To be Kenya&apos;s most trusted property company — known for integrity, quality and a relentless commitment to putting our clients first in every transaction.</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="section-eyebrow justify-center mb-4"><span className="w-8 h-px bg-secondary-400" />Core Values<span className="w-8 h-px bg-secondary-400" /></div>
            <h2 className="section-heading">What We Stand For</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="glass-card p-6">
                <CheckCircle size={24} className="text-secondary-500 mb-4" />
                <h3 className="font-bold text-primary-800 text-lg mb-2" style={{ fontFamily: 'var(--font-serif)' }}>{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TeamSection teamMembers={teamMembers} />

      <section className="py-16" style={{ background: 'var(--color-primary)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Ready to Find Your Property?</h2>
          <p className="text-white/60 mb-8">Contact us today or explore our available properties.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/properties" className="btn-secondary">Explore Properties <ArrowRight size={16} /></Link>
            <Link href="/contact" className="btn-outline">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
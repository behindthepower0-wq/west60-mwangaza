import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Home, HeartHandshake, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Who We Are | West 60 Mwangaza Properties',
  description: 'The story, mission and values behind West 60 Mwangaza Properties — Kenya\'s trusted real estate partner for genuine land and property investment.',
};

const values = [
  {
    icon: <ShieldCheck size={22} className="text-secondary-500" />,
    title: 'Integrity',
    desc: 'We conduct all our business with complete honesty and transparency. Every property is verified with a ready title deed and no legal complications.',
  },
  {
    icon: <Home size={22} className="text-secondary-500" />,
    title: 'Quality',
    desc: 'We never compromise on the standards of the properties we represent, from documentation to location and long-term value.',
  },
  {
    icon: <HeartHandshake size={22} className="text-secondary-500" />,
    title: 'Customer Focus',
    desc: 'Every decision we make is guided by the best interests of our clients — with free site visits, flexible payment plans and dedicated support.',
  },
  {
    icon: <CheckCircle size={22} className="text-secondary-500" />,
    title: 'Innovation',
    desc: 'We continuously improve our services and adopt better ways of serving you, including our popular Lipa Pole Pole installment plans.',
  },
];

const milestones = [
  {
    period: 'Our Foundation',
    title: 'A Promise of Genuine Property',
    desc: 'West 60 Mwangaza Properties Ltd was founded on a simple belief: every Kenyan deserves access to genuine, verifiable property investment opportunities. From our base in Syokimau, we set out to build a real estate company known for trust above all else.',
  },
  {
    period: 'Growth Corridors',
    title: 'Positioned Where Growth Happens',
    desc: 'We built our portfolio in Kenya\'s fastest-growing corridors — Katani, Kitengela, Joska, Malaa and Kitui — locations with strong infrastructure and amenities that give our clients real long-term value.',
  },
  {
    period: 'Today',
    title: 'Hundreds of Happy Clients',
    desc: 'Through ready title deeds, flexible Lipa Pole Pole payment plans and a client-first approach, we have helped hundreds of families and investors secure their own land and properties across the region.',
  },
];

export default function WhoWeArePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: 'var(--color-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="section-eyebrow justify-center mb-4">
            <span className="w-8 h-px bg-secondary-400" />Who We Are<span className="w-8 h-px bg-secondary-400" />
          </div>
          <h1 className="section-heading-white mb-6">
            The People Behind <span style={{ color: '#c6912b' }}>The Promise</span>
          </h1>
          <p className="text-white/65 text-lg max-w-2xl mx-auto leading-relaxed">
            We are a Kenyan real estate company committed to delivering genuine, quality
            property opportunities — with integrity in every transaction.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/properties" className="btn-secondary">
              Explore Properties <ArrowRight size={16} />
            </Link>
            <Link href="/about" className="btn-outline">
              Meet the Team
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story / History */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-eyebrow mb-4"><span className="w-8 h-px bg-secondary-400" />Our History</div>
          <h2 className="section-heading mb-10">How We Got Here</h2>
          <div className="space-y-8">
            {milestones.map((m) => (
              <div key={m.title} className="relative pl-8 border-l-2 border-secondary-200">
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-secondary-400 border-4 border-white" />
                <p className="text-xs font-bold uppercase tracking-widest text-secondary-600 mb-1">{m.period}</p>
                <h3 className="text-lg font-bold text-primary-800 mb-2" style={{ fontFamily: 'var(--font-serif)' }}>{m.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20" style={{ background: 'var(--color-warm-white)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
          <div className="glass-card p-8">
            <div className="w-12 h-12 rounded-xl mb-5 flex items-center justify-center" style={{ background: 'rgba(29,79,56,0.08)' }}>
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="section-heading text-2xl mb-4">Our Mission</h3>
            <p className="section-subheading">
              To provide accessible, genuine and quality property investment opportunities that enhance
              the lives of our clients and communities while delivering exceptional value and lasting legacies.
            </p>
          </div>
          <div className="glass-card p-8">
            <div className="w-12 h-12 rounded-xl mb-5 flex items-center justify-center" style={{ background: 'rgba(198,145,43,0.08)' }}>
              <span className="text-2xl">🔭</span>
            </div>
            <h3 className="section-heading text-2xl mb-4">Our Vision</h3>
            <p className="section-subheading">
              To be Kenya&apos;s most trusted property company, known for its integrity, quality and a
              relentless commitment to putting our clients first in every transaction.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="section-eyebrow justify-center mb-4"><span className="w-8 h-px bg-secondary-400" />What Guides Us<span className="w-8 h-px bg-secondary-400" /></div>
            <h2 className="section-heading">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="glass-card p-6">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(198,145,43,0.10)' }}>
                  {v.icon}
                </div>
                <h3 className="font-bold text-primary-800 text-lg mb-2" style={{ fontFamily: 'var(--font-serif)' }}>{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: 'var(--color-primary)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            Ready to Find Your Property?
          </h2>
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
import { motion } from 'framer-motion';
import TiltCard from './TiltCard';

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['Neuro-Kinetic Profiles', 'Community Support', 'Standard Macros'],
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$4.99',
    period: '/month',
    features: ['Cloud Sync', 'Neuro-Kinetic Profiles', 'Analytics Dashboard', 'Priority Support'],
    highlight: true,
  },
  {
    name: 'Elite',
    price: '$9.99',
    period: '/month',
    features: ['Analytics Dashboard', 'Cloud Sync', 'Tournament Macros', 'Hardware Audit Certificate'],
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-bg py-20 md:py-28">
      <div className="max-w-[1160px] mx-auto px-6 md:px-10 lg:px-16">

        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-7 h-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
            <span className="text-[11px] text-dim uppercase tracking-[0.32em] font-sans">Plans</span>
            <div className="w-7 h-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-fg leading-tight">
            Scale Your{' '}<em className="font-display italic text-fg/60">Performance</em>
          </h2>
          <p className="mt-3 text-sm text-dim font-sans max-w-sm mx-auto">
            From free to pro — pick the tier that matches your ambition.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 items-center"
          style={{ perspective: '1400px' }}>
          {TIERS.map((tier, i) => (
            <TiltCard
              key={tier.name}
              className={`rounded-3xl p-8 flex flex-col gap-6 ${tier.highlight ? 'md:scale-[1.03]' : ''}`}
              intensity={9}
              style={
                tier.highlight
                  ? {
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(137,170,204,0.35)',
                      boxShadow: '0 0 50px rgba(78,133,191,0.14)',
                    }
                  : {
                      background: 'rgba(255,255,255,0.025)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }
              }
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] as const }}
            >
              {tier.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <div
                    className="text-[10px] font-sans font-bold uppercase tracking-widest px-4 py-1 rounded-full text-bg"
                    style={{ background: 'linear-gradient(90deg,#89AACC,#4E85BF)' }}
                  >
                    Recommended
                  </div>
                </div>
              )}

              <div style={{ transform: 'translateZ(16px)' }}>
                <p className="text-xs text-dim uppercase tracking-[0.3em] font-sans mb-2">{tier.name}</p>
                <div className="flex items-end gap-1">
                  <span
                    className="font-display leading-none"
                    style={{
                      fontSize: 'clamp(2.8rem,6vw,4rem)',
                      textShadow: tier.highlight
                        ? '0 2px 12px rgba(137,170,204,0.3)'
                        : 'none',
                    }}
                  >
                    {tier.price}
                  </span>
                  <span className="text-dim text-sm font-sans mb-2">{tier.period}</span>
                </div>
              </div>

              <ul className="space-y-3 flex-1" style={{ transform: 'translateZ(8px)' }}>
                {tier.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm font-sans text-dim">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(137,170,204,0.12)' }}>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3.3 5.8L6.5 2.2" stroke="#89AACC" strokeWidth="1.4"
                          strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className="w-full rounded-full py-3 text-sm font-sans font-medium transition-all duration-300 hover:scale-[1.03]"
                style={
                  tier.highlight
                    ? { background: 'linear-gradient(90deg,#89AACC,#4E85BF)', color: '#060e1a', transform: 'translateZ(12px)' }
                    : { color: 'hsl(0 0% 96%)', border: '1px solid rgba(255,255,255,0.12)', transform: 'translateZ(12px)' }
                }
              >
                Get Started
              </button>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

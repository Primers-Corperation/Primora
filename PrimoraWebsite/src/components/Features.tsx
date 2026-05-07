import { motion } from 'framer-motion';
import TiltCard from './TiltCard';

/* Animated SVG health ring */
function HealthRing({ pct = 94 }: { pct?: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  return (
    <svg width="104" height="104" className="block flex-shrink-0">
      <defs>
        <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#89AACC" />
          <stop offset="100%" stopColor="#4E85BF" />
        </linearGradient>
      </defs>
      <circle cx="52" cy="52" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
      <circle
        cx="52" cy="52" r={r} fill="none"
        stroke="url(#rg)" strokeWidth="7"
        strokeDasharray={circ}
        strokeDashoffset={circ - (pct / 100) * circ}
        strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '52px 52px', transition: 'stroke-dashoffset 1.6s ease' }}
      />
      <text x="52" y="57" textAnchor="middle" fill="white"
        fontFamily="Inter,sans-serif" fontSize="15" fontWeight="600">{pct}%</text>
    </svg>
  );
}

const CTYPES = ['DualSense', 'DS4', 'Xbox Elite', 'Xbox One', 'Switch Pro', '8BitDo'];

export default function Features() {
  return (
    <section id="features" className="bg-bg py-20 md:py-28">
      <div className="max-w-[1160px] mx-auto px-6 md:px-10 lg:px-16">

        {/* Section header */}
        <motion.div
          className="mb-12 md:mb-16"
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        >
          {(['hidden', 'show'] as const).map(() => null)}
          <motion.div
            className="flex items-center gap-3 mb-4"
            variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25,0.1,0.25,1] as const } } }}
          >
            <div className="w-7 h-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
            <span className="text-[11px] text-dim uppercase tracking-[0.32em] font-sans">Engineering</span>
          </motion.div>
          <motion.h2
            className="font-display text-4xl md:text-5xl lg:text-6xl text-fg leading-tight mb-3"
            variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1, ease: [0.25,0.1,0.25,1] as const } } }}
          >
            Engineered{' '}<em className="font-display italic text-fg/60">Performance</em>
          </motion.h2>
          <motion.p
            className="text-sm md:text-base text-dim max-w-sm font-sans"
            variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2, ease: [0.25,0.1,0.25,1] as const } } }}
          >
            Every feature is built around the milliseconds that separate good from great.
          </motion.p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5" style={{ perspective: '1400px' }}>

          {/* Hardware Integrity — wide */}
          <TiltCard
            className="md:col-span-7 rounded-3xl p-8 md:p-10 glass glass-hover relative overflow-hidden group"
            intensity={8}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            {/* Corner glow */}
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(78,133,191,0.12) 0%, transparent 70%)' }} />

            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-[10px] text-dim uppercase tracking-[0.3em] font-sans mb-2">01</p>
                <h3 className="text-xl md:text-2xl font-sans font-light uppercase tracking-widest text-fg">
                  Hardware Integrity
                </h3>
                <h3 className="text-xl md:text-2xl font-sans font-light uppercase tracking-widest text-fg">
                  Audit
                </h3>
              </div>
              <div className="opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                style={{ transform: 'translateZ(30px)' }}>
                <HealthRing pct={94} />
              </div>
            </div>

            <p className="text-dim text-sm md:text-base font-sans leading-relaxed max-w-sm">
              Quantitative component health diagnostic. Detect mechanical wear and sensor fatigue before it impacts your performance.
            </p>

            <div className="mt-7 space-y-3">
              {[['Stick Drift', '97%'], ['Trigger Depth', '92%'], ['Button Latency', '98%']].map(([label, val]) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-[11px] text-dim font-sans w-28 shrink-0">{label}</span>
                  <div className="flex-1 h-[3px] rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full"
                      style={{ width: val, background: 'linear-gradient(90deg,#89AACC,#4E85BF)', boxShadow: '0 0 8px rgba(137,170,204,0.3)' }} />
                  </div>
                  <span className="text-[11px] text-fg/60 font-sans w-9 text-right">{val}</span>
                </div>
              ))}
            </div>
          </TiltCard>

          {/* Universal Peripheral Stack — narrow */}
          <TiltCard
            className="md:col-span-5 rounded-3xl p-8 md:p-10 glass glass-hover relative overflow-hidden"
            intensity={8}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(137,170,204,0.08) 0%, transparent 70%)' }} />

            <p className="text-[10px] text-dim uppercase tracking-[0.3em] font-sans mb-2">02</p>
            <h3 className="text-xl md:text-2xl font-sans font-light uppercase tracking-widest text-fg mb-1">Universal</h3>
            <h3 className="text-xl md:text-2xl font-sans font-light uppercase tracking-widest text-fg mb-6">Peripheral Stack</h3>

            <div className="flex flex-wrap gap-2 mb-7">
              {CTYPES.map(t => (
                <span key={t}
                  className="text-[11px] font-sans px-3 py-1.5 rounded-full border border-stroke text-dim hover:border-[rgba(137,170,204,0.4)] hover:text-fg/80 transition-all duration-200 cursor-default"
                  style={{ transform: 'translateZ(8px)' }}>
                  {t}
                </span>
              ))}
            </div>

            <p className="text-dim text-sm md:text-base font-sans leading-relaxed">
              Deep native support for DualSense, DS4, Switch Pro, and Joycon peripherals with advanced haptic and gyro mapping.
            </p>
          </TiltCard>

          {/* Intel card — full width */}
          <TiltCard
            className="md:col-span-12 rounded-3xl p-10 md:p-14 relative overflow-hidden"
            intensity={4}
            glowStrength={0.3}
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' } as React.CSSProperties}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 55% 75% at 50% 50%, rgba(78,133,191,0.04) 0%, transparent 70%)' }} />
            <div className="relative text-center max-w-2xl mx-auto" style={{ transform: 'translateZ(20px)' }}>
              <p className="text-[11px] text-dim uppercase tracking-[0.35em] font-sans mb-5">
                Primers Corperation Intelligence
              </p>
              <p className="font-display italic text-fg/80 leading-snug"
                style={{
                  fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
                  textShadow: '0 2px 12px rgba(78,133,191,0.15)',
                }}>
                "Our mission is to bridge the gap between human intent and digital execution."
              </p>
              <p className="mt-5 text-sm text-dim font-sans leading-relaxed max-w-xl mx-auto">
                Primora is built on the foundations of the open-source community, with a focused evolution toward modern hardware synergy.
              </p>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}

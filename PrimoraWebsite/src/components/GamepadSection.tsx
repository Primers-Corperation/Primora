import { useRef } from 'react';
import { motion } from 'framer-motion';
import GamepadScene from './GamepadScene';

const SPECS = [
  { label: 'Input Latency',   value: '0.8ms',   unit: '' },
  { label: 'Poll Rate',       value: '1000',     unit: 'Hz' },
  { label: 'Haptic Channels', value: '2',        unit: 'Dual' },
  { label: 'Trigger Zones',   value: '8',        unit: 'Zones' },
];

export default function GamepadSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="gamepad"
      className="relative bg-bg overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* Ambient gradient backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            'radial-gradient(ellipse 70% 55% at 60% 40%, rgba(78,133,191,0.06) 0%, transparent 65%)',
            'radial-gradient(ellipse 40% 60% at 20% 70%, rgba(137,170,204,0.03) 0%, transparent 60%)',
          ].join(', '),
        }}
      />

      {/* Horizontal rule top */}
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />

      <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-0 min-h-screen items-center py-24 md:py-32">

          {/* ── Left: copy & specs ── */}
          <div className="z-10 flex flex-col gap-8 lg:pr-12">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
                <span className="text-[11px] text-dim uppercase tracking-[0.32em] font-sans">
                  The Instrument
                </span>
              </div>

              <h2
                className="font-display leading-[1.04] mb-5"
                style={{
                  fontSize: 'clamp(3rem, 5.5vw, 5.2rem)',
                  textShadow: [
                    '0 1px 0 rgba(78,133,191,0.3)',
                    '0 3px 0 rgba(78,133,191,0.18)',
                    '0 6px 0 rgba(78,133,191,0.1)',
                    '0 12px 30px rgba(78,133,191,0.07)',
                  ].join(', '),
                }}
              >
                Your Controller.{' '}
                <em className="font-display italic" style={{ color: 'rgba(137,170,204,0.7)' }}>
                  Reimagined.
                </em>
              </h2>

              <p className="text-sm md:text-base text-dim font-sans leading-relaxed max-w-md">
                Primora transforms raw hardware signals into precision-calibrated input streams. Every axis,
                trigger, and haptic motor is profiled, monitored, and optimized in real time.
              </p>
            </motion.div>

            {/* Specs grid */}
            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {SPECS.map(({ label, value, unit }) => (
                <div
                  key={label}
                  className="rounded-2xl p-5 flex flex-col gap-1"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="flex items-baseline gap-1">
                    <span
                      className="font-display leading-none accent-gradient-text"
                      style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}
                    >
                      {value}
                    </span>
                    {unit && (
                      <span className="text-xs text-dim font-sans">{unit}</span>
                    )}
                  </div>
                  <span className="text-[11px] text-dim uppercase tracking-widest font-sans">{label}</span>
                </div>
              ))}
            </motion.div>

            {/* Feature list */}
            <motion.ul
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {[
                'Real-time drift detection and auto-correction',
                'Adaptive trigger resistance profiling',
                'Haptic signature mapping per game action',
                'Hardware integrity scoring on every boot',
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm font-sans text-dim">
                  <span
                    className="w-1 h-1 rounded-full flex-shrink-0"
                    style={{ background: 'linear-gradient(90deg, #89AACC, #4E85BF)' }}
                  />
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* ── Right: 3D Scene ── */}
          <motion.div
            className="relative"
            style={{ height: 'clamp(480px, 62vh, 760px)' }}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <GamepadScene />

            {/* "Drag to rotate" hint */}
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 select-none pointer-events-none"
              style={{ opacity: 0.35 }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1" className="text-dim" />
                <path d="M7 4v3l2 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-dim" />
              </svg>
              <span className="text-[10px] text-dim font-sans uppercase tracking-[0.3em]">Move cursor to rotate</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
    </section>
  );
}

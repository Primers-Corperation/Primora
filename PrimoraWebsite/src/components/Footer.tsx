import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const MARQUEE_TEXT = 'ABSOLUTE PRECISION • RE-ENGINEERED • PRIMORA v2.0.0 • ';

export default function Footer() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        xPercent: -50,
        duration: 38,
        ease: 'none',
        repeat: -1,
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <footer id="credits" className="bg-bg pt-20 md:pt-24 pb-10 md:pb-14 overflow-hidden">

      {/* Marquee */}
      <div className="relative overflow-hidden mb-16 md:mb-20">
        <div ref={marqueeRef} className="whitespace-nowrap inline-flex">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="font-display italic text-fg/[0.07]"
              style={{ fontSize: 'clamp(3rem,9vw,7rem)', letterSpacing: '-0.02em', paddingRight: '2rem' }}
            >
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-[1160px] mx-auto px-6 md:px-10 lg:px-16">

        {/* CTA row */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div>
            <p className="text-[11px] text-dim uppercase tracking-[0.35em] font-sans mb-2">Get Started</p>
            <h2 className="font-display text-3xl md:text-5xl text-fg leading-tight">
              Download & <em className="italic text-fg/60">Elevate</em>
            </h2>
          </div>

          <div className="flex gap-4 flex-wrap justify-center md:justify-end">
            <div className="relative group">
              <div
                className="absolute inset-[-1px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(90deg,#89AACC,#4E85BF)' }}
              />
              <a
                href="/download"
                className="relative block rounded-full px-7 py-3.5 text-sm font-sans font-medium text-fg border border-stroke bg-bg transition-colors duration-200"
              >
                Download v2.0.0 ↗
              </a>
            </div>
            <a
              href="mailto:primerscorperation@gmail.com"
              className="rounded-full px-7 py-3.5 text-sm font-sans font-medium text-dim hover:text-fg border border-stroke hover:border-fg/20 transition-all duration-200"
            >
              primerscorperation@gmail.com
            </a>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="w-full h-px mb-8" style={{ background: 'rgba(255,255,255,0.06)' }} />

        {/* Bottom bar */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="text-center sm:text-left">
            <p className="font-display italic text-fg/80 text-lg tracking-tight">Primora</p>
            <p className="text-xs text-dim font-sans mt-0.5">
              © 2026 Primers Corperation. All Rights Reserved.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: '#4ade80',
                boxShadow: '0 0 8px rgba(74,222,128,0.6)',
                animation: 'glow-pulse 2.2s ease-in-out infinite',
              }}
            />
            <span className="text-xs text-dim font-sans">Available for projects</span>
          </div>
        </motion.div>

        {/* Credits */}
        <motion.p
          className="text-xs text-dim/60 font-sans mt-6 text-center sm:text-left leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Built with respect for the original open-source visionaries including Ryochan7, Jays2Kings,
          and the global DS4Windows community.
        </motion.p>
      </div>
    </footer>
  );
}

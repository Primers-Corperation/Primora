import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import HeroScene from './HeroScene';

const ROLES = ['Precise.', 'Powerful.', 'Advanced.', 'Unstoppable.'];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setRoleIndex(i => (i + 1) % ROLES.length), 2600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 0.08 })
        .fromTo(eyebrowRef.current,
          { opacity: 0, y: 18, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'power3.out' }
        )
        .fromTo(headRef.current,
          { opacity: 0, y: 80, skewY: 2 },
          { opacity: 1, y: 0, skewY: 0, duration: 1.2, ease: 'power4.out' }, '-=0.6'
        )
        .fromTo(subRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.65'
        )
        .fromTo(ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6'
        )
        .fromTo(scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.7 }, '-=0.3'
        );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden bg-bg">

      {/* ── Full-bleed Three.js ── */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      {/* Depth halos */}
      <div className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: [
            'radial-gradient(ellipse 65% 55% at 50% 42%, rgba(78,133,191,0.07) 0%, transparent 68%)',
            'radial-gradient(ellipse 40% 35% at 75% 25%, rgba(137,170,204,0.04) 0%, transparent 55%)',
            'radial-gradient(ellipse 35% 40% at 20% 75%, rgba(78,133,191,0.03) 0%, transparent 55%)',
          ].join(', '),
        }}
      />

      {/* Horizontal scan line */}
      <div className="absolute left-0 right-0 h-px pointer-events-none z-[2]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(137,170,204,0.14) 25%, rgba(137,170,204,0.14) 75%, transparent 100%)',
          animation: 'scan-line 18s linear infinite',
        }}
      />

      {/* Bottom bleed into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none z-[2]"
        style={{ background: 'linear-gradient(to top, hsl(0 0% 4%) 0%, transparent 100%)' }} />

      {/* ── Main content ── */}
      <div
        className="flex-1 flex flex-col items-center justify-center text-center z-10 relative px-6"
        style={{ paddingTop: 'clamp(6rem, 14vh, 9rem)', paddingBottom: 'clamp(6rem, 12vh, 8rem)' }}
      >
        {/* Eyebrow */}
        <p
          ref={eyebrowRef}
          className="text-[10px] text-dim uppercase tracking-[0.42em] mb-8 font-sans opacity-0"
        >
          COLLECTION '26 — PRIMORA V2.0.0
        </p>

        {/* ── Headline — pushed as big as the viewport allows ── */}
        <div ref={headRef} className="opacity-0 mb-7" style={{ perspective: '1400px' }}>
          <h1
            className="font-display italic leading-[0.86] tracking-tight"
            style={{
              fontSize: 'clamp(4.5rem, 14vw, 13rem)',
              textShadow: [
                '0 1px 0 rgba(78,133,191,0.28)',
                '0 3px 0 rgba(78,133,191,0.2)',
                '0 6px 0 rgba(78,133,191,0.13)',
                '0 10px 0 rgba(78,133,191,0.08)',
                '0 18px 0 rgba(78,133,191,0.04)',
                '0 6px 24px rgba(0,0,0,0.65)',
                '0 16px 48px rgba(78,133,191,0.1)',
              ].join(', '),
            }}
          >
            Absolute
          </h1>
          <h1
            className="font-display italic leading-[0.86] tracking-tight"
            style={{
              fontSize: 'clamp(4.5rem, 14vw, 13rem)',
              opacity: 0.68,
              textShadow: [
                '0 2px 0 rgba(78,133,191,0.18)',
                '0 6px 0 rgba(78,133,191,0.1)',
                '0 12px 30px rgba(0,0,0,0.5)',
              ].join(', '),
            }}
          >
            Precision.
          </h1>
        </div>

        {/* Cycling role tag */}
        <p className="text-sm md:text-base text-dim mb-4 font-sans">
          A{' '}
          <span
            key={roleIndex}
            className="font-display italic text-fg/90 inline-block animate-role-fade"
            style={{ animationFillMode: 'forwards' }}
          >
            {ROLES[roleIndex]}
          </span>
          {' '}software built for champions.
        </p>

        <p
          ref={subRef}
          className="text-sm md:text-[0.95rem] text-dim/85 max-w-[400px] mb-12 font-sans leading-relaxed opacity-0"
        >
          Primora v2.0.0 — Re-engineered from the ground up for peak performance.
          Every axis. Every trigger. Every millisecond.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex gap-4 flex-wrap justify-center opacity-0">
          <a
            href="#features"
            className="group relative rounded-full text-sm px-8 py-3.5 font-sans font-medium transition-all duration-300 hover:scale-[1.04]"
            data-cursor="Explore"
          >
            <span className="absolute inset-0 rounded-full"
              style={{ background: 'linear-gradient(90deg,#89AACC,#4E85BF)', opacity: 0.12 }} />
            <span className="absolute inset-[1px] rounded-full"
              style={{ background: 'hsl(0 0% 4%)', border: '1px solid rgba(137,170,204,0.3)' }} />
            <span className="relative text-fg group-hover:text-fg/90 transition-colors">Explore Features</span>
          </a>
          <a
            href="https://github.com/Primers-Corperation/Primora/releases/latest/download/Primora-2.0.0-Setup.exe"
            className="relative rounded-full text-sm px-8 py-3.5 font-sans font-medium text-bg transition-all duration-300 hover:scale-[1.04] hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #89AACC 0%, #4E85BF 55%, #3a70b0 100%)' }}
            data-cursor="↓"
          >
            Download v2.0.0
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-10 opacity-0">
        <span className="text-[9px] text-dim uppercase tracking-[0.3em] font-sans">Scroll</span>
        <div className="w-px h-10 overflow-hidden relative rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <div className="absolute top-0 left-0 w-full h-full animate-scroll-down"
            style={{ background: 'linear-gradient(180deg, #89AACC, #4E85BF)' }} />
        </div>
      </div>
    </section>
  );
}

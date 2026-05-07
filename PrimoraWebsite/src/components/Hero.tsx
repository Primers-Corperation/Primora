import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import HeroScene from './HeroScene';

const ROLES = ['Precise', 'Powerful', 'Advanced', 'Competitive'];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setRoleIndex(i => (i + 1) % ROLES.length), 2200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 0.05 })
        .fromTo(eyebrowRef.current,
          { opacity: 0, y: 22, filter: 'blur(8px)' },
          { opacity: 1, y: 0,  filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' }
        )
        .fromTo(titleRef.current,
          { opacity: 0, y: 55 },
          { opacity: 1, y: 0,  duration: 1.15, ease: 'power3.out' }, '-=0.55'
        )
        .fromTo(subRef.current,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0,  duration: 0.95, ease: 'power3.out' }, '-=0.65'
        )
        .fromTo(ctaRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0,  duration: 0.75, ease: 'power3.out' }, '-=0.6'
        );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden">

      {/* ── Three.js 3D scene ── */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      {/* Soft radial halos behind the crystal */}
      <div className="absolute inset-0 pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(78,133,191,0.06) 0%, transparent 70%)' }} />

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-52 pointer-events-none z-[2]"
        style={{ background: 'linear-gradient(to top, hsl(0 0% 4%) 0%, transparent 100%)' }} />

      {/* Scanner line */}
      <div
        className="absolute left-0 right-0 h-px pointer-events-none z-[2]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(137,170,204,0.1) 20%, rgba(137,170,204,0.1) 80%, transparent 100%)',
          animation: 'scan-line 14s linear infinite',
        }}
      />

      {/* ── Hero content ── */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-28 pb-24 z-10 relative"
        style={{ perspective: '1200px' }}>

        <p
          ref={eyebrowRef}
          className="text-[11px] text-dim uppercase tracking-[0.38em] mb-7 font-sans opacity-0"
        >
          COLLECTION '26 — PRIMORA v2.0.0
        </p>

        {/* 3D depth headline */}
        <h1
          ref={titleRef}
          className="font-display italic leading-[0.88] tracking-tight text-fg mb-5 opacity-0"
          style={{
            fontSize: 'clamp(3.8rem, 10vw, 9.5rem)',
            textShadow: [
              '0 1px 0 rgba(78,133,191,0.25)',
              '0 2px 0 rgba(78,133,191,0.2)',
              '0 3px 0 rgba(78,133,191,0.15)',
              '0 4px 0 rgba(78,133,191,0.1)',
              '0 5px 0 rgba(78,133,191,0.07)',
              '0 6px 18px rgba(0,0,0,0.6)',
              '0 12px 30px rgba(78,133,191,0.08)',
            ].join(', '),
          }}
        >
          Absolute<br />
          <span style={{ opacity: 0.72 }}>Precision.</span>
        </h1>

        {/* Cycling role */}
        <p className="text-sm md:text-base text-dim mb-4 font-sans">
          A{' '}
          <span
            key={roleIndex}
            className="font-display italic text-fg inline-block animate-role-fade"
            style={{ animationFillMode: 'forwards' }}
          >
            {ROLES[roleIndex]}
          </span>
          {' '}software built for champions.
        </p>

        <p
          ref={subRef}
          className="text-sm md:text-base text-dim max-w-[420px] mb-11 font-sans leading-relaxed opacity-0"
        >
          Primora v2.0.0 is here. Re-engineered for peak performance and a premium
          experience, giving you the ultimate competitive edge.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex gap-4 flex-wrap justify-center opacity-0">
          <a
            href="#features"
            className="group relative rounded-full text-sm px-7 py-3.5 font-sans font-medium transition-all duration-300 hover:scale-[1.05]"
          >
            <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(90deg,#89AACC,#4E85BF)' }} />
            <span className="absolute inset-[1.5px] rounded-full bg-bg" />
            <span className="relative text-fg">Explore Features</span>
          </a>
          <a
            href="https://github.com/Primers-Corperation/Primora/raw/main/Release_v2.0.0_LiquidGlass/Primora.exe"
            download
            className="rounded-full text-sm px-7 py-3.5 bg-fg text-bg font-sans font-medium transition-all duration-300 hover:scale-[1.05] hover:bg-fg/88"
          >
            Download v2.0.0
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-10">
        <span className="text-[10px] text-dim uppercase tracking-[0.25em] font-sans">Scroll</span>
        <div className="w-px h-9 overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="absolute top-0 left-0 w-full h-full animate-scroll-down"
            style={{ background: 'linear-gradient(90deg,#89AACC,#4E85BF)' }} />
        </div>
      </div>
    </section>
  );
}

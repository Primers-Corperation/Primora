import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Each group is one "beat" in the scroll story
const BEATS = [
  { words: ['YOUR', 'SETUP.'],                        italic: [false, true]  },
  { words: ['RE—ENGINEERED.'],                        italic: [true]          },
  { words: ['EVERY', 'MILLISECOND.', 'PERFECTED.'],   italic: [false, true, false] },
];


export default function ManifestoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef  = useRef<HTMLDivElement>(null);
  const beat0Ref   = useRef<HTMLDivElement>(null);
  const beat1Ref   = useRef<HTMLDivElement>(null);
  const beat2Ref   = useRef<HTMLDivElement>(null);
  const lineRefs   = [beat0Ref, beat1Ref, beat2Ref];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
        },
      });

      // Beat 0 — illuminate
      lineRefs[0].current && tl.to(
        lineRefs[0].current.querySelectorAll('.mc'),
        { opacity: 1, stagger: 0.025, duration: 0.25 },
        0
      );

      // Beat 1 — fade 0 out, illuminate 1
      lineRefs[0].current && tl.to(
        lineRefs[0].current.querySelectorAll('.mc'),
        { opacity: 0.06, duration: 0.15 },
        0.32
      );
      lineRefs[1].current && tl.to(
        lineRefs[1].current.querySelectorAll('.mc'),
        { opacity: 1, stagger: 0.03, duration: 0.25 },
        0.35
      );

      // Beat 2 — fade 1 out, illuminate 2
      lineRefs[1].current && tl.to(
        lineRefs[1].current.querySelectorAll('.mc'),
        { opacity: 0.06, duration: 0.15 },
        0.64
      );
      lineRefs[2].current && tl.to(
        lineRefs[2].current.querySelectorAll('.mc'),
        { opacity: 1, stagger: 0.02, duration: 0.25 },
        0.67
      );

      // Sub-label fade in with beat 2
      tl.to('.manifesto-sub', { opacity: 1, y: 0, duration: 0.2 }, 0.75);
    }, section);

    return () => ctx.revert();
  }, []);

  const renderBeat = (beatIdx: number, ref: React.RefObject<HTMLDivElement | null>) => {
    const { words, italic } = BEATS[beatIdx];
    return (
      <div ref={ref} className="flex flex-wrap justify-center leading-none">
        {words.map((word, wi) => (
          <span
            key={wi}
            className={`inline-block mr-[0.22em] ${italic[wi] ? 'font-display italic' : 'font-display'}`}
          >
            {word.split('').map((ch, ci) => (
              <span key={ci} className="mc inline-block" style={{ opacity: 0.065 }}>
                {ch}
              </span>
            ))}
          </span>
        ))}
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-bg"
      style={{ height: '420vh' }}
    >
      {/* Top fade */}
      <div className="absolute top-0 inset-x-0 h-32 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, hsl(0 0% 4%), transparent)' }} />

      {/* Sticky viewport */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(78,133,191,0.05) 0%, transparent 70%)',
              'radial-gradient(ellipse 30% 30% at 30% 60%, rgba(137,170,204,0.03) 0%, transparent 60%)',
            ].join(', '),
          }}
        />

        {/* Small eyebrow */}
        <p className="text-[10px] text-dim uppercase tracking-[0.4em] font-sans mb-10 z-10">
          Primora v2.0.0 — Manifesto
        </p>

        {/* The three beats, stacked */}
        <div
          className="z-10 text-center px-4"
          style={{ fontSize: 'clamp(3.8rem, 9.5vw, 10.5rem)' }}
        >
          <div className="mb-2">{renderBeat(0, beat0Ref)}</div>
          <div className="mb-2">{renderBeat(1, beat1Ref)}</div>
          <div>{renderBeat(2, beat2Ref)}</div>
        </div>

        {/* Sub label */}
        <p
          className="manifesto-sub mt-10 text-xs text-dim font-sans uppercase tracking-[0.35em] z-10"
          style={{ opacity: 0, transform: 'translateY(12px)' }}
        >
          Built on the foundations of open source
        </p>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to top, hsl(0 0% 4%), transparent)' }} />
    </section>
  );
}

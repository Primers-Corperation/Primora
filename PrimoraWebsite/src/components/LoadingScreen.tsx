import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WORDS = ['Precision', 'Performance', 'Control', 'Power'];

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const duration = 2700;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      setCount(Math.floor(eased * 100));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCount(100);
        setTimeout(onComplete, 500);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete]);

  useEffect(() => {
    const id = setInterval(() => setWordIndex(i => (i + 1) % WORDS.length), 900);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-bg flex flex-col overflow-hidden"
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* 3D perspective grid — recedes into the distance */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ perspective: '600px', perspectiveOrigin: '50% 0%' }}
      >
        <div
          className="absolute inset-x-0 bottom-0 opacity-[0.035]"
          style={{
            height: '80%',
            transform: 'rotateX(55deg)',
            transformOrigin: 'bottom center',
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
            backgroundSize: '70px 70px',
          }}
        />
      </div>

      {/* Radial glow behind the counter */}
      <div
        className="absolute bottom-0 right-0 w-[60vw] h-[60vh] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 80% 90%, rgba(78,133,191,0.06) 0%, transparent 65%)' }}
      />

      {/* Top bar */}
      <div className="flex justify-between items-center px-8 md:px-14 pt-8 md:pt-12 z-10">
        <motion.span
          className="text-xs text-dim uppercase tracking-[0.4em] font-sans"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Primora
        </motion.span>
        <motion.span
          className="text-xs text-dim uppercase tracking-[0.4em] font-sans"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          v2.0.0
        </motion.span>
      </div>

      {/* Cycling word */}
      <div className="flex-1 flex items-center justify-center z-10">
        <AnimatePresence mode="wait">
          <motion.p
            key={wordIndex}
            className="font-display italic text-fg/70 select-none"
            style={{
              fontSize: 'clamp(3.5rem, 9vw, 8rem)',
              lineHeight: 1,
              textShadow: [
                '0 2px 0 rgba(78,133,191,0.2)',
                '0 4px 0 rgba(78,133,191,0.12)',
                '0 8px 24px rgba(78,133,191,0.08)',
              ].join(', '),
            }}
            initial={{ opacity: 0, y: 28, rotateX: -15 }}
            animate={{ opacity: 1, y: 0,  rotateX: 0 }}
            exit={{ opacity: 0, y: -28, rotateX: 15 }}
            transition={{ duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {WORDS[wordIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Counter + progress */}
      <div className="px-8 md:px-14 pb-8 md:pb-12 z-10">
        <div className="flex justify-end mb-4">
          <motion.span
            className="font-display text-fg tabular-nums leading-none select-none"
            style={{
              fontSize: 'clamp(5rem, 15vw, 13rem)',
              textShadow: [
                '2px 2px 0 rgba(137,170,204,0.1)',
                '4px 4px 0 rgba(137,170,204,0.07)',
                '6px 6px 0 rgba(78,133,191,0.05)',
                '8px 8px 24px rgba(0,0,0,0.6)',
                '0 0 60px rgba(78,133,191,0.06)',
              ].join(', '),
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
          >
            {String(count).padStart(3, '0')}
          </motion.span>
        </div>

        <motion.div
          className="w-full h-[2px] rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.07)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <div
            className="h-full rounded-full transition-[width] duration-75"
            style={{
              width: `${count}%`,
              background: 'linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)',
              boxShadow: '0 0 12px rgba(137,170,204,0.45)',
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

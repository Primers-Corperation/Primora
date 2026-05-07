import { motion } from 'framer-motion';

const STATS = [
  { value: '20+',  label: 'Controllers',  sub: 'Supported' },
  { value: '95+',  label: 'Community',    sub: 'Profiles' },
  { value: '100%', label: 'Open Source',  sub: 'Foundation' },
];

export default function Stats() {
  return (
    <section className="bg-bg py-16 md:py-20">
      <div className="max-w-[1160px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stroke"
          style={{ perspective: '1000px' }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        >
          {STATS.map((s) => (
            <motion.div
              key={s.value}
              className="py-10 md:py-8 px-0 md:px-12 first:pl-0 last:pr-0 text-center md:text-left"
              variants={{
                hidden: { opacity: 0, y: 24, rotateX: -15 },
                show: {
                  opacity: 1, y: 0, rotateX: 0,
                  transition: { duration: 0.75, ease: [0.25, 0.1, 0.25, 1] as const },
                },
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <p
                className="font-display italic leading-none accent-gradient-text"
                style={{
                  fontSize: 'clamp(3.5rem, 7vw, 6rem)',
                  textShadow: [
                    '0 1px 0 rgba(78,133,191,0.25)',
                    '0 2px 0 rgba(78,133,191,0.18)',
                    '0 3px 0 rgba(78,133,191,0.12)',
                    '0 6px 20px rgba(78,133,191,0.1)',
                  ].join(', '),
                }}
              >
                {s.value}
              </p>
              <p className="mt-2 text-sm text-fg font-sans font-medium uppercase tracking-widest">{s.label}</p>
              <p className="text-xs text-dim font-sans mt-0.5 tracking-wide">{s.sub}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

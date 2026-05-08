import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Home',        href: '#home' },
  { label: 'Features',   href: '#features' },
  { label: 'Pricing',    href: '#pricing' },
  { label: 'Marketplace',href: '#marketplace' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('Home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-5 px-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div
        className={`
          inline-flex items-center gap-1 rounded-full border border-stroke
          bg-surface/80 backdrop-blur-xl px-2 py-2
          transition-all duration-300
          ${scrolled ? 'shadow-[0_8px_40px_rgba(0,0,0,0.6)]' : ''}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-3 mr-0.5">
          <div className="relative w-8 h-8 rounded-full p-[1.5px] flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #89AACC, #4E85BF)' }}>
            <div className="w-full h-full rounded-full bg-bg flex items-center justify-center overflow-hidden">
              <img src="/primora_icon.png" alt="Primora" className="w-5 h-5 object-contain" />
            </div>
          </div>
          <span className="font-display italic text-sm text-fg/90 hidden sm:block tracking-tight">
            Primora
          </span>
        </div>

        <div className="w-px h-4 bg-stroke/80 mx-1 hidden md:block" />

        {/* Nav links */}
        {NAV_LINKS.map(link => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setActive(link.label)}
            className={`
              text-xs sm:text-[13px] rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2
              transition-all duration-200 whitespace-nowrap font-sans
              ${active === link.label
                ? 'text-fg bg-stroke/70'
                : 'text-dim hover:text-fg hover:bg-stroke/40'
              }
            `}
          >
            {link.label}
          </a>
        ))}

        <div className="w-px h-4 bg-stroke/80 mx-1 hidden md:block" />

        {/* Download CTA */}
        <div className="relative group ml-0.5">
          <div
            className="absolute inset-[-1px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(90deg, #89AACC, #4E85BF)' }}
          />
          <a
            href="/download"
            className="relative block text-xs sm:text-[13px] rounded-full px-4 py-1.5 sm:py-2 text-fg bg-surface border border-stroke whitespace-nowrap font-sans transition-colors duration-200"
          >
            Download ↗
          </a>
        </div>
      </div>
    </motion.nav>
  );
}

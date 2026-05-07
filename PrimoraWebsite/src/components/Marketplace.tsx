import { useState } from 'react';
import { motion } from 'framer-motion';

const CONTROLLERS = ['All', 'DualSense', 'DualShock 4', 'Xbox Elite', 'Xbox One', '8BitDo'];

const PROFILES = [
  { id: '1', creator: 'ProPlayer_KZ',   name: 'Warzone Zero Recoil',      type: 'DualSense',    price: 2.99, downloads: 1420 },
  { id: '2', creator: 'AimLab_Ghost',   name: 'Apex Legends Precision',   type: 'Xbox Elite',   price: 1.99, downloads: 987  },
  { id: '3', creator: 'NeuralDrifter',  name: 'Elden Ring Liquid Motion', type: 'DualShock 4',  price: 0,    downloads: 3201 },
  { id: '4', creator: 'TacticalEdge',   name: 'Ranked Grind v3',          type: 'DualSense',    price: 3.99, downloads: 654  },
  { id: '5', creator: 'SilkStick',      name: 'FPS Universal Response',   type: 'Xbox One',     price: 0,    downloads: 2108 },
  { id: '6', creator: 'ProPlayer_KZ',   name: 'Warzone Sniper Tune',      type: 'DualSense',    price: 1.99, downloads: 876  },
];

const TYPE_COLORS: Record<string, string> = {
  'DualSense':   'rgba(137,170,204,0.15)',
  'DualShock 4': 'rgba(100,160,220,0.15)',
  'Xbox Elite':  'rgba(0,180,60,0.12)',
  'Xbox One':    'rgba(0,140,40,0.1)',
  '8BitDo':      'rgba(200,80,80,0.12)',
};

export default function Marketplace() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = PROFILES.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || p.creator.toLowerCase().includes(q);
    const matchFilter = filter === 'All' || p.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <section id="marketplace" className="bg-bg py-20 md:py-28">
      <div className="max-w-[1160px] mx-auto px-6 md:px-10 lg:px-16">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-7 h-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
            <span className="text-[11px] text-dim uppercase tracking-[0.32em] font-sans">Community</span>
            <div className="w-7 h-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-fg leading-tight">
            Profile{' '}
            <em className="font-display italic text-fg/60">Marketplace</em>
          </h2>
          <p className="mt-3 text-sm text-dim font-sans max-w-xs mx-auto">
            Download pro-tuned configs. Publish your own. Earn from your edge.
          </p>
        </motion.div>

        {/* Search + filter */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-10 items-center justify-center flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <input
            type="text"
            placeholder="Search profiles or creators…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="font-sans text-sm text-fg placeholder-dim rounded-full px-5 py-2.5 outline-none transition-all duration-200 w-full sm:w-72"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
            }}
            onFocus={e => (e.target.style.borderColor = 'rgba(137,170,204,0.4)')}
            onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.09)')}
          />
          <div className="flex gap-2 flex-wrap justify-center">
            {CONTROLLERS.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className="text-[11px] font-sans rounded-full px-3.5 py-1.5 transition-all duration-200"
                style={{
                  border: filter === c
                    ? '1px solid rgba(137,170,204,0.5)'
                    : '1px solid rgba(255,255,255,0.1)',
                  background: filter === c ? 'rgba(137,170,204,0.1)' : 'transparent',
                  color:   filter === c ? '#d0e0f0' : 'rgba(255,255,255,0.45)',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Profile cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              className="group rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              whileHover={{
                borderColor: 'rgba(137,170,204,0.3)',
                background: 'rgba(255,255,255,0.05)',
              }}
            >
              <div className="flex items-start justify-between">
                <span
                  className="text-[10px] font-sans px-2.5 py-1 rounded-full"
                  style={{
                    background: TYPE_COLORS[p.type] ?? 'rgba(255,255,255,0.08)',
                    color: 'rgba(200,220,240,0.85)',
                  }}
                >
                  {p.type}
                </span>
                <span
                  className="text-sm font-sans font-semibold"
                  style={{ color: p.price === 0 ? '#6ee7b7' : '#e2e8f0' }}
                >
                  {p.price === 0 ? 'Free' : `$${p.price.toFixed(2)}`}
                </span>
              </div>

              <div>
                <p className="text-fg text-sm font-sans font-medium leading-snug">{p.name}</p>
                <p className="text-dim text-xs font-sans mt-1">by {p.creator}</p>
              </div>

              <div
                className="flex items-center justify-between pt-3"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="text-[11px] font-sans text-dim/70">
                  ↓ {p.downloads.toLocaleString()}
                </span>
                <button
                  className="text-xs font-sans rounded-full px-4 py-1.5 transition-all duration-200 hover:scale-[1.04]"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#e2e8f0',
                  }}
                >
                  {p.price === 0 ? 'Download' : 'Buy'}
                </button>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-dim font-sans text-sm">
              No profiles match your search.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

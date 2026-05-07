import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  sub: string;
  type: 'input' | 'core' | 'output';
  pulseOffset: number;
}

interface Edge {
  from: string;
  to: string;
}

interface Particle {
  edgeIndex: number;
  t: number;       // 0–1 along the edge
  speed: number;
  size: number;
  opacity: number;
}

// ── Layout constants ──────────────────────────────────────────────────────────
const NODES: Node[] = [
  // Inputs (left column)
  { id: 'l-stick',   x: 0.08, y: 0.18, label: 'L-Stick',     sub: 'Axis Input',      type: 'input',  pulseOffset: 0.0 },
  { id: 'r-stick',   x: 0.08, y: 0.42, label: 'R-Stick',     sub: 'Axis Input',      type: 'input',  pulseOffset: 0.4 },
  { id: 'l-trigger', x: 0.08, y: 0.62, label: 'L-Trigger',   sub: 'Analog Depth',    type: 'input',  pulseOffset: 0.8 },
  { id: 'r-trigger', x: 0.08, y: 0.82, label: 'R-Trigger',   sub: 'Analog Depth',    type: 'input',  pulseOffset: 1.2 },
  // Cores (center column)
  { id: 'core-a',   x: 0.42, y: 0.20, label: 'Drift Guard',  sub: 'Dead-zone AI',    type: 'core',   pulseOffset: 0.3 },
  { id: 'core-b',   x: 0.42, y: 0.42, label: 'Neuro Map',    sub: 'Profile Engine',  type: 'core',   pulseOffset: 0.7 },
  { id: 'core-c',   x: 0.42, y: 0.62, label: 'Latency Core', sub: 'Sub-ms Pipeline', type: 'core',   pulseOffset: 1.1 },
  { id: 'core-d',   x: 0.42, y: 0.80, label: 'Haptic Forge', sub: 'Waveform Synth',  type: 'core',   pulseOffset: 1.5 },
  // Outputs (right column)
  { id: 'out-profile', x: 0.88, y: 0.22, label: 'Profile Apply',   sub: 'Instant Load',     type: 'output', pulseOffset: 0.5 },
  { id: 'out-latency', x: 0.88, y: 0.44, label: 'Input Stream',    sub: '0.8ms Feed',       type: 'output', pulseOffset: 0.9 },
  { id: 'out-haptic',  x: 0.88, y: 0.64, label: 'Haptic Response', sub: 'Dual Actuators',   type: 'output', pulseOffset: 1.3 },
  { id: 'out-health',  x: 0.88, y: 0.82, label: 'Health Report',   sub: 'Live Score',       type: 'output', pulseOffset: 1.7 },
];

const EDGES: Edge[] = [
  { from: 'l-stick',   to: 'core-a'  },
  { from: 'l-stick',   to: 'core-b'  },
  { from: 'r-stick',   to: 'core-b'  },
  { from: 'r-stick',   to: 'core-c'  },
  { from: 'l-trigger', to: 'core-c'  },
  { from: 'l-trigger', to: 'core-d'  },
  { from: 'r-trigger', to: 'core-d'  },
  { from: 'r-trigger', to: 'core-b'  },
  { from: 'core-a',   to: 'out-profile' },
  { from: 'core-b',   to: 'out-profile' },
  { from: 'core-b',   to: 'out-latency' },
  { from: 'core-c',   to: 'out-latency' },
  { from: 'core-c',   to: 'out-haptic'  },
  { from: 'core-d',   to: 'out-haptic'  },
  { from: 'core-d',   to: 'out-health'  },
  { from: 'core-a',   to: 'out-health'  },
];

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

// Bezier point on a quadratic curve
function bezierPoint(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, t: number) {
  const mt = 1 - t;
  return {
    x: mt * mt * x0 + 2 * mt * t * cx + t * t * x1,
    y: mt * mt * y0 + 2 * mt * t * cy + t * t * y1,
  };
}

export default function NeuralSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Particles
    const particles: Particle[] = [];
    for (let i = 0; i < EDGES.length * 4; i++) {
      particles.push({
        edgeIndex: i % EDGES.length,
        t: Math.random(),
        speed: 0.0014 + Math.random() * 0.0012,
        size: 1.5 + Math.random() * 2,
        opacity: 0.5 + Math.random() * 0.5,
      });
    }

    let rafId: number;
    let time = 0;

    const getNodeById = (id: string) => NODES.find(n => n.id === id)!;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      time += 0.012;

      const px = (n: Node) => n.x * W;
      const py = (n: Node) => n.y * H;

      // ── Draw edges ────────────────────────────────────────────────────────
      EDGES.forEach(({ from, to }) => {
        const nf = getNodeById(from);
        const nt = getNodeById(to);
        const x0 = px(nf), y0 = py(nf), x1 = px(nt), y1 = py(nt);
        const cx = lerp(x0, x1, 0.5);
        const cy = lerp(y0, y1, 0.5) + (Math.random() < 0.5 ? 0 : 0); // straight for now

        const grad = ctx.createLinearGradient(x0, y0, x1, y1);
        grad.addColorStop(0, 'rgba(78,133,191,0.12)');
        grad.addColorStop(0.5, 'rgba(137,170,204,0.18)');
        grad.addColorStop(1, 'rgba(78,133,191,0.12)');

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.quadraticCurveTo(cx, cy, x1, y1);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // ── Draw particles ─────────────────────────────────────────────────────
      particles.forEach(p => {
        p.t += p.speed;
        if (p.t > 1) p.t -= 1;

        const edge = EDGES[p.edgeIndex];
        const nf = getNodeById(edge.from);
        const nt = getNodeById(edge.to);
        const x0 = px(nf), y0 = py(nf), x1 = px(nt), y1 = py(nt);
        const cx = lerp(x0, x1, 0.5);
        const cy = lerp(y0, y1, 0.5);

        const pt = bezierPoint(x0, y0, cx, cy, x1, y1, p.t);

        // Glow
        const grd = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, p.size * 3);
        grd.addColorStop(0, `rgba(137,170,204,${p.opacity * 0.9})`);
        grd.addColorStop(0.4, `rgba(78,133,191,${p.opacity * 0.4})`);
        grd.addColorStop(1, 'rgba(78,133,191,0)');
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, p.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,235,255,${p.opacity})`;
        ctx.fill();
      });

      // ── Draw nodes ────────────────────────────────────────────────────────
      NODES.forEach(n => {
        const x = px(n), y = py(n);
        const pulse = 0.55 + 0.45 * Math.sin(time * 1.8 + n.pulseOffset);
        const outerR = n.type === 'core' ? 13 : 9;
        const innerR = n.type === 'core' ? 6 : 4;

        // Outer glow halo
        const haloR = outerR + 10 + pulse * 8;
        const halo = ctx.createRadialGradient(x, y, outerR * 0.5, x, y, haloR);
        if (n.type === 'core') {
          halo.addColorStop(0, `rgba(78,133,191,${0.18 + pulse * 0.12})`);
        } else if (n.type === 'input') {
          halo.addColorStop(0, `rgba(137,170,204,${0.12 + pulse * 0.08})`);
        } else {
          halo.addColorStop(0, `rgba(100,200,255,${0.12 + pulse * 0.08})`);
        }
        halo.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(x, y, haloR, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        // Outer ring
        ctx.beginPath();
        ctx.arc(x, y, outerR, 0, Math.PI * 2);
        if (n.type === 'core') {
          ctx.strokeStyle = `rgba(137,170,204,${0.5 + pulse * 0.3})`;
          ctx.lineWidth = 1.5;
        } else {
          ctx.strokeStyle = `rgba(89,140,191,${0.35 + pulse * 0.2})`;
          ctx.lineWidth = 1;
        }
        ctx.stroke();

        // Inner fill
        const innerGrad = ctx.createRadialGradient(x, y, 0, x, y, innerR * 1.5);
        if (n.type === 'core') {
          innerGrad.addColorStop(0, `rgba(137,170,204,${0.7 + pulse * 0.3})`);
          innerGrad.addColorStop(1, `rgba(78,133,191,0.4)`);
        } else if (n.type === 'input') {
          innerGrad.addColorStop(0, `rgba(100,160,220,${0.6 + pulse * 0.3})`);
          innerGrad.addColorStop(1, `rgba(60,110,180,0.3)`);
        } else {
          innerGrad.addColorStop(0, `rgba(80,200,220,${0.6 + pulse * 0.3})`);
          innerGrad.addColorStop(1, `rgba(40,150,180,0.3)`);
        }
        ctx.beginPath();
        ctx.arc(x, y, innerR, 0, Math.PI * 2);
        ctx.fillStyle = innerGrad;
        ctx.fill();

        // Label (node text handled via HTML overlay, skip here for crisp rendering)
      });

      rafId = requestAnimationFrame(draw);
    };

    const resize = () => {
      const r = container.getBoundingClientRect();
      canvas.width  = r.width;
      canvas.height = r.height;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <section className="relative bg-bg py-20 md:py-28 overflow-hidden">
      {/* Subtle top/bottom rules */}
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />

      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(78,133,191,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[1160px] mx-auto px-6 md:px-10 lg:px-16">

        {/* Header */}
        <motion.div
          className="text-center mb-14 md:mb-18"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-7 h-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
            <span className="text-[11px] text-dim uppercase tracking-[0.32em] font-sans">Signal Architecture</span>
            <div className="w-7 h-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
          </div>
          <h2
            className="font-display leading-tight mb-3"
            style={{
              fontSize: 'clamp(2.6rem, 5vw, 4.5rem)',
              textShadow: '0 4px 20px rgba(78,133,191,0.1)',
            }}
          >
            Inputs become{' '}
            <em className="font-display italic accent-gradient-text">Instinct</em>
          </h2>
          <p className="text-sm text-dim font-sans max-w-md mx-auto">
            Every signal your controller sends flows through Primora's Neuro-Kinetic pipeline —
            cleaned, profiled, and delivered in under a millisecond.
          </p>
        </motion.div>

        {/* Canvas + node labels */}
        <motion.div
          className="relative rounded-3xl overflow-hidden"
          style={{
            height: 'clamp(340px, 52vh, 560px)',
            background: 'rgba(255,255,255,0.018)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div ref={containerRef} className="absolute inset-0">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          </div>

          {/* Node labels (HTML overlay) */}
          {NODES.map(n => (
            <div
              key={n.id}
              className="absolute pointer-events-none select-none"
              style={{
                left: `${n.x * 100}%`,
                top: `${n.y * 100}%`,
                transform: n.type === 'input'
                  ? 'translate(16px, -50%)'
                  : n.type === 'output'
                    ? 'translate(calc(-100% - 16px), -50%)'
                    : 'translate(-50%, 22px)',
              }}
            >
              <p className="text-[10px] font-sans font-medium text-fg/70 leading-none whitespace-nowrap">
                {n.label}
              </p>
              <p className="text-[9px] font-sans text-dim leading-none mt-0.5 whitespace-nowrap">
                {n.sub}
              </p>
            </div>
          ))}

          {/* Column headers */}
          {[
            { label: 'INPUT',    x: '8%'   },
            { label: 'PROCESS',  x: '42%'  },
            { label: 'OUTPUT',   x: '88%'  },
          ].map(({ label, x }) => (
            <div
              key={label}
              className="absolute top-4 pointer-events-none select-none"
              style={{ left: x, transform: 'translateX(-50%)' }}
            >
              <span className="text-[9px] font-sans uppercase tracking-[0.3em] text-dim/50">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Bottom stat pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {[
            { v: '0.8ms',  l: 'Signal Latency'  },
            { v: '4',      l: 'Processing Cores' },
            { v: '12',     l: 'Active Pathways'  },
            { v: '100%',   l: 'Real-Time'        },
          ].map(({ v, l }) => (
            <div
              key={l}
              className="flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-sans"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <span className="accent-gradient-text font-medium">{v}</span>
              <span className="text-dim">{l}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
    </section>
  );
}

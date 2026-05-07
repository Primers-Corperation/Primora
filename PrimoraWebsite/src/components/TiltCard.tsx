import { useRef, type ReactNode, type CSSProperties } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionProps } from 'framer-motion';

interface TiltCardProps extends MotionProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** How many degrees max to rotate (default 10) */
  intensity?: number;
  /** Extra inner glow intensity 0-1 (default 0.5) */
  glowStrength?: number;
}

export default function TiltCard({
  children,
  className = '',
  style = {},
  intensity = 10,
  glowStrength = 0.5,
  ...motionProps
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Normalised cursor position  0→1 per axis
  const cursorX = useMotionValue(0.5);
  const cursorY = useMotionValue(0.5);

  // Map cursor to rotation with spring smoothing
  const rawRotY = useTransform(cursorX, [0, 1], [-intensity,  intensity]);
  const rawRotX = useTransform(cursorY, [0, 1], [ intensity, -intensity]);

  const rotateY = useSpring(rawRotY, { stiffness: 280, damping: 32 });
  const rotateX = useSpring(rawRotX, { stiffness: 280, damping: 32 });

  // Specular highlight follows cursor
  const shineX = useTransform(cursorX, [0, 1], [0, 100]);
  const shineY = useTransform(cursorY, [0, 1], [0, 100]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    cursorX.set((e.clientX - rect.left) / rect.width);
    cursorY.set((e.clientY - rect.top)  / rect.height);
  };

  const handleLeave = () => {
    cursorX.set(0.5);
    cursorY.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        ...style,
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...motionProps}
    >
      {/* Dynamic specular highlight */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-20"
        style={{
          background: useTransform(
            [shineX, shineY],
            ([x, y]) =>
              `radial-gradient(circle at ${x}% ${y}%, rgba(137,170,204,${glowStrength * 0.22}) 0%, transparent 60%)`,
          ),
        }}
      />
      {children}
    </motion.div>
  );
}

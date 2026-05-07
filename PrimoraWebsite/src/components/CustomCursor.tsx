import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    const text = textRef.current;
    if (!dot || !ring || !text) return;

    let mx = -200, my = -200;
    let rx = -200, ry = -200;
    let hovering = false;
    let clicking = false;
    let cursorText = '';
    let targetScale = 1;
    let scale = 1;
    let rafId: number;

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onDown = () => { clicking = true; };
    const onUp   = () => { clicking = false; };

    // Register hover targets
    const setup = () => {
      document.querySelectorAll<HTMLElement>('a, button, [data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', () => {
          hovering = true;
          cursorText = el.dataset.cursor ?? '';
          text.textContent = cursorText;
        });
        el.addEventListener('mouseleave', () => {
          hovering = false;
          cursorText = '';
          text.textContent = '';
        });
      });
    };

    // Run after DOM settles
    const setupId = setTimeout(setup, 600);

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup',   onUp);

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      rx += (mx - rx) * 0.09;
      ry += (my - ry) * 0.09;

      targetScale = clicking ? 0.65 : hovering ? 2.0 : 1;
      scale += (targetScale - scale) * 0.14;

      dot.style.transform  = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%) scale(${scale})`;
      ring.style.opacity   = hovering ? '0.5' : '0.85';
      text.style.transform = `translate(${rx + 22}px,${ry - 10}px)`;
      text.style.opacity   = cursorText ? '1' : '0';
    };
    animate();

    return () => {
      clearTimeout(setupId);
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup',   onUp);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />
      <div ref={textRef} className="cursor-text" />
    </>
  );
}

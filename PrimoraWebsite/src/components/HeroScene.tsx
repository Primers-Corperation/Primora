import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* ── Renderer ─────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    Object.assign(renderer.domElement.style, {
      position: 'absolute', inset: '0',
      width: '100%', height: '100%',
      pointerEvents: 'none',
    });
    mount.appendChild(renderer.domElement);

    /* ── Scene / Camera ───────────────────────────────────── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 10);

    /* ── Geometry ─────────────────────────────────────────── */
    const icoGeo     = new THREE.IcosahedronGeometry(2.8, 1);
    const edgesGeo   = new THREE.EdgesGeometry(icoGeo);
    const outerGeo   = new THREE.IcosahedronGeometry(3.8, 1);
    const outerEdges = new THREE.EdgesGeometry(outerGeo);
    const ringGeo    = new THREE.TorusGeometry(4.0, 0.018, 8, 120);

    /* ── Materials ────────────────────────────────────────── */
    const solidMat = new THREE.MeshStandardMaterial({
      color: 0x060e1a, metalness: 0.96, roughness: 0.04,
      transparent: true, opacity: 0.72,
    });
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x89AACC, transparent: true, opacity: 0.52,
    });
    const outerEdgeMat = new THREE.LineBasicMaterial({
      color: 0x4E85BF, transparent: true, opacity: 0.18,
    });
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x6090BB, transparent: true, opacity: 0.22, wireframe: false,
    });
    const glowMat = new THREE.MeshStandardMaterial({
      color: 0x3a70b0, emissive: 0x1a4070, emissiveIntensity: 3,
      transparent: true, opacity: 0.55,
    });

    /* ── Meshes ───────────────────────────────────────────── */
    const crystal = new THREE.Group();
    crystal.add(new THREE.Mesh(icoGeo, solidMat));
    crystal.add(new THREE.LineSegments(edgesGeo, edgeMat));
    crystal.add(new THREE.Mesh(new THREE.SphereGeometry(0.85, 20, 20), glowMat));
    scene.add(crystal);

    const outerShell = new THREE.LineSegments(outerEdges, outerEdgeMat);
    scene.add(outerShell);

    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.5;
    scene.add(ring);

    /* ── Particles ────────────────────────────────────────── */
    const N = 200;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 5 + Math.random() * 3.5;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleBuf = new THREE.BufferGeometry();
    particleBuf.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const particles = new THREE.Points(
      particleBuf,
      new THREE.PointsMaterial({ color: 0x89AACC, size: 0.04, transparent: true, opacity: 0.5, sizeAttenuation: true }),
    );
    scene.add(particles);

    /* ── Lights ───────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const kl = new THREE.PointLight(0x89AACC, 2.5, 30);  kl.position.set(7, 7, 6);
    const fl = new THREE.PointLight(0x4E85BF, 1.8, 30);  fl.position.set(-7, -5, -4);
    const bl = new THREE.PointLight(0xffffff, 0.6, 20);  bl.position.set(0, -9, 3);
    scene.add(kl, fl, bl);

    /* ── Mouse ────────────────────────────────────────────── */
    let mx = 0, my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    /* ── Resize ───────────────────────────────────────────── */
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    /* ── Animate ──────────────────────────────────────────── */
    const clock = new THREE.Clock();
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth mouse-driven tilt
      crystal.rotation.x += (-my * 0.22 - crystal.rotation.x) * 0.04;
      crystal.rotation.y += ( mx * 0.28 - crystal.rotation.y + t * 0.004) * 0.04;
      crystal.rotation.y += 0.0025;

      // Float
      crystal.position.y = Math.sin(t * 0.38) * 0.28;

      // Outer shell counter-rotates
      outerShell.rotation.x = -crystal.rotation.x * 0.6 + t * 0.012;
      outerShell.rotation.y = -crystal.rotation.y * 0.4 + t * 0.008;

      // Ring wobbles
      ring.rotation.z = t * 0.07;
      ring.rotation.x = Math.PI / 2.5 + Math.sin(t * 0.3) * 0.15;

      // Particles drift
      particles.rotation.y = t * 0.055;
      particles.rotation.x = t * 0.022;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      ro.disconnect();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}

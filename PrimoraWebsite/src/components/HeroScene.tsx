import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x000000, 0);
    Object.assign(renderer.domElement.style, {
      position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none',
    });
    mount.appendChild(renderer.domElement);

    // ── Scene / Camera ────────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 120);
    camera.position.set(0, 0, 10.5);

    // ── Crystal core ──────────────────────────────────────────────────────────
    const icoGeo   = new THREE.IcosahedronGeometry(2.9, 1);
    const solidMat = new THREE.MeshStandardMaterial({
      color: 0x04090f,
      metalness: 0.97,
      roughness: 0.03,
      transparent: true,
      opacity: 0.78,
    });
    const crystal = new THREE.Group();
    crystal.add(new THREE.Mesh(icoGeo, solidMat));

    // Edge wireframe
    crystal.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(icoGeo),
      new THREE.LineBasicMaterial({ color: 0x89aacc, transparent: true, opacity: 0.58 }),
    ));

    // Inner glow sphere
    const innerGlowMat = new THREE.MeshStandardMaterial({
      color: 0x4477bb,
      emissive: new THREE.Color(0x1a3a70),
      emissiveIntensity: 4.5,
      transparent: true,
      opacity: 0.6,
    });
    const innerGlow = new THREE.Mesh(new THREE.SphereGeometry(0.95, 24, 24), innerGlowMat);
    crystal.add(innerGlow);

    // Micro inner core (very bright)
    const coreGlowMat = new THREE.MeshBasicMaterial({ color: 0x8ab4e0, transparent: true, opacity: 0.45 });
    crystal.add(new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), coreGlowMat));

    scene.add(crystal);

    // ── Outer shell ───────────────────────────────────────────────────────────
    const outerShell = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(3.9, 1)),
      new THREE.LineBasicMaterial({ color: 0x4e85bf, transparent: true, opacity: 0.16 }),
    );
    scene.add(outerShell);

    // Even outer shell (dodecahedron for variety)
    const outerShell2 = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.DodecahedronGeometry(4.6, 0)),
      new THREE.LineBasicMaterial({ color: 0x3a6090, transparent: true, opacity: 0.07 }),
    );
    scene.add(outerShell2);

    // ── Rings (3 planes) ──────────────────────────────────────────────────────
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x5888bb, transparent: true, opacity: 0.22 });
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x89aacc, transparent: true, opacity: 0.14 });
    const ringMat3 = new THREE.MeshBasicMaterial({ color: 0x4e75a0, transparent: true, opacity: 0.10 });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.016, 8, 130), ringMat1);
    ring1.rotation.x = Math.PI / 2.4;

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.010, 8, 160), ringMat2);
    ring2.rotation.x = Math.PI / 2.4;
    ring2.rotation.y = Math.PI / 4;

    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(6.4, 0.007, 8, 180), ringMat3);
    ring3.rotation.x = 1.2;
    ring3.rotation.z = 0.4;

    scene.add(ring1, ring2, ring3);

    // ── Nebula backdrop (large soft sphere) ────────────────────────────────────
    const nebulaMat = new THREE.MeshBasicMaterial({
      color: 0x0d1e38,
      transparent: true,
      opacity: 0.45,
      side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(22, 32, 32), nebulaMat));

    // ── Particles ─────────────────────────────────────────────────────────────
    const N = 520;
    const pPos   = new Float32Array(N * 3);
    const pSizes = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 5.5 + Math.random() * 5.5;
      pPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.85;
      pPos[i * 3 + 2] = r * Math.cos(phi);
      pSizes[i] = 0.025 + Math.random() * 0.04;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({ color: 0x89aacc, size: 0.032, transparent: true, opacity: 0.48, sizeAttenuation: true }),
    );
    scene.add(particles);

    // Close-in bright sparkle particles
    const N2 = 80;
    const sPos = new Float32Array(N2 * 3);
    for (let i = 0; i < N2; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 3.1 + Math.random() * 1.8;
      sPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      sPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      sPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    const sparkles = new THREE.Points(
      sGeo,
      new THREE.PointsMaterial({ color: 0xccddee, size: 0.055, transparent: true, opacity: 0.32, sizeAttenuation: true }),
    );
    scene.add(sparkles);

    // ── Lights ────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x06101c, 2.0));
    const kl = new THREE.PointLight(0x99bbdd, 3.5, 40);  kl.position.set(8,  8,  7);
    const fl = new THREE.PointLight(0x4e85bf, 2.2, 40);  fl.position.set(-8, -5, -5);
    const bl = new THREE.PointLight(0x00aaff, 1.2, 25);  bl.position.set(0,  -10, 3);
    const rl = new THREE.PointLight(0x6090cc, 1.6, 20);  rl.position.set(0, 0, -8);
    scene.add(kl, fl, bl, rl);

    // Internal crystal light that pulses
    const innerLight = new THREE.PointLight(0x4477bb, 3.0, 8);
    innerLight.position.set(0, 0, 0);
    scene.add(innerLight);

    // ── Mouse ─────────────────────────────────────────────────────────────────
    let mx = 0, my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    // ── Resize ────────────────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    });
    ro.observe(mount);

    // ── Animation ─────────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let raf = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Crystal — mouse-driven + slow auto-spin
      crystal.rotation.x += (-my * 0.2 - crystal.rotation.x) * 0.035;
      crystal.rotation.y += ( mx * 0.25 - crystal.rotation.y + t * 0.003) * 0.035;
      crystal.rotation.y += 0.002;
      crystal.position.y  = Math.sin(t * 0.36) * 0.3;

      // Inner glow breathe
      innerGlowMat.emissiveIntensity = 3.8 + Math.sin(t * 1.2) * 0.7;
      coreGlowMat.opacity = 0.3 + Math.sin(t * 1.6 + 0.5) * 0.15;
      innerLight.intensity = 2.8 + Math.sin(t * 1.2) * 0.7;

      // Outer shells counter-rotate
      outerShell.rotation.x = -crystal.rotation.x * 0.5 + t * 0.010;
      outerShell.rotation.y = -crystal.rotation.y * 0.35 + t * 0.007;
      outerShell2.rotation.x = crystal.rotation.x * 0.3 + t * 0.006;
      outerShell2.rotation.y = -t * 0.009;

      // Rings
      ring1.rotation.z = t * 0.065;
      ring1.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.28) * 0.12;
      ring2.rotation.z = -t * 0.04;
      ring2.rotation.x = Math.PI / 2.4 + Math.cos(t * 0.22) * 0.09;
      ring3.rotation.z = t * 0.025;
      ring3.rotation.x = 1.2 + Math.sin(t * 0.18) * 0.08;

      // Particles
      particles.rotation.y  = t * 0.045;
      particles.rotation.x  = t * 0.018;
      sparkles.rotation.y   = -t * 0.06;
      sparkles.rotation.z   = t * 0.03;

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

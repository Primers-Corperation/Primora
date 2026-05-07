import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface AnnState {
  label: string;
  sub: string;
  x: number;
  y: number;
  visible: boolean;
  side: 'left' | 'right';
}

export default function GamepadScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [annotations, setAnnotations] = useState<AnnState[]>([]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer ────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.4, 7.5);
    camera.lookAt(0, -0.2, 0);

    // ── Materials ────────────────────────────────────────────────────────────
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0b1018,
      metalness: 0.18,
      roughness: 0.62,
    });
    const bodyAccentMat = new THREE.MeshStandardMaterial({
      color: 0x131e2c,
      metalness: 0.45,
      roughness: 0.28,
    });
    const stickBaseMat = new THREE.MeshStandardMaterial({
      color: 0x151e28,
      metalness: 0.2,
      roughness: 0.75,
    });
    const stickCapMat = new THREE.MeshStandardMaterial({
      color: 0x0e151e,
      metalness: 0.12,
      roughness: 0.92,
    });
    const triggerMat = new THREE.MeshStandardMaterial({
      color: 0x0a1420,
      metalness: 0.22,
      roughness: 0.55,
    });
    const touchpadMat = new THREE.MeshStandardMaterial({
      color: 0x111924,
      metalness: 0.38,
      roughness: 0.45,
    });
    const lightBarMat = new THREE.MeshStandardMaterial({
      color: 0x2a5caa,
      emissive: new THREE.Color(0x2a5caa),
      emissiveIntensity: 3.0,
      metalness: 0.6,
      roughness: 0.1,
    });
    const psBtnMat = new THREE.MeshStandardMaterial({
      color: 0x3a7ad4,
      emissive: new THREE.Color(0x1e55a0),
      emissiveIntensity: 1.2,
      metalness: 0.55,
      roughness: 0.18,
    });
    const btnTriMat = new THREE.MeshStandardMaterial({
      color: 0x28c080,
      emissive: new THREE.Color(0x186040),
      emissiveIntensity: 0.55,
      metalness: 0.08,
      roughness: 0.5,
    });
    const btnCircMat = new THREE.MeshStandardMaterial({
      color: 0xe03045,
      emissive: new THREE.Color(0x80182a),
      emissiveIntensity: 0.5,
      metalness: 0.08,
      roughness: 0.5,
    });
    const btnCrossMat = new THREE.MeshStandardMaterial({
      color: 0x4aa0e0,
      emissive: new THREE.Color(0x265880),
      emissiveIntensity: 0.5,
      metalness: 0.08,
      roughness: 0.5,
    });
    const btnSqMat = new THREE.MeshStandardMaterial({
      color: 0xe050a0,
      emissive: new THREE.Color(0x802858),
      emissiveIntensity: 0.5,
      metalness: 0.08,
      roughness: 0.5,
    });
    const smallBtnMat = new THREE.MeshStandardMaterial({
      color: 0x1a2840,
      metalness: 0.3,
      roughness: 0.6,
    });
    const dpadMat = new THREE.MeshStandardMaterial({
      color: 0x111824,
      metalness: 0.25,
      roughness: 0.65,
    });
    const edgeGlowMat = new THREE.MeshStandardMaterial({
      color: 0x89aacc,
      emissive: new THREE.Color(0x4e85bf),
      emissiveIntensity: 1.8,
      metalness: 0.5,
      roughness: 0.15,
    });
    const speakerMat = new THREE.MeshStandardMaterial({
      color: 0x0d1520,
      metalness: 0.15,
      roughness: 0.88,
    });

    // ── Controller Group ─────────────────────────────────────────────────────
    const ctrl = new THREE.Group();
    ctrl.rotation.y = 0.2;
    scene.add(ctrl);

    // ── Main Body (ExtrudeGeometry for realistic silhouette) ──────────────────
    const bodyShape = new THREE.Shape();
    // DualSense-like outline (front face)
    bodyShape.moveTo(-1.82, 0.52);
    bodyShape.lineTo(1.82, 0.52);
    bodyShape.quadraticCurveTo(2.08, 0.52, 2.08, 0.26);
    bodyShape.lineTo(2.08, -0.18);
    // Right grip curve
    bodyShape.bezierCurveTo(2.08, -0.72, 1.55, -1.5, 1.32, -1.75);
    bodyShape.quadraticCurveTo(1.12, -1.98, 0.88, -1.98);
    bodyShape.quadraticCurveTo(0.64, -1.98, 0.52, -1.75);
    // Central indentation between grips
    bodyShape.bezierCurveTo(0.38, -1.45, 0.18, -1.28, 0, -1.28);
    bodyShape.bezierCurveTo(-0.18, -1.28, -0.38, -1.45, -0.52, -1.75);
    // Left grip curve
    bodyShape.quadraticCurveTo(-0.64, -1.98, -0.88, -1.98);
    bodyShape.quadraticCurveTo(-1.12, -1.98, -1.32, -1.75);
    bodyShape.bezierCurveTo(-1.55, -1.5, -2.08, -0.72, -2.08, -0.18);
    bodyShape.lineTo(-2.08, 0.26);
    bodyShape.quadraticCurveTo(-2.08, 0.52, -1.82, 0.52);

    const extrudeSettings = {
      steps: 1,
      depth: 0.52,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelOffset: 0,
      bevelSegments: 6,
    };
    const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, extrudeSettings);
    bodyGeo.center();
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.castShadow = true;
    ctrl.add(bodyMesh);

    // Shoulder bar (connects L/R sides at the top)
    const shoulderGeo = new THREE.BoxGeometry(3.8, 0.28, 0.38);
    const shoulder = new THREE.Mesh(shoulderGeo, bodyAccentMat);
    shoulder.position.set(0, 0.48, 0.07);
    ctrl.add(shoulder);

    // Decorative accent lines (edge glow strips)
    const accentStripGeo = new THREE.BoxGeometry(3.5, 0.025, 0.028);
    const accentTop = new THREE.Mesh(accentStripGeo, edgeGlowMat);
    accentTop.position.set(0, 0.64, 0.12);
    ctrl.add(accentTop);

    // ── Triggers L2/R2 ───────────────────────────────────────────────────────
    const makeTrigger = (side: number) => {
      const g = new THREE.Group();
      // Main trigger body
      const trigGeo = new THREE.BoxGeometry(0.72, 0.2, 0.38);
      const trig = new THREE.Mesh(trigGeo, triggerMat);
      trig.castShadow = true;
      g.add(trig);
      // Curved front face
      const frontGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.72, 20, 1, false, 0, Math.PI);
      const front = new THREE.Mesh(frontGeo, triggerMat);
      front.rotation.z = Math.PI / 2;
      front.position.set(0, -0.1, 0.19);
      g.add(front);
      g.position.set(side * 1.5, 0.68, 0.08);
      g.rotation.x = -0.28;
      return g;
    };
    ctrl.add(makeTrigger(-1));
    ctrl.add(makeTrigger(1));

    // ── Bumpers L1/R1 ────────────────────────────────────────────────────────
    const makeBumper = (side: number) => {
      const bumpGeo = new THREE.BoxGeometry(0.72, 0.16, 0.26);
      const bump = new THREE.Mesh(bumpGeo, bodyAccentMat);
      bump.castShadow = true;
      bump.position.set(side * 1.5, 0.52, 0.2);
      return bump;
    };
    ctrl.add(makeBumper(-1));
    ctrl.add(makeBumper(1));

    // ── Touchpad ─────────────────────────────────────────────────────────────
    const tpShape = new THREE.Shape();
    const tpW = 0.56, tpH = 0.38, tpR = 0.06;
    tpShape.moveTo(-tpW + tpR, -tpH);
    tpShape.lineTo(tpW - tpR, -tpH);
    tpShape.quadraticCurveTo(tpW, -tpH, tpW, -tpH + tpR);
    tpShape.lineTo(tpW, tpH - tpR);
    tpShape.quadraticCurveTo(tpW, tpH, tpW - tpR, tpH);
    tpShape.lineTo(-tpW + tpR, tpH);
    tpShape.quadraticCurveTo(-tpW, tpH, -tpW, tpH - tpR);
    tpShape.lineTo(-tpW, -tpH + tpR);
    tpShape.quadraticCurveTo(-tpW, -tpH, -tpW + tpR, -tpH);

    const tpExtrudeSettings = { depth: 0.05, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 3 };
    const tpGeo = new THREE.ExtrudeGeometry(tpShape, tpExtrudeSettings);
    const touchpad = new THREE.Mesh(tpGeo, touchpadMat);
    touchpad.position.set(0, 0.12, 0.28);
    ctrl.add(touchpad);

    // Touchpad click indicator
    const tpDotGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.025, 16);
    const tpDot = new THREE.Mesh(tpDotGeo, psBtnMat);
    tpDot.rotation.x = Math.PI / 2;
    tpDot.position.set(0, 0.12, 0.36);
    ctrl.add(tpDot);

    // ── Light Bar ─────────────────────────────────────────────────────────────
    const lbGeo = new THREE.BoxGeometry(0.95, 0.045, 0.045);
    const lightBar = new THREE.Mesh(lbGeo, lightBarMat);
    lightBar.position.set(0, -0.18, -0.3);
    ctrl.add(lightBar);

    // Light from the light bar
    const lbLight = new THREE.PointLight(0x2a5caa, 1.8, 3.5);
    lbLight.position.set(0, -0.18, -0.35);
    ctrl.add(lbLight);

    // ── Analog Sticks ─────────────────────────────────────────────────────────
    const makeStick = (x: number, y: number) => {
      const g = new THREE.Group();
      const ringGeo = new THREE.TorusGeometry(0.27, 0.02, 12, 40);
      const ring = new THREE.Mesh(ringGeo, stickBaseMat);
      ring.rotation.x = Math.PI / 2;
      g.add(ring);
      const baseGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.06, 32);
      const base = new THREE.Mesh(baseGeo, stickBaseMat);
      g.add(base);
      const stemGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.12, 32);
      const stem = new THREE.Mesh(stemGeo, stickCapMat);
      stem.position.y = 0.09;
      g.add(stem);
      // Concave cap (inverted sphere top half)
      const capGeo = new THREE.SphereGeometry(0.22, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.55);
      const cap = new THREE.Mesh(capGeo, stickCapMat);
      cap.rotation.x = Math.PI;
      cap.position.y = 0.2;
      g.add(cap);
      g.position.set(x, y, 0.28);
      return g;
    };
    ctrl.add(makeStick(-0.82, -0.22));
    ctrl.add(makeStick(0.52, -0.35));

    // ── D-Pad ─────────────────────────────────────────────────────────────────
    const dpadGroup = new THREE.Group();
    const dH = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.18, 0.05), dpadMat);
    dpadGroup.add(dH);
    const dV = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.58, 0.05), dpadMat);
    dpadGroup.add(dV);
    // Corner fills for cross shape
    [-1, 1].forEach(sx => [-1, 1].forEach(sy => {
      const corner = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.05), dpadMat);
      corner.position.set(sx * 0.19, sy * 0.19, 0);
      dpadGroup.add(corner);
    }));
    dpadGroup.position.set(-0.58, -0.28, 0.29);
    ctrl.add(dpadGroup);

    // ── Face Buttons ──────────────────────────────────────────────────────────
    const btnGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.065, 24);
    const makeBtn = (x: number, y: number, mat: THREE.MeshStandardMaterial) => {
      const b = new THREE.Mesh(btnGeo, mat);
      b.rotation.x = Math.PI / 2;
      b.position.set(x, y, 0.3);
      ctrl.add(b);
      // Button face symbol (raised center)
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 16), mat);
      cap.rotation.x = Math.PI / 2;
      cap.position.set(x, y, 0.365);
      ctrl.add(cap);
    };
    makeBtn(1.12, 0.24, btnTriMat);   // triangle
    makeBtn(1.32, 0.06, btnCircMat);  // circle
    makeBtn(1.12, -0.12, btnCrossMat); // cross
    makeBtn(0.92, 0.06, btnSqMat);   // square

    // ── Options / Create Buttons ──────────────────────────────────────────────
    const miniGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.045, 16);
    const optBtn = new THREE.Mesh(miniGeo, smallBtnMat);
    optBtn.rotation.x = Math.PI / 2;
    optBtn.position.set(0.52, 0.14, 0.3);
    ctrl.add(optBtn);
    const createBtn = new THREE.Mesh(miniGeo, smallBtnMat);
    createBtn.rotation.x = Math.PI / 2;
    createBtn.position.set(-0.52, 0.14, 0.3);
    ctrl.add(createBtn);

    // ── PS Button ─────────────────────────────────────────────────────────────
    const psGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.052, 32);
    const psBtn = new THREE.Mesh(psGeo, psBtnMat);
    psBtn.rotation.x = Math.PI / 2;
    psBtn.position.set(0, -0.01, 0.31);
    ctrl.add(psBtn);

    // ── Speaker Grille (decorative) ────────────────────────────────────────
    for (let i = -2; i <= 2; i++) {
      const sg = new THREE.CylinderGeometry(0.018, 0.018, 0.02, 8);
      const sm = new THREE.Mesh(sg, speakerMat);
      sm.rotation.x = Math.PI / 2;
      sm.position.set(i * 0.068, -0.34, 0.29);
      ctrl.add(sm);
    }

    // ── Floating Particles ────────────────────────────────────────────────────
    const pCount = 160;
    const pPos = new Float32Array(pCount * 3);
    const pSpeeds = new Float32Array(pCount);
    for (let i = 0; i < pCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3.2 + Math.random() * 2.2;
      pPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.55;
      pPos[i * 3 + 2] = r * Math.cos(phi);
      pSpeeds[i] = 0.5 + Math.random() * 0.5;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x4e85bf,
      size: 0.022,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── Scan Plane ────────────────────────────────────────────────────────────
    const scanGeo = new THREE.PlaneGeometry(4.5, 0.012);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x89aacc,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const scanLine = new THREE.Mesh(scanGeo, scanMat);
    scene.add(scanLine);

    // ── Halo ring around controller ───────────────────────────────────────────
    const haloGeo = new THREE.TorusGeometry(2.8, 0.006, 8, 120);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x4e85bf,
      transparent: true,
      opacity: 0.18,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2;
    scene.add(halo);

    // ── Lighting ──────────────────────────────────────────────────────────────
    // Key (warm, top-right)
    const keyLight = new THREE.DirectionalLight(0xfff4ec, 4.2);
    keyLight.position.set(5, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.bias = -0.0008;
    scene.add(keyLight);

    // Fill (cool blue, left)
    const fillLight = new THREE.PointLight(0x3a70b8, 2.0, 18);
    fillLight.position.set(-6, 2, 4);
    scene.add(fillLight);

    // Rim (cyan, from behind)
    const rimLight = new THREE.PointLight(0x00c8e8, 2.8, 14);
    rimLight.position.set(1, -2, -6);
    scene.add(rimLight);

    // Bottom bounce
    const bounceLight = new THREE.PointLight(0x4e85bf, 1.0, 10);
    bounceLight.position.set(0, -5, 2);
    scene.add(bounceLight);

    // Ambient
    scene.add(new THREE.AmbientLight(0x08111c, 2.2));

    // ── Annotation anchor positions ────────────────────────────────────────────
    const annDefs: Array<{ label: string; sub: string; pos: THREE.Vector3; side: 'left' | 'right' }> = [
      { label: 'Adaptive Triggers',   sub: 'L2/R2 Force Feedback',   pos: new THREE.Vector3(-1.55, 0.72, 0.35),  side: 'left'  },
      { label: 'L-Stick Calibration', sub: 'Neuro-Kinetic Profile',  pos: new THREE.Vector3(-0.82, -0.22, 0.4),  side: 'left'  },
      { label: 'Face Buttons',        sub: 'Zero-Latency Response',  pos: new THREE.Vector3(1.22,  0.08, 0.42),  side: 'right' },
      { label: 'Precision Haptics',   sub: 'Dual Actuator Array',    pos: new THREE.Vector3(0.52, -0.35, 0.42),  side: 'right' },
    ];

    // ── Mouse tracking ─────────────────────────────────────────────────────────
    let tgtRotX = 0, tgtRotY = 0.2;
    let curRotX = 0, curRotY = 0.2;

    const onMouseMove = (e: MouseEvent) => {
      const r = mount.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width * 2 - 1;
      const ny = (e.clientY - r.top)  / r.height * 2 - 1;
      tgtRotY = nx * 0.55 + 0.15;
      tgtRotX = -ny * 0.28;
    };
    const onMouseLeave = () => { tgtRotX = 0; tgtRotY = 0.2; };
    mount.addEventListener('mousemove', onMouseMove);
    mount.addEventListener('mouseleave', onMouseLeave);

    // ── Animation loop ─────────────────────────────────────────────────────────
    let rafId: number;
    const clock = new THREE.Clock();
    let scanY = 1.3;

    const annVec = new THREE.Vector3();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Controller rotation lerp
      curRotX += (tgtRotX - curRotX) * 0.035;
      curRotY += (tgtRotY - curRotY) * 0.035;
      ctrl.rotation.x = curRotX + Math.sin(t * 0.22) * 0.018;
      ctrl.rotation.y = curRotY + Math.sin(t * 0.18) * 0.04;

      // Floating
      ctrl.position.y = Math.sin(t * 0.48) * 0.1;

      // Particle drift
      particles.rotation.y = t * 0.045;
      particles.rotation.z = t * 0.018;

      // Halo pulse
      halo.rotation.z = t * 0.12;
      halo.position.y = ctrl.position.y;
      haloMat.opacity = 0.12 + Math.sin(t * 0.9) * 0.06;

      // Scan line sweep
      scanY -= 0.02;
      if (scanY < -1.4) { scanY = 1.4; }
      const scanPulse = 1 - Math.abs(scanY) / 1.4;
      scanMat.opacity = scanPulse * 0.32;
      scanLine.position.set(0, scanY + ctrl.position.y, 0.45);
      scanLine.rotation.copy(ctrl.rotation);
      scanLine.rotation.x = ctrl.rotation.x;

      // Light bar breathe
      lightBarMat.emissiveIntensity = 2.2 + Math.sin(t * 1.4) * 0.8;
      lbLight.intensity = 1.4 + Math.sin(t * 1.4) * 0.4;

      // PS button pulse
      psBtnMat.emissiveIntensity = 0.9 + Math.sin(t * 0.8) * 0.3;

      // Update annotation positions
      const newAnns: AnnState[] = annDefs.map(({ label, sub, pos, side }) => {
        annVec.copy(pos);
        annVec.applyMatrix4(ctrl.matrixWorld);
        annVec.project(camera);
        const x = ( annVec.x + 1) / 2 * mount.clientWidth;
        const y = (-annVec.y + 1) / 2 * mount.clientHeight;
        return { label, sub, x, y, visible: annVec.z < 1.0, side };
      });
      setAnnotations(newAnns);

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ────────────────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(rafId);
      mount.removeEventListener('mousemove', onMouseMove);
      mount.removeEventListener('mouseleave', onMouseLeave);
      ro.disconnect();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} className="relative w-full h-full">
      {annotations.map((ann, i) =>
        ann.visible ? (
          <div
            key={i}
            className="ann-root"
            style={{
              left: ann.x,
              top: ann.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="ann-dot" />
            <div className={`ann-line ${ann.side === 'right' ? 'ann-line-right' : 'ann-line-left'}`} />
            <div className={`ann-box ${ann.side === 'right' ? 'ann-box-right' : 'ann-box-left'}`}>
              <div className="ann-label">{ann.label}</div>
              <div className="ann-sub">{ann.sub}</div>
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}

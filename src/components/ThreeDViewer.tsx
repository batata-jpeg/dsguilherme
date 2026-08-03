import { useEffect, useRef } from "react";
import * as THREE from "three";

export type GeometryType = "box" | "sphere" | "torus" | "octahedron" | "cone" | "torusknot";

interface ThreeDViewerProps {
  geometryType: GeometryType;
  color?: string;
  darkBg?: boolean;
}

export default function ThreeDViewer({ geometryType, color = "#a2d5c6", darkBg = true }: ThreeDViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Scene ──────────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    // ── Geometry ───────────────────────────────────────────────────────────────
    let geometry: THREE.BufferGeometry;
    switch (geometryType) {
      case "sphere":    geometry = new THREE.SphereGeometry(1.3, 64, 64);         break;
      case "torus":     geometry = new THREE.TorusGeometry(1.05, 0.38, 48, 96);   break;
      case "octahedron":geometry = new THREE.OctahedronGeometry(1.4, 0);          break;
      case "cone":      geometry = new THREE.ConeGeometry(1.1, 2.0, 6, 1);        break;
      case "torusknot": geometry = new THREE.TorusKnotGeometry(0.85, 0.28, 160, 32); break;
      default:          geometry = new THREE.BoxGeometry(1.8, 1.8, 1.8);          break;
    }

    // Main material
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: 0.55,
      roughness: 0.28,
    });
    const mesh = new THREE.Mesh(geometry, mat);
    scene.add(mesh);

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.045,
    });
    const wireMesh = new THREE.Mesh(geometry, wireMat);
    scene.add(wireMesh);

    // ── Lights ─────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));

    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(5, 6, 5);
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x9aaeff, 0.5);
    fill.position.set(-4, -2, -3);
    scene.add(fill);

    const accent = new THREE.PointLight(new THREE.Color(color), 2.0, 12);
    accent.position.set(2, 2, 2);
    scene.add(accent);

    // ── Interaction state ──────────────────────────────────────────────────────
    let isDragging = false;
    let lastX = 0, lastY = 0;
    let velX = 0, velY = 0;
    let autoRotate = true;
    let idleTimer: ReturnType<typeof setTimeout>;

    const syncWire = () => {
      wireMesh.rotation.x = mesh.rotation.x;
      wireMesh.rotation.y = mesh.rotation.y;
    };

    const scheduleAutoRotate = () => {
      autoRotate = false;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { autoRotate = true; }, 2200);
    };

    // Mouse
    const onDown = (e: MouseEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      scheduleAutoRotate();
      (renderer.domElement as HTMLElement).style.cursor = "grabbing";
    };
    const onMove = (e: MouseEvent) => {
      if (!isDragging) return;
      velX = (e.clientX - lastX) * 0.012;
      velY = (e.clientY - lastY) * 0.012;
      mesh.rotation.y += velX;
      mesh.rotation.x += velY;
      syncWire();
      lastX = e.clientX;
      lastY = e.clientY;
      scheduleAutoRotate();
    };
    const onUp = () => {
      isDragging = false;
      (renderer.domElement as HTMLElement).style.cursor = "grab";
    };

    // Touch
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      isDragging = true;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
      scheduleAutoRotate();
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!isDragging || e.touches.length !== 1) return;
      velX = (e.touches[0].clientX - lastX) * 0.012;
      velY = (e.touches[0].clientY - lastY) * 0.012;
      mesh.rotation.y += velX;
      mesh.rotation.x += velY;
      syncWire();
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
      scheduleAutoRotate();
    };
    const onTouchEnd = () => { isDragging = false; };

    renderer.domElement.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    renderer.domElement.addEventListener("touchstart", onTouchStart, { passive: false });
    renderer.domElement.addEventListener("touchmove", onTouchMove, { passive: false });
    renderer.domElement.addEventListener("touchend", onTouchEnd);

    // ── ResizeObserver ─────────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth, h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(mount);

    // ── Animation loop ─────────────────────────────────────────────────────────
    let rafId: number;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (!isDragging) {
        velX *= 0.90;
        velY *= 0.90;
        mesh.rotation.y += velX;
        mesh.rotation.x += velY;
        syncWire();
      }
      if (autoRotate) {
        mesh.rotation.y += 0.0045;
        syncWire();
      }
      renderer.render(scene, camera);
    };
    tick();

    // ── Cleanup ────────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(idleTimer);
      renderer.domElement.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      renderer.domElement.removeEventListener("touchstart", onTouchStart);
      renderer.domElement.removeEventListener("touchmove", onTouchMove);
      renderer.domElement.removeEventListener("touchend", onTouchEnd);
      ro.disconnect();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
      geometry.dispose();
      mat.dispose();
      wireMat.dispose();
    };
  }, [geometryType, color]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      style={{ cursor: "grab", touchAction: "none", userSelect: "none" }}
    />
  );
}

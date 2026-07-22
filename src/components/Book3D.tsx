// @ts-nocheck
import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { ChevronLeft, ChevronRight, RotateCcw, MousePointer2, Search, Hand } from "lucide-react";

/**
 * Book3D — a static (non-self-rotating) 3D book rendered with Three.js.
 *
 * Interaction:
 *   • Drag left/right over the book to turn a page (hold & drag to the side).
 *   • Scroll wheel to zoom in/out (high-res canvas page textures stay crisp).
 *   • When zoomed in, drag to pan across the page to inspect detail.
 *   • On-screen ‹ › arrows also turn pages.
 *   • Reaching the back cover reveals a "Voltar ao início" button.
 *
 * Pages are rigid leaves that pivot around the spine — a clean, readable
 * page-flip (not a soft cloth bend). Textures are drawn to high-resolution
 * canvases so zooming keeps the content sharp.
 */

type Sheet = { front: PageContent; back: PageContent };
type PageContent = {
  kind: "cover" | "page" | "back";
  heading?: string;
  sub?: string;
  pageNo?: number;
};

const PAGE_W = 3.49; // matches the trimmed book page aspect (581.1 × 666.1 pt)
const PAGE_H = 4;
const GAP = 0.02; // z separation between stacked leaves
const EASE = 0.16; // page settle easing
const PAGE_SEG = 30; // width subdivisions — more = smoother soft-page bend
const CURL_MAX = 1.15; // how much a page curls (radians) at mid-turn
const HOVER_CURL = 0.16; // gentle lift of the top page on hover ("living paper")
const TEX_W = 1200; // texture resolution (keeps zoom crisp)
const TEX_H = 1600;

const ACCENT = "#A2D5C6";

// ── Real book pages (rendered from the PDF, trimmed to the final page) ────────
// 24 pages → 12 sheets. p01 = front cover, p24 = back cover.
const PAGE_COUNT = 24;
const PAGE_URLS = Array.from({ length: PAGE_COUNT }, (_, i) =>
  `/book/p${String(i + 1).padStart(2, "0")}.jpg`
);
function buildSheets(): { front: string; back: string }[] {
  const sheets: { front: string; back: string }[] = [];
  for (let i = 0; i < PAGE_URLS.length; i += 2) {
    sheets.push({ front: PAGE_URLS[i], back: PAGE_URLS[i + 1] });
  }
  return sheets;
}

// Load a page image as a texture (streams in and updates when ready).
function loadTexture(url: string, maxAniso: number): THREE.Texture {
  const tex = new THREE.TextureLoader().load(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAniso;
  return tex;
}

// ── Draw a page to a high-res canvas → texture ───────────────────────────────
function makeTexture(c: PageContent, maxAniso: number): THREE.Texture {
  const cv = document.createElement("canvas");
  cv.width = TEX_W;
  cv.height = TEX_H;
  const ctx = cv.getContext("2d")!;

  if (c.kind === "cover" || c.kind === "back") {
    // Dark cover with accent frame
    const g = ctx.createLinearGradient(0, 0, TEX_W, TEX_H);
    g.addColorStop(0, "#0b1622");
    g.addColorStop(1, "#050a12");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, TEX_W, TEX_H);

    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 6;
    ctx.strokeRect(70, 70, TEX_W - 140, TEX_H - 140);

    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 150px Georgia, serif";
    ctx.fillText(c.heading || "", TEX_W / 2, TEX_H / 2 - 20);

    if (c.sub) {
      ctx.fillStyle = ACCENT;
      ctx.font = "600 56px Georgia, serif";
      ctx.fillText(c.sub.toUpperCase(), TEX_W / 2, TEX_H / 2 + 90);
    }

    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "500 40px Georgia, serif";
    ctx.fillText(
      c.kind === "cover" ? "arraste para abrir →" : "Guilherme Carvalho",
      TEX_W / 2,
      TEX_H - 130
    );
  } else {
    // Cream reading page
    ctx.fillStyle = "#f6f3ea";
    ctx.fillRect(0, 0, TEX_W, TEX_H);
    // subtle inner-margin tint near the spine handled by geometry side
    ctx.fillStyle = "rgba(0,0,0,0.03)";
    ctx.fillRect(0, 0, 90, TEX_H);

    ctx.textAlign = "left";
    ctx.fillStyle = "#1a2330";
    ctx.font = "800 84px Georgia, serif";
    ctx.fillText(c.heading || "", 150, 240);

    // accent rule
    ctx.fillStyle = ACCENT;
    ctx.fillRect(150, 290, 340, 10);

    // faux paragraph lines
    ctx.fillStyle = "rgba(26,35,48,0.16)";
    let y = 420;
    const lineH = 78;
    const rows = 12;
    for (let r = 0; r < rows; r++) {
      const w = r % 4 === 3 ? 480 : 900;
      ctx.fillRect(150, y, w, 26);
      y += lineH;
    }

    // page number footer
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(26,35,48,0.5)";
    ctx.font = "500 44px Georgia, serif";
    ctx.fillText(String(c.pageNo ?? ""), TEX_W / 2, TEX_H - 120);
  }

  const tex = new THREE.CanvasTexture(cv);
  tex.anisotropy = maxAniso;
  tex.needsUpdate = true;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ── Dark wooden desk texture (top-down surface behind the book) ───────────────
function makeDeskTexture(maxAniso: number): THREE.Texture {
  const cv = document.createElement("canvas");
  cv.width = 1024;
  cv.height = 1024;
  const ctx = cv.getContext("2d")!;

  // wood base (lighter, so the desk reads clearly across the scene)
  ctx.fillStyle = "#4a3623";
  ctx.fillRect(0, 0, 1024, 1024);

  // wavy wood grain streaks
  for (let i = 0; i < 240; i++) {
    const y = Math.random() * 1024;
    const s = 12 + Math.random() * 26;
    ctx.strokeStyle = `rgba(${s + 34},${s + 20},${s + 8},0.45)`;
    ctx.lineWidth = 0.4 + Math.random() * 1.6;
    ctx.beginPath();
    ctx.moveTo(0, y);
    let x = 0;
    let yy = y;
    while (x < 1024) {
      x += 40 + Math.random() * 70;
      yy = y + Math.sin(x * 0.011) * 6 + (Math.random() - 0.5) * 4;
      ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }

  // plank seams
  ctx.strokeStyle = "rgba(0,0,0,0.55)";
  ctx.lineWidth = 3;
  for (let py = 150; py < 1024; py += 190) {
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(1024, py);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAniso;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 1.4);
  return tex;
}

export default function Book3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{ forward: () => void; back: () => void; restart: () => void } | null>(null);

  const [showTutorial, setShowTutorial] = useState(true);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  // Touch devices get finger-based instructions instead of mouse ones.
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(typeof window !== "undefined" && !!window.matchMedia?.("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    const mount = mountRef.current!;
    let width = mount.clientWidth || 800;
    let height = mount.clientHeight || 600;

    // ── Renderer / scene / camera ───────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false; // re-render the shadow only when the scene moves
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.cursor = "grab";

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    // Camera distance is derived from the container so an open spread always
    // fits — portrait phones need to pull back much further than a wide window.
    let CAM_Z_DEFAULT = 7.2;
    let CAM_Z_MIN = 2.6; // zoomed in
    let CAM_Z_MAX = 8.5; // zoomed out
    let camZ = CAM_Z_DEFAULT;

    const fitCamera = () => {
      const vFov = (camera.fov * Math.PI) / 180;
      const aspect = Math.max(width / height, 0.01);
      const targetW = PAGE_W * 2 * 1.08; // open spread + margin
      const targetH = PAGE_H * 1.14;
      const dV = targetH / 2 / Math.tan(vFov / 2);
      const dH = targetW / 2 / (Math.tan(vFov / 2) * aspect);
      const fit = Math.max(dV, dH);
      const wasAtDefault = Math.abs(camZ - CAM_Z_DEFAULT) < 0.01;
      CAM_Z_DEFAULT = fit;
      CAM_Z_MIN = fit * 0.34; // how far you can pinch/scroll in
      CAM_Z_MAX = fit * 1.18;
      camZ = wasAtDefault ? CAM_Z_DEFAULT : THREE.MathUtils.clamp(camZ, CAM_Z_MIN, CAM_Z_MAX);
    };
    fitCamera();
    let targetX = PAGE_W / 2; // recentre on whatever spread is showing
    let targetY = 0;
    let panX = 0;
    let panY = 0;

    // ── Lights ──────────────────────────────────────────────────────────────
    // Dark room: low ambient so the desk falls into shadow, with a warm
    // lamp (spotlight) hanging above the book that lights the pages & cover.
    const AMBIENT = 0.36; // raise for a brighter room, lower for moodier dark
    const SPOT_INTENSITY = 22; // brightness of the overhead lamp
    const SPOT_ANGLE = 0.85; // cone width — bigger = lights more of the book/desk

    scene.add(new THREE.AmbientLight(0x9fb4c8, AMBIENT));

    // faint cool fill so page edges aren't pure black
    const fill = new THREE.DirectionalLight(0x8aa0b8, 0.12);
    fill.position.set(-2, 1, 5);
    scene.add(fill);

    // Overhead warm lamp
    const spot = new THREE.SpotLight(0xffe6c2, SPOT_INTENSITY, 0, SPOT_ANGLE, 0.6, 1.5);
    spot.position.set(0.6, 3.2, 3.6);
    spot.target.position.set(0, 0, 0);
    spot.castShadow = true;
    spot.shadow.mapSize.set(1024, 1024);
    spot.shadow.camera.near = 0.5;
    spot.shadow.camera.far = 20;
    spot.shadow.bias = -0.0005;
    spot.shadow.radius = 6;
    scene.add(spot);
    scene.add(spot.target);

    // ── Build book leaves ───────────────────────────────────────────────────
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const sheets = buildSheets();
    const N = sheets.length;

    const bookGroup = new THREE.Group();
    scene.add(bookGroup);

    const leaves: {
      geo: THREE.BufferGeometry;
      uArr: Float32Array; // per-vertex param along the page width (0 at spine → 1 at edge)
      yArr: Float32Array; // per-vertex height
      angle: number; // 0 = unturned (right), -PI = turned (left)
    }[] = [];

    const disposables: (THREE.Texture | THREE.Material | THREE.BufferGeometry)[] = [];

    // ── Desk surface behind the book (dark wood, seen top-down) ──────────────
    const deskTex = makeDeskTexture(maxAniso);
    const deskMat = new THREE.MeshStandardMaterial({ map: deskTex, roughness: 0.9, metalness: 0 });
    const deskGeo = new THREE.PlaneGeometry(46, 32);
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.set(0, 0, -0.45);
    desk.receiveShadow = true;
    scene.add(desk);
    disposables.push(deskTex, deskMat, deskGeo);

    // Environment reflection for the glossy covers (coated / couché paper).
    let envTex: THREE.Texture | null = null;
    try {
      const pmrem = new THREE.PMREMGenerator(renderer);
      envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      pmrem.dispose();
      if (envTex) disposables.push(envTex);
    } catch {
      envTex = null;
    }

    const paperMat = (map: THREE.Texture, side: THREE.Side) =>
      new THREE.MeshStandardMaterial({ map, roughness: 0.92, metalness: 0, side }); // matte inner paper
    const coverMat = (map: THREE.Texture, side: THREE.Side) =>
      new THREE.MeshPhysicalMaterial({
        map,
        roughness: 0.55,
        metalness: 0,
        clearcoat: 0.5, // subtle coated-paper sheen — soft, keeps the colours readable
        clearcoatRoughness: 0.45,
        envMap: envTex || undefined,
        envMapIntensity: 0.28,
        side,
      });

    for (let i = 0; i < N; i++) {
      // Subdivided plane so the page can bend softly along its width.
      const geo = new THREE.PlaneGeometry(PAGE_W, PAGE_H, PAGE_SEG, 1);
      geo.translate(PAGE_W / 2, 0, 0); // left edge (spine) sits at x = 0
      const pos = geo.attributes.position;
      const uArr = new Float32Array(pos.count);
      const yArr = new Float32Array(pos.count);
      for (let k = 0; k < pos.count; k++) {
        uArr[k] = pos.getX(k) / PAGE_W; // 0 at spine → 1 at outer edge
        yArr[k] = pos.getY(k);
      }
      disposables.push(geo);

      const frontTex = loadTexture(sheets[i].front, maxAniso);
      const backTex = loadTexture(sheets[i].back, maxAniso);
      disposables.push(frontTex, backTex);
      // BackSide plane needs its texture mirrored to read correctly.
      backTex.wrapS = THREE.RepeatWrapping;
      backTex.repeat.x = -1;
      backTex.offset.x = 1;

      const isFrontCover = i === 0; // p01
      const isBackCover = i === N - 1; // p24
      const frontMat = isFrontCover ? coverMat(frontTex, THREE.FrontSide) : paperMat(frontTex, THREE.FrontSide);
      const backMat = isBackCover ? coverMat(backTex, THREE.BackSide) : paperMat(backTex, THREE.BackSide);
      disposables.push(frontMat, backMat);

      // Two single-sided meshes sharing the deformable geometry.
      const frontMesh = new THREE.Mesh(geo, frontMat);
      const backMesh = new THREE.Mesh(geo, backMat);
      frontMesh.castShadow = backMesh.castShadow = true;
      frontMesh.receiveShadow = backMesh.receiveShadow = true;
      bookGroup.add(frontMesh, backMesh);
      leaves.push({ geo, uArr, yArr, angle: 0 });
    }

    // Thin spine — barely visible, and only shown while a cover is on screen.
    const spineGeo = new THREE.BoxGeometry(0.035, PAGE_H, 0.05);
    const spineMat = new THREE.MeshStandardMaterial({
      color: 0x1a120b,
      roughness: 1,
      transparent: true,
      opacity: 1,
    });
    disposables.push(spineGeo, spineMat);
    const spine = new THREE.Mesh(spineGeo, spineMat);
    spine.position.set(0, 0, 0);
    bookGroup.add(spine);

    // ── State ───────────────────────────────────────────────────────────────
    let currentIndex = 0; // leaves with index < currentIndex are turned
    let dragLeaf: number | null = null; // leaf being dragged
    let dragging = false;
    let dragMode: "turn" | "pan" | null = null;
    let startX = 0;
    let startY = 0;
    let dragStartAngle = 0;
    let openIntro = 0; // 0→1 entrance progress
    let hovering = false; // pointer over the book
    let hoverEase = 0; // eased hover amount
    let elapsed = 0; // seconds, for the hover ripple

    // Bend a leaf's vertices into a soft, curved page for the given angle.
    // p = 0 → flat on the right, p = 1 → flat on the left; curl peaks mid-turn.
    const applyLeaf = (L: (typeof leaves)[number], i: number) => {
      const p = THREE.MathUtils.clamp(-L.angle / Math.PI, 0, 1);
      let c = CURL_MAX * Math.sin(Math.PI * p); // 0 at rest, max mid-flip
      // "living paper": the next page to turn breathes/curls a touch on hover.
      if (!dragging && i === currentIndex && p < 0.02) {
        c += HOVER_CURL * hoverEase * (0.6 + 0.4 * Math.sin(elapsed * 2.2));
      }
      const A0 = Math.PI * p; // base sweep of the page
      const W = PAGE_W;
      const stackZ =
        i < currentIndex ? -GAP * (currentIndex - 1 - i) : -GAP * (i - currentIndex);
      const pos = L.geo.attributes.position;
      const small = Math.abs(c) < 1e-3;
      for (let k = 0; k < pos.count; k++) {
        const u = L.uArr[k];
        let X: number, Z: number;
        if (small) {
          X = u * W * Math.cos(A0);
          Z = u * W * Math.sin(A0);
        } else {
          X = (W / c) * (Math.sin(A0 + c * u) - Math.sin(A0));
          Z = (W / c) * (-Math.cos(A0 + c * u) + Math.cos(A0));
        }
        pos.setXYZ(k, X, L.yArr[k], Z + stackZ);
      }
      pos.needsUpdate = true;
      L.geo.computeVertexNormals();
    };

    const syncReact = () => {
      setAtStart(currentIndex === 0);
      setAtEnd(currentIndex >= N);
      setZoomed(camZ < CAM_Z_DEFAULT - 0.4);
    };

    const restingTarget = (i: number) => (i < currentIndex ? -Math.PI : 0);

    const turnForward = () => {
      if (currentIndex < N) {
        currentIndex++;
        setShowTutorial(false);
        syncReact();
      }
    };
    const turnBackward = () => {
      if (currentIndex > 0) {
        currentIndex--;
        syncReact();
      }
    };
    const restart = () => {
      currentIndex = 0;
      syncReact();
    };
    apiRef.current = { forward: turnForward, back: turnBackward, restart };

    // ── Pointer interaction ─────────────────────────────────────────────────
    const el = renderer.domElement;

    // Active pointers — lets us support two-finger pinch zoom on touch devices.
    const pointers = new Map<number, { x: number; y: number }>();
    let pinching = false;
    let pinchStartDist = 0;
    let pinchStartCamZ = camZ;
    const pinchDist = () => {
      const [a, b] = [...pointers.values()];
      return Math.hypot(a.x - b.x, a.y - b.y);
    };

    const onPointerDown = (e: PointerEvent) => {
      el.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.size === 2) {
        // Second finger down → start a pinch, cancel any page drag in progress.
        pinching = true;
        pinchStartDist = pinchDist();
        pinchStartCamZ = camZ;
        dragging = false;
        dragLeaf = null;
        dragMode = null;
        setShowTutorial(false);
        return;
      }
      if (pointers.size > 2) return;

      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      dragMode = null;
      el.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      // Pinch to zoom (two fingers)
      if (pinching && pointers.size >= 2) {
        const d = pinchDist();
        if (d > 0 && pinchStartDist > 0) {
          camZ = THREE.MathUtils.clamp(pinchStartCamZ * (pinchStartDist / d), CAM_Z_MIN, CAM_Z_MAX);
          if (camZ >= CAM_Z_DEFAULT - 0.4) { panX = 0; panY = 0; }
          syncReact();
        }
        return;
      }

      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (dragMode === null && Math.abs(dx) + Math.abs(dy) > 6) {
        // Decide gesture: pan if zoomed in, otherwise turn a page.
        if (camZ < CAM_Z_DEFAULT - 0.4) {
          dragMode = "pan";
        } else {
          dragMode = "turn";
          // Which leaf? drag left → turn next forward; drag right → un-turn previous.
          if (dx < 0 && currentIndex < N) {
            dragLeaf = currentIndex;
          } else if (dx > 0 && currentIndex > 0) {
            dragLeaf = currentIndex - 1;
          } else {
            dragLeaf = null;
          }
          if (dragLeaf !== null) dragStartAngle = leaves[dragLeaf].angle;
          setShowTutorial(false);
        }
      }

      if (dragMode === "pan") {
        const k = 0.005 * (camZ / CAM_Z_DEFAULT);
        panX = THREE.MathUtils.clamp(panX - dx * k, -1.6, 1.6);
        panY = THREE.MathUtils.clamp(panY + dy * k, -1.6, 1.6);
        startX = e.clientX;
        startY = e.clientY;
      } else if (dragMode === "turn" && dragLeaf !== null) {
        // Map horizontal drag across ~half the viewport to a full flip.
        const frac = THREE.MathUtils.clamp(-dx / (width * 0.5), -1, 1);
        // For a forward leaf: 0 → -PI. For a backward leaf: -PI → 0.
        let a = dragStartAngle - frac * Math.PI;
        a = THREE.MathUtils.clamp(a, -Math.PI, 0);
        leaves[dragLeaf].angle = a;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      try { el.releasePointerCapture(e.pointerId); } catch {}

      // Finishing a pinch: don't let the remaining finger start a page drag.
      if (pinching) {
        if (pointers.size < 2) {
          pinching = false;
          dragging = false;
          dragLeaf = null;
          dragMode = null;
          el.style.cursor = "grab";
        }
        return;
      }

      dragging = false;
      el.style.cursor = "grab";
      if (dragMode === "turn" && dragLeaf !== null) {
        const p = -leaves[dragLeaf].angle / Math.PI; // 0..1
        if (dragLeaf === currentIndex) {
          // forward leaf: commit if turned past 40%
          if (p > 0.4) currentIndex = Math.min(N, currentIndex + 1);
        } else if (dragLeaf === currentIndex - 1) {
          // backward leaf: commit un-turn if pulled below 60%
          if (p < 0.6) currentIndex = Math.max(0, currentIndex - 1);
        }
        syncReact();
      }
      dragLeaf = null;
      dragMode = null;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camZ = THREE.MathUtils.clamp(camZ + e.deltaY * 0.008, CAM_Z_MIN, CAM_Z_MAX);
      if (camZ >= CAM_Z_DEFAULT - 0.4) { panX = 0; panY = 0; }
      syncReact();
    };

    const onPointerEnter = () => { hovering = true; };
    const onPointerLeave = () => { hovering = false; };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("pointerenter", onPointerEnter);
    el.addEventListener("pointerleave", onPointerLeave);
    el.addEventListener("wheel", onWheel, { passive: false });

    // ── Resize ──────────────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      width = mount.clientWidth || width;
      height = mount.clientHeight || height;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      fitCamera(); // keep the spread fully visible at any container shape
    });
    ro.observe(mount);

    // ── Render loop ─────────────────────────────────────────────────────────
    let raf = 0;
    let lastCamZ = camZ;
    const clock = new THREE.Clock();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);

      elapsed += dt;
      const prevHover = hoverEase;
      hoverEase += ((hovering ? 1 : 0) - hoverEase) * 0.12;
      const hoverActive = hoverEase > 0.003 || prevHover > 0.003;

      // entrance
      const introActive = openIntro < 1;
      if (introActive) openIntro = Math.min(1, openIntro + dt * 1.1);
      const introEase = 1 - Math.pow(1 - openIntro, 3);
      bookGroup.scale.setScalar(0.92 + 0.08 * introEase);
      bookGroup.rotation.x = (1 - introEase) * -0.25;

      // Pass 1: ease every leaf toward its resting angle and detect motion.
      let anyMoving = false;
      for (let i = 0; i < N; i++) {
        const L = leaves[i];
        const dragThis = i === dragLeaf && dragging;
        if (!dragThis) L.angle += (restingTarget(i) - L.angle) * EASE;
        if (dragThis || Math.abs(L.angle - restingTarget(i)) > 0.0006) anyMoving = true;
      }
      // Pass 2: whenever ANYTHING is animating we must re-bend ALL leaves —
      // each page's stacking depth depends on currentIndex, so a page turn
      // shifts the depth of the resting pages too (skipping them caused
      // z-fighting / wrong page on top). When only hovering, ripple just the
      // top page. When fully idle, skip everything (the cheap common case).
      const active = introActive || anyMoving || dragging;
      for (let i = 0; i < N; i++) {
        if (active || (hoverActive && !dragging && i === currentIndex)) applyLeaf(leaves[i], i);
      }

      // Spine: thin, and only visible while a cover is on screen (closed states).
      const spineTarget = currentIndex <= 0 || currentIndex >= N ? 1 : 0;
      spineMat.opacity += (spineTarget - spineMat.opacity) * 0.15;
      spine.visible = spineMat.opacity > 0.02;
      const spineMoving = Math.abs(spineMat.opacity - spineTarget) > 0.002;

      // Keep whatever is showing centered in the tab, without walking:
      //   • cover only (closed)      → center that single right page
      //   • any open spread          → center the spine (symmetric L+R pages)
      //   • back cover only (fully turned) → center that single left page
      // Mid-book the target is a constant 0, so it never drifts; it only
      // eases by half a page at the very first open and very last close.
      let desiredCenter: number;
      if (currentIndex <= 0) desiredCenter = PAGE_W / 2;       // closed cover
      else if (currentIndex >= N) desiredCenter = -PAGE_W / 2; // back cover
      else desiredCenter = 0;                                  // spread
      const desiredTargetX = desiredCenter + panX;
      const prevTX = targetX, prevTY = targetY;
      targetX += (desiredTargetX - targetX) * 0.12;
      targetY += (panY - targetY) * 0.1;

      camera.position.set(targetX, targetY, camZ);
      camera.lookAt(targetX, targetY, 0);
      const camMoving =
        Math.abs(targetX - prevTX) > 0.0004 ||
        Math.abs(targetY - prevTY) > 0.0004 ||
        Math.abs(camZ - lastCamZ) > 0.0001;
      lastCamZ = camZ;

      // Update the (expensive) shadow map only when the scene actually changes.
      renderer.shadowMap.needsUpdate =
        introActive || anyMoving || hoverActive || spineMoving || camMoving || dragging;

      renderer.render(scene, camera);
    };
    tick();

    // ── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("pointerenter", onPointerEnter);
      el.removeEventListener("pointerleave", onPointerLeave);
      el.removeEventListener("wheel", onWheel);
      disposables.forEach((d) => d.dispose?.());
      renderer.dispose();
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, []);

  return (
    <div className="relative flex-1 overflow-hidden bg-black">
      {/* 3D canvas mount */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* Tutorial overlay */}
      {showTutorial && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="pointer-events-auto flex flex-col items-center gap-4 rounded-2xl px-8 py-7 text-center"
            style={{ background: "rgba(8,16,29,0.72)", backdropFilter: "blur(10px)", border: "1px solid rgba(162,213,198,0.2)" }}>
            <span className="font-display text-[11px] tracking-[0.25em] uppercase" style={{ color: ACCENT }}>
              Como ler o livro
            </span>
            <div className="flex flex-wrap items-center justify-center gap-4 text-white/85 sm:gap-6">
              <Hint icon={<Hand className="h-5 w-5" />} label={isTouch ? "Deslize para virar" : "Arraste para virar"} />
              <Hint icon={<Search className="h-5 w-5" />} label={isTouch ? "Pinça para zoom" : "Role para zoom"} />
              <Hint icon={<MousePointer2 className="h-5 w-5" />} label={isTouch ? "Toque nas setas" : "Setas p/ navegar"} />
            </div>
            <button
              onClick={() => setShowTutorial(false)}
              className="mt-1 rounded-full px-5 py-2 font-display text-[11px] uppercase tracking-[0.18em]"
              style={{ background: ACCENT, color: "#06110c" }}
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      {/* Zoom hint */}
      {zoomed && (
        <div className="pointer-events-none absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-full px-3 py-1.5 font-display text-[9px] uppercase tracking-[0.2em]"
          style={{ background: "rgba(8,16,29,0.7)", color: ACCENT, border: "1px solid rgba(162,213,198,0.2)" }}>
          {isTouch ? "Arraste para explorar · junte os dedos para afastar" : "Arraste para explorar · role para afastar"}
        </div>
      )}

      {/* Restart button (back cover) */}
      {atEnd && (
        <div className="absolute right-6 top-1/2 z-20 -translate-y-1/2">
          <button
            onClick={() => apiRef.current?.restart()}
            className="flex items-center gap-2 rounded-full px-5 py-3 font-display text-[11px] uppercase tracking-[0.16em] transition-transform hover:scale-105"
            style={{ background: ACCENT, color: "#06110c", boxShadow: "0 10px 40px rgba(162,213,198,0.25)" }}
          >
            <RotateCcw className="h-4 w-4" />
            Voltar ao início
          </button>
        </div>
      )}

      {/* Page arrows */}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
        <button
          onClick={() => apiRef.current?.back()}
          disabled={atStart}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-opacity disabled:opacity-25"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => apiRef.current?.forward()}
          disabled={atEnd}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-opacity disabled:opacity-25"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function Hint({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "rgba(162,213,198,0.12)", color: ACCENT }}>
        {icon}
      </span>
      <span className="font-body text-[10px] text-white/70">{label}</span>
    </div>
  );
}

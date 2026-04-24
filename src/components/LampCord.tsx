import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';

const THRESHOLD = 72;
const MAX_PULL = 150;
const ROPE_REST_Y = 118; // anchor → bead resting distance (px)

export default function LampCord() {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const location = useLocation();
  const isDark = theme === 'dark';

  // bead offset from its resting position (0,0)
  const [bead, setBead] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const beadRef = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const ptrStart = useRef({ x: 0, y: 0 });
  const beadAtStart = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const toggleRef = useRef(toggleTheme);
  toggleRef.current = toggleTheme;

  const cancelAnim = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  }, []);

  const setBeadPos = useCallback((pos: { x: number; y: number }) => {
    setBead(pos);
    beadRef.current = pos;
  }, []);

  // 2D spring-back with damped oscillation on both axes
  const springBack = useCallback((fromX: number, fromY: number) => {
    cancelAnim();
    const t0 = performance.now();
    const duration = 1100;
    const tick = (now: number) => {
      const t = Math.min((now - t0) / duration, 1);
      const f = Math.exp(-5.5 * t) * (Math.cos(11 * t) + 0.28 * Math.sin(11 * t));
      setBeadPos({ x: fromX * f, y: fromY * f });
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else setBeadPos({ x: 0, y: 0 });
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [cancelAnim, setBeadPos]);

  const startDrag = useCallback((cx: number, cy: number) => {
    cancelAnim();
    dragging.current = true;
    ptrStart.current = { x: cx, y: cy };
    beadAtStart.current = { ...beadRef.current };
    setIsDragging(true);
  }, [cancelAnim]);

  const moveDrag = useCallback((cx: number, cy: number) => {
    if (!dragging.current) return;
    const dx = beadAtStart.current.x + (cx - ptrStart.current.x);
    const dy = beadAtStart.current.y + (cy - ptrStart.current.y);
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= MAX_PULL) {
      setBeadPos({ x: dx, y: dy });
    } else {
      const s = MAX_PULL / dist;
      setBeadPos({ x: dx * s, y: dy * s });
    }
  }, [setBeadPos]);

  const endDrag = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    setIsDragging(false);
    const { x, y } = beadRef.current;
    if (Math.sqrt(x * x + y * y) >= THRESHOLD) {
      // plant the burst origin at the bead's current screen position
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const rightPx = 5 * rem; // matches right: '5rem' on the container
      const originX = Math.round(window.innerWidth - rightPx + x);
      const originY = Math.round(ROPE_REST_Y + y);
      document.documentElement.style.setProperty('--vt-origin-x', `${originX}px`);
      document.documentElement.style.setProperty('--vt-origin-y', `${originY}px`);
      toggleRef.current();
    }
    springBack(x, y);
  }, [springBack]);

  useEffect(() => {
    const onPtrMove = (e: PointerEvent) => moveDrag(e.clientX, e.clientY);
    const onPtrUp = () => endDrag();
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => endDrag();

    window.addEventListener('pointermove', onPtrMove);
    window.addEventListener('pointerup', onPtrUp);
    window.addEventListener('pointercancel', onPtrUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);

    return () => {
      window.removeEventListener('pointermove', onPtrMove);
      window.removeEventListener('pointerup', onPtrUp);
      window.removeEventListener('pointercancel', onPtrUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      cancelAnim();
    };
  }, [moveDrag, endDrag, cancelAnim]);

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    startDrag(e.clientX, e.clientY);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
  };

  if (isMobile && location.pathname !== '/') return null;

  // Visual bead position (anchor at 0,0; bead rests at y=ROPE_REST_Y)
  const bx = bead.x;
  const by = Math.max(8, ROPE_REST_Y + bead.y); // clamp so bead never goes above anchor

  // Pull distance from rest for progress
  const dist = Math.sqrt(bead.x ** 2 + bead.y ** 2);
  const progress = Math.min(dist / THRESHOLD, 1);
  const nearThreshold = dist >= THRESHOLD * 0.75;

  // Cubic bezier — natural catenary sag toward gravity
  const sag = Math.max(22, Math.abs(bx) * 0.38 + 18) * (1 - Math.abs(bead.y) / (ROPE_REST_Y * 1.6));
  const sagClamped = Math.max(0, sag);
  const cp1x = bx * 0.12;
  const cp1y = sagClamped;
  const cp2x = bx * 0.88;
  const cp2y = by - sagClamped * 0.35;
  const ropePath = `M 0 0 C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${bx} ${by}`;

  // Rope colors: white in dark mode, black in light mode
  const ropeBody   = isDark ? 'rgba(255,255,255,0.42)' : 'rgba(0,0,0,0.38)';
  const ropeFiber1 = isDark ? 'rgba(255,255,255,0.90)' : 'rgba(18,18,18,0.86)';
  const ropeFiber2 = isDark ? 'rgba(200,198,188,0.62)' : 'rgba(80,72,68,0.58)';
  const ropeW = 2.2 + progress * 0.7;
  const knotColor  = isDark ? 'rgba(255,255,255,0.70)' : 'rgba(0,0,0,0.65)';

  const beadSize = 12 + progress * 4;

  return (
    <>
      <style>{`
        @keyframes lc-breathe-dark {
          0%, 100% {
            box-shadow:
              0 0 5px 2px rgba(255,210,60,0.85),
              0 0 16px 7px rgba(255,150,0,0.42),
              0 0 36px 16px rgba(255,100,0,0.16);
          }
          50% {
            box-shadow:
              0 0 10px 4px rgba(255,235,90,1),
              0 0 28px 12px rgba(255,185,10,0.70),
              0 0 60px 26px rgba(255,120,0,0.32);
          }
        }
        @keyframes lc-breathe-light {
          0%, 100% {
            box-shadow:
              0 0 5px 2px rgba(180,218,255,0.85),
              0 0 16px 7px rgba(120,180,255,0.40),
              0 0 36px 16px rgba(90,155,255,0.15);
          }
          50% {
            box-shadow:
              0 0 10px 4px rgba(215,235,255,1),
              0 0 28px 12px rgba(165,208,255,0.68),
              0 0 60px 26px rgba(115,170,255,0.30);
          }
        }
      `}</style>

      <div
        data-lamp-cord
        style={{
          position: 'fixed',
          top: 0,
          right: '5rem',
          zIndex: 98,
          width: 0,
          height: 0,
          pointerEvents: 'none',
          userSelect: 'none',
          touchAction: 'none',
          overflow: 'visible',
        }}
      >
        {/* Full rope as a single SVG cubic bezier — anchor at (0,0), bead at (bx, by) */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1,
            height: ROPE_REST_Y + MAX_PULL + 30,
            overflow: 'visible',
            pointerEvents: 'none',
          }}
        >
          {/* Ceiling anchor dot */}
          <circle cx={0} cy={0} r={2.5} fill={ropeBody} />

          {/* Rope body — shadow/thickness layer */}
          <path d={ropePath} stroke={ropeBody} strokeWidth={ropeW + 1.4}
            fill="none" strokeLinecap="round" />

          {/* Fiber strand A */}
          <path d={ropePath} stroke={ropeFiber1} strokeWidth={ropeW}
            fill="none" strokeLinecap="round"
            strokeDasharray="9 6" />

          {/* Fiber strand B — offset to interweave with A */}
          <path d={ropePath} stroke={ropeFiber2} strokeWidth={ropeW}
            fill="none" strokeLinecap="round"
            strokeDasharray="9 6" strokeDashoffset="7.5" />

          {/* Knot circle at rope end */}
          <circle cx={bx} cy={by} r={4 + progress * 1.5}
            fill={knotColor}
            stroke={ropeFiber1} strokeWidth={0.8} />
        </svg>

        {/* Draggable bead — positioned at rope end (bx, by) */}
        <div
          onPointerDown={onPointerDown}
          onTouchStart={onTouchStart}
          style={{
            position: 'absolute',
            top: by + 4 + progress * 1.5, // below the knot circle
            left: bx,
            transform: 'translate(-50%, 0)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'auto',
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none',
            padding: '2px 16px 8px',
          }}
          title={isDark ? 'Arraste para ligar a luz' : 'Arraste para apagar a luz'}
        >
          {/* Glowing light bead */}
          <div
            style={{
              width: beadSize,
              height: beadSize,
              minWidth: 20,
              minHeight: 20,
              borderRadius: '50%',
              background: isDark
                ? 'radial-gradient(circle at 38% 32%, rgba(255,250,175,1) 0%, rgba(255,208,48,1) 42%, rgba(255,142,0,0.92) 100%)'
                : 'radial-gradient(circle at 38% 32%, rgba(242,250,255,1) 0%, rgba(198,225,255,1) 42%, rgba(142,190,255,0.92) 100%)',
              animation: isDark
                ? 'lc-breathe-dark 2.2s ease-in-out infinite'
                : 'lc-breathe-light 2.8s ease-in-out infinite',
              flexShrink: 0,
            }}
          />

          {/* Hint text */}
          {nearThreshold ? (
            <div
              style={{
                marginTop: 6,
                fontSize: 7,
                color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.30)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                opacity: (progress - 0.75) / 0.25,
                whiteSpace: 'nowrap',
              }}
            >
              solte
            </div>
          ) : (
            <div
              style={{
                marginTop: 8,
                fontSize: 6.5,
                color: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.22)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                textAlign: 'center',
                lineHeight: 1.4,
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              puxe para<br />
              {isDark ? 'ligar a luz' : 'apagar a luz'}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

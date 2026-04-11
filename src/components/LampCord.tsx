import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';

const THRESHOLD = 70;
const MAX_PULL = 140;

export default function LampCord() {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const location = useLocation();
  const isDark = theme === 'dark';

  // On mobile/tablet, only show on home page
  if (isMobile && location.pathname !== '/') return null;

  const [pullY, setPullY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragging = useRef(false);
  const startY = useRef(0);
  const pullRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const toggleRef = useRef(toggleTheme);
  toggleRef.current = toggleTheme;

  const springBack = useCallback((from: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const startTime = performance.now();
    const duration = 700;

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const val = from * Math.exp(-7 * t) * (Math.cos(14 * t) + 0.4 * Math.sin(14 * t));
      setPullY(Math.max(0, val));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPullY(0);
        pullRef.current = 0;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const startDrag = useCallback((clientY: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    dragging.current = true;
    startY.current = clientY;
    pullRef.current = 0;
    setIsDragging(true);
  }, []);

  const moveDrag = useCallback((clientY: number) => {
    if (!dragging.current) return;
    const delta = Math.max(0, Math.min(MAX_PULL, clientY - startY.current));
    pullRef.current = delta;
    setPullY(delta);
  }, []);

  const endDrag = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    setIsDragging(false);
    const pulled = pullRef.current;
    if (pulled >= THRESHOLD) {
      toggleRef.current();
    }
    springBack(pulled);
  }, [springBack]);

  useEffect(() => {
    // Pointer events (covers mouse + touch on modern browsers)
    const onPointerMove = (e: PointerEvent) => moveDrag(e.clientY);
    const onPointerUp = () => endDrag();

    // Touch events as explicit fallback for older mobile browsers
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      e.preventDefault(); // prevent page scroll during cord drag
      moveDrag(e.touches[0].clientY);
    };
    const onTouchEnd = () => endDrag();

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [moveDrag, endDrag]);

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    startDrag(e.clientY);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    startDrag(e.touches[0].clientY);
  };

  const progress = Math.min(pullY / THRESHOLD, 1);
  const nearThreshold = pullY >= THRESHOLD * 0.75;

  const cordColor = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.20)';
  const stripedCord = `repeating-linear-gradient(
    to bottom,
    ${cordColor} 0px,
    ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'} 3px,
    ${cordColor} 6px
  )`;
  const beadSize = 18 + progress * 6;
  const beadBg = isDark
    ? `linear-gradient(160deg, rgba(255,255,255,${0.7 + progress * 0.25}) 0%, rgba(180,180,180,0.55) 100%)`
    : `linear-gradient(160deg, rgba(50,50,50,${0.7 + progress * 0.2}) 0%, rgba(20,20,20,0.55) 100%)`;

  return (
    <div
      data-lamp-cord
      className="flex"
      style={{
        position: 'fixed',
        top: 0,
        right: '1.25rem',
        zIndex: 98,
        flexDirection: 'column',
        alignItems: 'center',
        pointerEvents: 'none',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      {/* static attachment from top to nav */}
      <div
        style={{
          width: 1.5,
          height: '4.5rem',
          background: cordColor,
          borderRadius: 2,
        }}
      />

      {/* draggable cord + bead — expanded touch target via padding */}
      <div
        onPointerDown={onPointerDown}
        onTouchStart={onTouchStart}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'auto',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          // wider hit area on mobile without visual change
          padding: '0 16px',
        }}
        title={isDark ? 'Arraste para ligar a luz' : 'Arraste para apagar a luz'}
      >
        {/* dynamic cord */}
        <div
          style={{
            width: 1.5 + progress,
            height: 40 + pullY,
            background: stripedCord,
            borderRadius: 2,
          }}
        />

        {/* knot */}
        <div
          style={{
            width: 5 + progress * 2,
            height: 5 + progress * 2,
            borderRadius: '50%',
            background: cordColor,
            margin: '1px 0',
          }}
        />

        {/* bead — larger on mobile for easier grab */}
        <div
          style={{
            width: beadSize,
            height: beadSize,
            minWidth: 28,
            minHeight: 28,
            borderRadius: '50%',
            background: beadBg,
            boxShadow: `0 ${2 + progress * 6}px ${10 + progress * 14}px rgba(0,0,0,${0.2 + progress * 0.2}), inset 0 1px 0 rgba(255,255,255,0.3)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9 + progress * 2,
            lineHeight: 1,
            transition: 'box-shadow 0.05s',
          }}
        >
          {isDark ? '☀' : '☾'}
        </div>

        {/* release hint */}
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
            {isDark ? 'puxe para' : 'puxe para'}<br />
            {isDark ? 'ligar a luz' : 'apagar a luz'}
          </div>
        )}
      </div>
    </div>
  );
}

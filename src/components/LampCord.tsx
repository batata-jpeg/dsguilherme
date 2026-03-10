import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const THRESHOLD = 70;
const MAX_PULL = 140;

export default function LampCord() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [pullY, setPullY] = useState(0);
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
      // damped spring: decays exponentially with oscillation
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

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const delta = Math.max(0, Math.min(MAX_PULL, e.clientY - startY.current));
      pullRef.current = delta;
      setPullY(delta);
    };

    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      const pulled = pullRef.current;
      if (pulled >= THRESHOLD) {
        toggleRef.current();
      }
      springBack(pulled);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [springBack]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    e.currentTarget.setPointerCapture(e.pointerId);
    dragging.current = true;
    startY.current = e.clientY;
    pullRef.current = 0;
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
      style={{
        position: 'fixed',
        top: 0,
        right: '2.5rem',
        zIndex: 98,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pointerEvents: 'none',
        userSelect: 'none',
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

      {/* draggable cord + bead */}
      <div
        onPointerDown={onPointerDown}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'auto',
          cursor: dragging.current ? 'grabbing' : 'grab',
          touchAction: 'none',
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

        {/* bead */}
        <div
          style={{
            width: beadSize,
            height: beadSize,
            borderRadius: '50%',
            background: beadBg,
            boxShadow: `0 ${2 + progress * 6}px ${10 + progress * 14}px rgba(0,0,0,${0.2 + progress * 0.2}), inset 0 1px 0 rgba(255,255,255,0.3)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 8 + progress * 2,
            lineHeight: 1,
            transition: 'box-shadow 0.05s',
          }}
        >
          {isDark ? '☀' : '☾'}
        </div>

        {/* release hint */}
        {nearThreshold && (
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
        )}
      </div>
    </div>
  );
}

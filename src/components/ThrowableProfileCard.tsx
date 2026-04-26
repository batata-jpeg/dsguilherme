import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProfileCard from './ProfileCard';
import { useIsMobile } from '@/hooks/use-mobile';

const clamp   = (v: number, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round   = (v: number, p = 3) => parseFloat(v.toFixed(p));
const adjust  = (v: number, fMin: number, fMax: number, tMin: number, tMax: number) =>
  round(tMin + (tMax - tMin) * (v - fMin) / (fMax - fMin));
const lerp    = (a: number, b: number, t: number) => a + (b - a) * t;

interface ThrowableProfileCardProps {
  avatarUrls:     string[];
  miniAvatarUrl?: string;
  grainUrl?:      string;
  name?:          string;
  title?:         string;
  handle?:        string;
  status?:        string;
  showUserInfo?:  boolean;
  className?:     string;
}

const ThrowableProfileCard: React.FC<ThrowableProfileCardProps> = ({
  avatarUrls,
  miniAvatarUrl,
  grainUrl,
  name,
  title,
  handle,
  status,
  showUserInfo = true,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex]   = useState(0);
  const [gyroReady, setGyroReady]         = useState(false);
  const [needsIOSTap, setNeedsIOSTap]     = useState(false);
  const mainCardRef                        = useRef<HTMLDivElement>(null);
  const isMobile                           = useIsMobile();

  // ── Gyro state ──────────────────────────────────────────────────────────
  const targetRef   = useRef({ px: 50, py: 50 });
  const currentRef  = useRef({ px: 50, py: 50 });
  const rafRef      = useRef<number | null>(null);
  const neutralBeta = useRef<number | null>(null);
  const gyroOnRef   = useRef(false);

  // ── Pre-load images ──────────────────────────────────────────────────────
  useEffect(() => {
    avatarUrls.forEach(url => { const img = new Image(); img.src = url; });
  }, [avatarUrls]);

  // ── Apply CSS vars from normalised px/py (0-100) ─────────────────────────
  const applyVars = useCallback((el: HTMLElement, px: number, py: number) => {
    const wrapper = el.querySelector('.pc-card-wrapper') as HTMLElement;
    const shell   = el.querySelector('.pc-card-shell')   as HTMLElement;
    if (!wrapper || !shell) return;
    const cx = px - 50, cy = py - 50;
    wrapper.style.setProperty('--pointer-x',          `${px}%`);
    wrapper.style.setProperty('--pointer-y',          `${py}%`);
    wrapper.style.setProperty('--background-x',       `${adjust(px, 0, 100, 35, 65)}%`);
    wrapper.style.setProperty('--background-y',       `${adjust(py, 0, 100, 35, 65)}%`);
    wrapper.style.setProperty('--pointer-from-center',`${clamp(Math.hypot(cy, cx) / 50, 0, 1)}`);
    wrapper.style.setProperty('--pointer-from-top',   `${py / 100}`);
    wrapper.style.setProperty('--pointer-from-left',  `${px / 100}`);
    wrapper.style.setProperty('--rotate-x',           `${round(-(cx / 5))}deg`);
    wrapper.style.setProperty('--rotate-y',           `${round(cy  / 4)}deg`);
    shell.classList.add('active');
  }, []);

  // ── Mouse (desktop only) ─────────────────────────────────────────────────
  const setCardVars = useCallback((el: HTMLElement, clientX: number, clientY: number) => {
    const card = el.querySelector('.pc-card') as HTMLElement;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = clamp((100 / (rect.width  || 1)) * (clientX - rect.left));
    const py = clamp((100 / (rect.height || 1)) * (clientY - rect.top));
    applyVars(el, px, py);
  }, [applyVars]);

  const clearCardVars = useCallback((el: HTMLElement) => {
    const shell = el.querySelector('.pc-card-shell') as HTMLElement;
    if (shell) shell.classList.remove('active');
  }, []);

  const handleMouseMove  = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    const el = mainCardRef.current;
    if (el) setCardVars(el, e.clientX, e.clientY);
  }, [setCardVars, isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (isMobile) return;
    const el = mainCardRef.current;
    if (el) clearCardVars(el);
  }, [clearCardVars, isMobile]);

  // ── RAF lerp loop ────────────────────────────────────────────────────────
  const startLoop = useCallback(() => {
    if (rafRef.current) return;
    const tick = () => {
      const SMOOTH = 0.09; // lower = smoother/slower follow
      currentRef.current.px = lerp(currentRef.current.px, targetRef.current.px, SMOOTH);
      currentRef.current.py = lerp(currentRef.current.py, targetRef.current.py, SMOOTH);
      const el = mainCardRef.current;
      if (el) applyVars(el, currentRef.current.px, currentRef.current.py);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [applyVars]);

  const stopLoop = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  }, []);

  // ── Device orientation handler ───────────────────────────────────────────
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    const gamma = e.gamma ?? 0;   // left-right  -90…+90
    const beta  = e.beta  ?? 45;  // front-back  -180…+180

    // Calibrate neutral tilt on first reading (how user holds the phone)
    if (neutralBeta.current === null) neutralBeta.current = beta;

    // Map gamma → px:  ±60° → 5-95%
    const px = clamp(50 + gamma * 0.85, 5, 95);

    // Map beta deviation from neutral → py:  ±35° → 5-95%
    const betaDev = beta - neutralBeta.current;
    const py = clamp(50 + betaDev * 1.4, 5, 95);

    targetRef.current = { px, py };

    if (!gyroOnRef.current) {
      gyroOnRef.current = true;
      currentRef.current = { px, py }; // snap to start position instantly
      setGyroReady(true);
      startLoop();
    }
  }, [startLoop]);

  // ── Setup gyro (mobile only) ─────────────────────────────────────────────
  useEffect(() => {
    if (!isMobile) return;

    // iOS 13+ requires explicit permission
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      setNeedsIOSTap(true);
      return;
    }

    // Android / older iOS — auto-start
    window.addEventListener('deviceorientation', handleOrientation, true);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      stopLoop();
    };
  }, [isMobile, handleOrientation, stopLoop]);

  // ── iOS permission tap ───────────────────────────────────────────────────
  const requestIOSPermission = useCallback(async () => {
    try {
      const result = await (DeviceOrientationEvent as any).requestPermission();
      if (result === 'granted') {
        setNeedsIOSTap(false);
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    } catch {
      setNeedsIOSTap(false); // silently fail
    }
  }, [handleOrientation]);

  // Cleanup on unmount
  useEffect(() => () => stopLoop(), [stopLoop]);

  const goNext = useCallback(() => setCurrentIndex(p => (p + 1) % avatarUrls.length), [avatarUrls.length]);
  const goPrev = useCallback(() => setCurrentIndex(p => (p - 1 + avatarUrls.length) % avatarUrls.length), [avatarUrls.length]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        ref={mainCardRef}
        className="relative w-fit"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        /* iOS: request permission on first tap of the card area */
        onClick={needsIOSTap ? requestIOSPermission : undefined}
      >
        <ProfileCard
          avatarUrl={avatarUrls[currentIndex]}
          miniAvatarUrl={miniAvatarUrl || avatarUrls[currentIndex]}
          grainUrl={grainUrl}
          name={name}
          title={title}
          handle={handle}
          status={status}
          showUserInfo={showUserInfo}
          enableTilt={false}
          className="w-full mx-auto pointer-events-none"
        />

        {avatarUrls.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute -left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', color: 'hsl(var(--foreground))' }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goNext}
              className="absolute -right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', color: 'hsl(var(--foreground))' }}
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Hint text */}
      <motion.p
        className="text-center mt-3 font-display text-[10px] sm:text-xs tracking-[0.08em] sm:tracking-[0.15em] uppercase select-none px-2 w-full break-words"
        style={{ color: 'hsl(var(--muted-foreground))' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        {isMobile
          ? needsIOSTap
            ? '✦ Toque no card para ativar o efeito ✦'
            : gyroReady
              ? '✦ Gire o celular para interagir ✦'
              : '✦ Incline o celular para ver o efeito ✦'
          : '✦ Clique nos botões para trocar a imagem ✦'}
      </motion.p>
    </div>
  );
};

export default ThrowableProfileCard;

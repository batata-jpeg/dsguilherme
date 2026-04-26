import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProfileCard from './ProfileCard';
import { useIsMobile } from '@/hooks/use-mobile';

const clamp  = (v: number, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round  = (v: number, p = 3) => parseFloat(v.toFixed(p));
const adjust = (v: number, fMin: number, fMax: number, tMin: number, tMax: number) =>
  round(tMin + (tMax - tMin) * (v - fMin) / (fMax - fMin));

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const mainCardRef                      = useRef<HTMLDivElement>(null);
  const isMobile                         = useIsMobile();

  // iOS permission state
  const [needsIOSTap, setNeedsIOSTap]   = useState(false);

  useEffect(() => {
    avatarUrls.forEach(url => { const img = new Image(); img.src = url; });
  }, [avatarUrls]);

  // Detect if iOS permission tap is needed
  useEffect(() => {
    if (!isMobile) return;
    const anyOrientation = window.DeviceOrientationEvent as typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> };
    setNeedsIOSTap(typeof anyOrientation?.requestPermission === 'function');
  }, [isMobile]);

  // ── Desktop mouse handling ────────────────────────────────────────────────
  const setCardVars = useCallback((el: HTMLElement, clientX: number, clientY: number) => {
    const wrapper = el.querySelector('.pc-card-wrapper') as HTMLElement;
    const shell   = el.querySelector('.pc-card-shell')   as HTMLElement;
    const card    = el.querySelector('.pc-card')          as HTMLElement;
    if (!wrapper || !shell || !card) return;
    const rect = card.getBoundingClientRect();
    const px   = clamp((100 / (rect.width  || 1)) * (clientX - rect.left));
    const py   = clamp((100 / (rect.height || 1)) * (clientY - rect.top));
    const cx   = px - 50, cy = py - 50;
    wrapper.style.setProperty('--pointer-x',           `${px}%`);
    wrapper.style.setProperty('--pointer-y',           `${py}%`);
    wrapper.style.setProperty('--background-x',        `${adjust(px, 0, 100, 35, 65)}%`);
    wrapper.style.setProperty('--background-y',        `${adjust(py, 0, 100, 35, 65)}%`);
    wrapper.style.setProperty('--pointer-from-center', `${clamp(Math.hypot(cy, cx) / 50, 0, 1)}`);
    wrapper.style.setProperty('--pointer-from-top',    `${py / 100}`);
    wrapper.style.setProperty('--pointer-from-left',   `${px / 100}`);
    wrapper.style.setProperty('--rotate-x',            `${round(-(cx / 5))}deg`);
    wrapper.style.setProperty('--rotate-y',            `${round(cy  / 4)}deg`);
    shell.classList.add('active');
    wrapper.classList.add('active');
  }, []);

  const clearCardVars = useCallback((el: HTMLElement) => {
    const shell   = el.querySelector('.pc-card-shell')   as HTMLElement;
    const wrapper = el.querySelector('.pc-card-wrapper') as HTMLElement;
    if (shell)   shell.classList.remove('active');
    if (wrapper) wrapper.classList.remove('active');
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

  const goNext = useCallback(() => setCurrentIndex(p => (p + 1) % avatarUrls.length), [avatarUrls.length]);
  const goPrev = useCallback(() => setCurrentIndex(p => (p - 1 + avatarUrls.length) % avatarUrls.length), [avatarUrls.length]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        ref={mainCardRef}
        className="relative w-fit"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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
          /* Desktop: tilt disabled — handled by mouse events above.
             Mobile:  tilt enabled  — ProfileCard handles gyro internally. */
          enableTilt={isMobile}
          enableMobileTilt={isMobile}
          mobileTiltSensitivity={8}
          className={`w-full mx-auto ${isMobile ? '' : 'pointer-events-none'}`}
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
            : '✦ Gire o celular para interagir com o card ✦'
          : '✦ Clique nos botões para trocar a imagem ✦'}
      </motion.p>
    </div>
  );
};

export default ThrowableProfileCard;

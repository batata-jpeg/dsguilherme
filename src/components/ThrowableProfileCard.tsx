import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProfileCard from './ProfileCard';
import { useIsMobile } from '@/hooks/use-mobile';

const clamp = (v: number, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v: number, precision = 3) => parseFloat(v.toFixed(precision));
const adjust = (v: number, fMin: number, fMax: number, tMin: number, tMax: number) =>
  round(tMin + (tMax - tMin) * (v - fMin) / (fMax - fMin));

interface ThrowableProfileCardProps {
  avatarUrls: string[];
  miniAvatarUrl?: string;
  grainUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  showUserInfo?: boolean;
  className?: string;
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
  const mainCardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const gyroActiveRef = useRef(false);

  useEffect(() => {
    avatarUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [avatarUrls]);

  // Device orientation (gyroscope) for mobile/tablet
  useEffect(() => {
    if (!isMobile) return;
    const el = mainCardRef.current;
    if (!el) return;

    const sensitivity = 4;
    const betaOffset = 40; // typical phone holding angle

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event;
      if (beta == null || gamma == null) return;

      const wrapper = el.querySelector('.pc-card-wrapper') as HTMLElement;
      const shell = el.querySelector('.pc-card-shell') as HTMLElement;
      if (!wrapper || !shell) return;

      const card = el.querySelector('.pc-card') as HTMLElement;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const w = rect.width || 1;
      const h = rect.height || 1;

      // Map gamma (-45 to 45) → x across card, beta (offset ± 45) → y across card
      const lx = clamp(w / 2 + gamma * sensitivity, 0, w);
      const ly = clamp(h / 2 + (beta - betaOffset) * sensitivity, 0, h);

      const px = clamp((100 / w) * lx);
      const py = clamp((100 / h) * ly);
      const cx = px - 50;
      const cy = py - 50;

      wrapper.style.setProperty('--pointer-x', `${px}%`);
      wrapper.style.setProperty('--pointer-y', `${py}%`);
      wrapper.style.setProperty('--background-x', `${adjust(px, 0, 100, 35, 65)}%`);
      wrapper.style.setProperty('--background-y', `${adjust(py, 0, 100, 35, 65)}%`);
      wrapper.style.setProperty('--pointer-from-center', `${clamp(Math.hypot(py - 50, px - 50) / 50, 0, 1)}`);
      wrapper.style.setProperty('--pointer-from-top', `${py / 100}`);
      wrapper.style.setProperty('--pointer-from-left', `${px / 100}`);
      wrapper.style.setProperty('--rotate-x', `${round(-(cx / 5))}deg`);
      wrapper.style.setProperty('--rotate-y', `${round(cy / 4)}deg`);
      shell.classList.add('active');
    };

    const enableGyro = () => {
      if (gyroActiveRef.current) return;
      const anyMotion = window.DeviceMotionEvent as typeof DeviceMotionEvent & { requestPermission?: () => Promise<string> };
      if (anyMotion && typeof anyMotion.requestPermission === 'function') {
        anyMotion.requestPermission().then((state) => {
          if (state === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
            gyroActiveRef.current = true;
          }
        }).catch(console.error);
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
        gyroActiveRef.current = true;
      }
    };

    // Auto-enable on non-iOS, tap-to-enable on iOS (permission required)
    const anyMotion = window.DeviceMotionEvent as typeof DeviceMotionEvent & { requestPermission?: () => Promise<string> };
    if (anyMotion && typeof anyMotion.requestPermission === 'function') {
      // iOS: need user gesture
      el.addEventListener('click', enableGyro);
    } else {
      enableGyro();
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      el.removeEventListener('click', enableGyro);
      gyroActiveRef.current = false;
    };
  }, [isMobile]);

  const setCardVars = useCallback((el: HTMLElement, clientX: number, clientY: number) => {
    const wrapper = el.querySelector('.pc-card-wrapper') as HTMLElement;
    const shell = el.querySelector('.pc-card-shell') as HTMLElement;
    const card = el.querySelector('.pc-card') as HTMLElement;
    if (!wrapper || !shell || !card) return;
    const rect = card.getBoundingClientRect();
    const lx = clientX - rect.left;
    const ly = clientY - rect.top;
    const w = rect.width || 1;
    const h = rect.height || 1;
    const px = clamp((100 / w) * lx);
    const py = clamp((100 / h) * ly);
    const cx = px - 50;
    const cy = py - 50;
    wrapper.style.setProperty('--pointer-x', `${px}%`);
    wrapper.style.setProperty('--pointer-y', `${py}%`);
    wrapper.style.setProperty('--background-x', `${adjust(px, 0, 100, 35, 65)}%`);
    wrapper.style.setProperty('--background-y', `${adjust(py, 0, 100, 35, 65)}%`);
    wrapper.style.setProperty('--pointer-from-center', `${clamp(Math.hypot(py - 50, px - 50) / 50, 0, 1)}`);
    wrapper.style.setProperty('--pointer-from-top', `${py / 100}`);
    wrapper.style.setProperty('--pointer-from-left', `${px / 100}`);
    wrapper.style.setProperty('--rotate-x', `${round(-(cx / 5))}deg`);
    wrapper.style.setProperty('--rotate-y', `${round(cy / 4)}deg`);
    shell.classList.add('active');
  }, []);

  const clearCardVars = useCallback((el: HTMLElement) => {
    const shell = el.querySelector('.pc-card-shell') as HTMLElement;
    if (shell) shell.classList.remove('active');
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = mainCardRef.current;
    if (el) setCardVars(el, e.clientX, e.clientY);
  }, [setCardVars]);

  const handleMouseLeave = useCallback(() => {
    const el = mainCardRef.current;
    if (el) clearCardVars(el);
  }, [clearCardVars]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % avatarUrls.length);
  }, [avatarUrls.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + avatarUrls.length) % avatarUrls.length);
  }, [avatarUrls.length]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mainCardRef}
        className="relative"
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
          enableTilt={false}
          className="w-full mx-auto pointer-events-none"
        />

        {avatarUrls.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute -left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'hsl(var(--foreground))',
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goNext}
              className="absolute -right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'hsl(var(--foreground))',
              }}
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      <motion.p
        className="text-center mt-3 font-display text-xs tracking-[0.15em] uppercase select-none"
        style={{ color: 'hsl(var(--muted-foreground))' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        ✦ Clique nos botões para trocar a imagem ✦
      </motion.p>

      {isMobile && (
        <motion.p
          className="text-center mt-2 font-display text-[10px] tracking-[0.12em] uppercase select-none"
          style={{ color: 'hsl(var(--muted-foreground))' }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: [0, 0.6, 0.3, 0.6], y: 0 }}
          transition={{ delay: 2.2, duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
        >
          📱 Mova o celular para ver o efeito 3D
        </motion.p>
      )}
    </div>
  );
};

export default ThrowableProfileCard;


import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProfileCard from './ProfileCard';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  // iOS permission state
  const [needsIOSTap, setNeedsIOSTap] = useState(false);

  useEffect(() => {
    avatarUrls.forEach(url => { const img = new Image(); img.src = url; });
  }, [avatarUrls]);

  useEffect(() => {
    if (!isMobile) return;
    const anyOri = window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<string>;
    };
    setNeedsIOSTap(typeof anyOri?.requestPermission === 'function');
  }, [isMobile]);

  const goNext = useCallback(() => setCurrentIndex(p => (p + 1) % avatarUrls.length), [avatarUrls.length]);
  const goPrev = useCallback(() => setCurrentIndex(p => (p - 1 + avatarUrls.length) % avatarUrls.length), [avatarUrls.length]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative w-fit">
        <ProfileCard
          avatarUrl={avatarUrls[currentIndex]}
          miniAvatarUrl={miniAvatarUrl || avatarUrls[currentIndex]}
          grainUrl={grainUrl}
          name={name}
          title={title}
          handle={handle}
          status={status}
          showUserInfo={showUserInfo}
          enableTilt={true}
          enableMobileTilt={isMobile}
          mobileTiltSensitivity={5}
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
            ? '✦ Toque no card para ativar o giroscópio ✦'
            : '✦ Gire o celular para interagir com o card ✦'
          : '✦ Passe o mouse sobre o card para o efeito ✦'}
      </motion.p>
    </div>
  );
};

export default ThrowableProfileCard;

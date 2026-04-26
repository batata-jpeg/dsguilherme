import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProfileCard from './ProfileCard';

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

  useEffect(() => {
    avatarUrls.forEach(url => { const img = new Image(); img.src = url; });
  }, [avatarUrls]);

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
          enableMobileTilt={false}
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
    </div>
  );
};

export default ThrowableProfileCard;

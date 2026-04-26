import React, { useCallback, useMemo } from 'react';
import './ProfileCard.css';

const DEFAULT_INNER_GRADIENT = 'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)';

interface ProfileCardProps {
  avatarUrl?:         string;
  iconUrl?:           string;
  grainUrl?:          string;
  innerGradient?:     string;
  behindGlowEnabled?: boolean;
  behindGlowColor?:   string;
  behindGlowSize?:    string;
  className?:         string;
  miniAvatarUrl?:     string;
  name?:              string;
  title?:             string;
  handle?:            string;
  status?:            string;
  contactText?:       string;
  showUserInfo?:      boolean;
  onContactClick?:    () => void;
}

const ProfileCardComponent: React.FC<ProfileCardProps> = ({
  avatarUrl = '',
  iconUrl = '',
  grainUrl = '',
  innerGradient,
  behindGlowEnabled = true,
  behindGlowColor,
  behindGlowSize,
  className = '',
  miniAvatarUrl,
  name = 'Designer',
  title = 'Creative Director',
  handle = 'designer',
  status = 'Online',
  contactText = 'Contact',
  showUserInfo = true,
  onContactClick,
}) => {
  const cardStyle = useMemo(() => ({
    '--icon':             iconUrl   ? `url(${iconUrl})`   : 'none',
    '--grain':            grainUrl  ? `url(${grainUrl})`  : 'none',
    '--inner-gradient':   innerGradient ?? DEFAULT_INNER_GRADIENT,
    '--behind-glow-color': behindGlowColor ?? 'rgba(125, 190, 255, 0.67)',
    '--behind-glow-size':  behindGlowSize  ?? '50%',
  }) as React.CSSProperties, [iconUrl, grainUrl, innerGradient, behindGlowColor, behindGlowSize]);

  const handleContactClick = useCallback(() => {
    onContactClick?.();
  }, [onContactClick]);

  return (
    <div className={`pc-card-wrapper ${className}`} style={cardStyle}>
      {behindGlowEnabled && <div className="pc-behind" />}
      <div className="pc-card-shell">
        <div className="pc-card">
          <div className="pc-inside" />

          {/* Avatar */}
          <div className="pc-content pc-avatar-content">
            <img
              className="avatar"
              src={avatarUrl}
              alt={name}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            {showUserInfo && (
              <div className="pc-user-info">
                <div className="pc-user-details">
                  <div className="pc-mini-avatar">
                    <img
                      src={miniAvatarUrl || avatarUrl}
                      alt={name}
                      onError={(e) => {
                        const t = e.target as HTMLImageElement;
                        t.style.opacity = '0.5';
                        t.src = avatarUrl;
                      }}
                    />
                  </div>
                  <div className="pc-user-text">
                    <div className="pc-handle">@{handle}</div>
                    <div className="pc-status">{status}</div>
                  </div>
                </div>
                <button className="pc-contact-btn" onClick={handleContactClick}>
                  {contactText}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;

import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import './ProfileCard.css';

const DEFAULT_INNER_GRADIENT = 'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)';

const ANIMATION_CONFIG = {
  INITIAL_DURATION:    1200,
  INITIAL_X_OFFSET:    70,
  INITIAL_Y_OFFSET:    60,
  ENTER_TRANSITION_MS: 180,
};

const clamp  = (v: number, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round  = (v: number, p = 3)              => parseFloat(v.toFixed(p));
const adjust = (v: number, fMin: number, fMax: number, tMin: number, tMax: number) =>
  round(tMin + (tMax - tMin) * (v - fMin) / (fMax - fMin));

interface ProfileCardProps {
  avatarUrl?:             string;
  iconUrl?:               string;
  grainUrl?:              string;
  innerGradient?:         string;
  behindGlowEnabled?:     boolean;
  behindGlowColor?:       string;
  behindGlowSize?:        string;
  className?:             string;
  enableTilt?:            boolean;
  enableMobileTilt?:      boolean;
  mobileTiltSensitivity?: number;
  miniAvatarUrl?:         string;
  name?:                  string;
  title?:                 string;
  handle?:                string;
  status?:                string;
  contactText?:           string;
  showUserInfo?:          boolean;
  onContactClick?:        () => void;
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
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = 'Designer',
  title = 'Creative Director',
  handle = 'designer',
  status = 'Online',
  contactText = 'Contact',
  showUserInfo = true,
  onContactClick,
}) => {
  const wrapRef        = useRef<HTMLDivElement>(null);
  const shellRef       = useRef<HTMLDivElement>(null);
  const enterTimerRef  = useRef<number | null>(null);
  const leaveRafRef    = useRef<number | null>(null);
  const neutralBetaRef = useRef<number | null>(null);

  // ── Tilt engine (lerp RAF) ────────────────────────────────────────────────
  const tiltEngine = useMemo(() => {
    if (!enableTilt) return null;

    let rafId: number | null = null;
    let running = false;
    let lastTs  = 0;
    let currentX = 0, currentY = 0;
    let targetX  = 0, targetY  = 0;
    const DEFAULT_TAU = 0.14;
    const INITIAL_TAU = 0.6;
    let initialUntil  = 0;

    const setVarsFromXY = (x: number, y: number) => {
      const shell = shellRef.current;
      const wrap  = wrapRef.current;
      if (!shell || !wrap) return;
      const w  = shell.clientWidth  || 1;
      const h  = shell.clientHeight || 1;
      const px = clamp((100 / w) * x);
      const py = clamp((100 / h) * y);
      const cx = px - 50, cy = py - 50;
      const props: Record<string, string> = {
        '--pointer-x':           `${px}%`,
        '--pointer-y':           `${py}%`,
        '--background-x':        `${adjust(px, 0, 100, 35, 65)}%`,
        '--background-y':        `${adjust(py, 0, 100, 35, 65)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(py - 50, px - 50) / 50, 0, 1)}`,
        '--pointer-from-top':    `${py / 100}`,
        '--pointer-from-left':   `${px / 100}`,
        '--rotate-x':            `${round(-(cx / 5))}deg`,
        '--rotate-y':            `${round(cy  / 4)}deg`,
      };
      for (const [k, v] of Object.entries(props)) wrap.style.setProperty(k, v);
    };

    const step = (ts: number) => {
      if (!running) return;
      if (lastTs === 0) lastTs = ts;
      const dt  = (ts - lastTs) / 1000;
      lastTs    = ts;
      const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
      const k   = 1 - Math.exp(-dt / tau);
      currentX += (targetX - currentX) * k;
      currentY += (targetY - currentY) * k;
      setVarsFromXY(currentX, currentY);
      const far = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;
      if (far || document.hasFocus()) {
        rafId = requestAnimationFrame(step);
      } else {
        running = false; lastTs = 0;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      }
    };

    const start = () => {
      if (running) return;
      running = true; lastTs = 0;
      rafId = requestAnimationFrame(step);
    };

    return {
      setImmediate(x: number, y: number) { currentX = x; currentY = y; setVarsFromXY(x, y); },
      setTarget(x: number, y: number)    { targetX  = x; targetY  = y; start(); },
      toCenter() {
        const s = shellRef.current;
        if (s) this.setTarget(s.clientWidth / 2, s.clientHeight / 2);
      },
      beginInitial(ms: number) { initialUntil = performance.now() + ms; start(); },
      getCurrent()              { return { x: currentX, y: currentY, tx: targetX, ty: targetY }; },
      cancel() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null; running = false; lastTs = 0;
      },
    };
  }, [enableTilt]);

  // ── Desktop mouse handlers (mouse-only, ignores touch/pen) ───────────────
  const handlePointerEnter = useCallback((event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    const shell = shellRef.current;
    const wrap  = wrapRef.current;
    if (!shell || !tiltEngine) return;
    shell.classList.add('active', 'entering');
    wrap?.classList.add('active');
    if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
    enterTimerRef.current = window.setTimeout(
      () => shell.classList.remove('entering'),
      ANIMATION_CONFIG.ENTER_TRANSITION_MS,
    );
    const rect = shell.getBoundingClientRect();
    tiltEngine.setTarget(event.clientX - rect.left, event.clientY - rect.top);
  }, [tiltEngine]);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    const shell = shellRef.current;
    if (!shell || !tiltEngine) return;
    const rect = shell.getBoundingClientRect();
    tiltEngine.setTarget(event.clientX - rect.left, event.clientY - rect.top);
  }, [tiltEngine]);

  const handlePointerLeave = useCallback((event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    const shell = shellRef.current;
    const wrap  = wrapRef.current;
    if (!shell || !tiltEngine) return;
    tiltEngine.toCenter();
    const checkSettle = () => {
      const { x, y, tx, ty } = tiltEngine.getCurrent();
      if (Math.hypot(tx - x, ty - y) < 0.6) {
        shell.classList.remove('active');
        wrap?.classList.remove('active');
        leaveRafRef.current = null;
      } else {
        leaveRafRef.current = requestAnimationFrame(checkSettle);
      }
    };
    if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
    leaveRafRef.current = requestAnimationFrame(checkSettle);
  }, [tiltEngine]);

  // ── Gyroscope handler (mobile/tablet) ────────────────────────────────────
  const handleDeviceOrientation = useCallback((event: DeviceOrientationEvent) => {
    const shell = shellRef.current;
    const wrap  = wrapRef.current;
    if (!shell || !tiltEngine) return;
    const { beta, gamma } = event;
    if (beta == null || gamma == null) return;
    // Calibrate neutral angle on first reading
    if (neutralBetaRef.current === null) neutralBetaRef.current = beta;
    shell.classList.add('active');
    wrap?.classList.add('active');
    const betaDev = beta - neutralBetaRef.current;
    const x = clamp(shell.clientWidth  / 2 + gamma   * mobileTiltSensitivity, 0, shell.clientWidth);
    const y = clamp(shell.clientHeight / 2 + betaDev * mobileTiltSensitivity, 0, shell.clientHeight);
    tiltEngine.setTarget(x, y);
  }, [tiltEngine, mobileTiltSensitivity]);

  // ── Wire up all listeners ─────────────────────────────────────────────────
  useEffect(() => {
    if (!enableTilt || !tiltEngine) return;
    const shell = shellRef.current;
    if (!shell) return;

    shell.addEventListener('pointerenter', handlePointerEnter as EventListener);
    shell.addEventListener('pointermove',  handlePointerMove  as EventListener);
    shell.addEventListener('pointerleave', handlePointerLeave as EventListener);

    // Gyroscope — Android auto-starts; iOS needs a tap
    const anyOri = window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<string>;
    };
    const needsPermission = typeof anyOri?.requestPermission === 'function';

    if (enableMobileTilt && !needsPermission) {
      window.addEventListener('deviceorientation', handleDeviceOrientation as EventListener, true);
    }

    const handleClick = () => {
      if (!enableMobileTilt || !needsPermission) return;
      anyOri.requestPermission!()
        .then(state => {
          if (state === 'granted')
            window.addEventListener('deviceorientation', handleDeviceOrientation as EventListener, true);
        })
        .catch(console.error);
    };
    shell.addEventListener('click', handleClick);

    // Initial "fly-in" animation
    const iX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const iY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
    tiltEngine.setImmediate(iX, iY);
    tiltEngine.toCenter();
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

    return () => {
      shell.removeEventListener('pointerenter', handlePointerEnter as EventListener);
      shell.removeEventListener('pointermove',  handlePointerMove  as EventListener);
      shell.removeEventListener('pointerleave', handlePointerLeave as EventListener);
      shell.removeEventListener('click', handleClick);
      window.removeEventListener('deviceorientation', handleDeviceOrientation as EventListener, true);
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      if (leaveRafRef.current)   cancelAnimationFrame(leaveRafRef.current);
      tiltEngine.cancel();
      shell.classList.remove('entering');
    };
  }, [enableTilt, enableMobileTilt, tiltEngine, handlePointerEnter, handlePointerMove, handlePointerLeave, handleDeviceOrientation]);

  const cardStyle = useMemo(() => ({
    '--icon':              iconUrl  ? `url(${iconUrl})`  : 'none',
    '--grain':             grainUrl ? `url(${grainUrl})` : 'none',
    '--inner-gradient':    innerGradient ?? DEFAULT_INNER_GRADIENT,
    '--behind-glow-color': behindGlowColor ?? 'rgba(125, 190, 255, 0.67)',
    '--behind-glow-size':  behindGlowSize  ?? '50%',
  }) as React.CSSProperties, [iconUrl, grainUrl, innerGradient, behindGlowColor, behindGlowSize]);

  const handleContactClick = useCallback(() => { onContactClick?.(); }, [onContactClick]);

  return (
    <div ref={wrapRef} className={`pc-card-wrapper ${className}`.trim()} style={cardStyle}>
      {behindGlowEnabled && <div className="pc-behind" />}
      <div ref={shellRef} className="pc-card-shell">
        <div className="pc-card">
          <div className="pc-inside">
            <div className="pc-shine" />
            <div className="pc-glare" />
            <div className="pc-content pc-avatar-content">
              <img
                className="avatar"
                src={avatarUrl}
                alt={name}
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              {showUserInfo && (
                <div className="pc-user-info">
                  <div className="pc-user-details">
                    <div className="pc-mini-avatar">
                      <img
                        src={miniAvatarUrl || avatarUrl}
                        alt={name}
                        loading="lazy"
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
                  <button
                    className="pc-contact-btn"
                    onClick={handleContactClick}
                    type="button"
                    style={{ pointerEvents: 'auto' }}
                    aria-label={`Contact ${name}`}
                  >
                    {contactText}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;

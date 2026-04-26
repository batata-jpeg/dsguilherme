import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpotlightCard from './SpotlightCard';
import './HardwareAccelPopup.css';


interface BrowserInfo {
  name:  string;
  url:   string | null;
  steps: string[];
}

function detectBrowser(): BrowserInfo {
  const ua = navigator.userAgent;

  if (ua.includes('Edg/'))
    return {
      name:  'Microsoft Edge',
      url:   'edge://settings/system',
      steps: ['Cole o endereço acima na barra do navegador', 'Ative "Usar aceleração de hardware quando disponível"', 'Clique em Reiniciar'],
    };

  if ((navigator as Navigator & { brave?: { isBrave: () => Promise<boolean> } }).brave)
    return {
      name:  'Brave',
      url:   'brave://settings/system',
      steps: ['Cole o endereço acima na barra do navegador', 'Ative "Usar aceleração de hardware quando disponível"', 'Clique em Reiniciar'],
    };

  if (ua.includes('OPR/') || ua.includes('Opera'))
    return {
      name:  'Opera',
      url:   'opera://settings/system',
      steps: ['Cole o endereço acima na barra do navegador', 'Ative "Usar aceleração de hardware quando disponível"', 'Clique em Reiniciar'],
    };

  if (ua.includes('Firefox'))
    return {
      name:  'Firefox',
      url:   'about:preferences#general',
      steps: ['Cole o endereço acima na barra do navegador', 'Role até "Desempenho"', 'Ative "Usar aceleração de hardware quando disponível"'],
    };

  if (ua.includes('Chrome'))
    return {
      name:  'Google Chrome',
      url:   'chrome://settings/system',
      steps: ['Cole o endereço acima na barra do navegador', 'Ative "Usar aceleração de hardware quando disponível"', 'Clique em Reiniciar'],
    };

  // Safari / unknown
  return {
    name:  'Safari',
    url:   null,
    steps: ['Abra as Preferências do Safari (⌘ + ,)', 'Vá em "Avançado"', 'Marque "Usar aceleração de hardware"'],
  };
}

// ─── Browser window mockup with animated toggle ───────────────────────────
function BrowserMockup({ url }: { url: string | null }) {
  return (
    <div className="hw-mockup">
      {/* Title bar */}
      <div className="hw-mockup-bar">
        <span className="hw-dot hw-dot-red"   />
        <span className="hw-dot hw-dot-yellow"/>
        <span className="hw-dot hw-dot-green" />
        <span className="hw-mockup-url">{url ?? 'Configurações do navegador'}</span>
      </div>
      {/* Settings row */}
      <div className="hw-mockup-body">
        <div className="hw-setting-row">
          <div className="hw-setting-text">
            <span className="hw-setting-label">Aceleração de hardware</span>
            <span className="hw-setting-sub">Melhora o desempenho de animações e gráficos</span>
          </div>
          <div className="hw-toggle-track">
            <div className="hw-toggle-knob" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main popup ───────────────────────────────────────────────────────────
export default function HardwareAccelPopup() {
  const [visible,  setVisible]  = useState(false);
  const [copied,   setCopied]   = useState(false);
  const [browser,  setBrowser]  = useState<BrowserInfo | null>(null);

  useEffect(() => {
    // Only show on desktop
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) return;

    setBrowser(detectBrowser());
    // Small delay so the page renders first
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!browser?.url) return;
    try {
      await navigator.clipboard.writeText(browser.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback — select text
    }
  }, [browser]);

  if (!browser) return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            className="hw-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={dismiss}
          />

          {/* Card */}
          <motion.div
            key="popup"
            className="hw-popup-wrapper"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.92, y: 16  }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            <SpotlightCard className="hw-card" spotlightColor="rgba(139,92,246,0.18)">

              {/* Header */}
              <div className="hw-header">
                <div className="hw-icon-wrap">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <div>
                  <h2 className="hw-title">Ative a aceleração de hardware</h2>
                  <p className="hw-subtitle">Para uma experiência mais imersiva</p>
                </div>
              </div>

              {/* Description */}
              <p className="hw-desc">
                Este portfólio usa <strong>animações 3D</strong>, efeitos interativos e
                gráficos avançados. Ativar a aceleração de hardware no seu navegador
                garante tudo rodando de forma fluida e sem travamentos.
              </p>

              {/* Browser mockup animation */}
              <BrowserMockup url={browser.url} />

              {/* Steps */}
              <div className="hw-steps">
                {browser.steps.map((step, i) => (
                  <div key={i} className="hw-step">
                    <span className="hw-step-num">{i + 1}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              {/* URL copy row */}
              {browser.url && (
                <div className="hw-url-row">
                  <code className="hw-url-code">{browser.url}</code>
                  <button className="hw-copy-btn" onClick={handleCopy} type="button">
                    {copied ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        Copiado!
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        Copiar
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Actions */}
              <div className="hw-actions">
                <button
                  className="hw-btn-primary"
                  type="button"
                  onClick={handleCopy}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  {browser.url ? 'Copiar endereço das configurações' : 'Entendido'}
                </button>
                <button
                  className="hw-btn-secondary"
                  type="button"
                  onClick={dismiss}
                >
                  Não preciso disso
                </button>
              </div>

              {/* Detected browser badge */}
              <p className="hw-browser-badge">
                Navegador detectado: <strong>{browser.name}</strong>
              </p>

            </SpotlightCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

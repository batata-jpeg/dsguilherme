import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { MessageCircle, Mail, Linkedin } from "lucide-react";
import GooeyNav from "@/components/GooeyNav";
import BotoesHome from "@/components/BotoesHome";
import Hero from "@/components/Hero";
import QuoteBand from "@/components/QuoteBand";
import { useLanguage } from "@/contexts/LanguageContext";
import { MAILTO_HREF, SOCIAL, WHATSAPP_CHAT_URL } from "@/config/links";

function FadeInSection({ children, delay = 0, className = "" }: {children: React.ReactNode;delay?: number;className?: string;}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}>
      
      {children}
    </motion.div>);

}

export default function Index() {
  const { t } = useLanguage();

  return (
    <>
    <div className="min-h-screen overflow-x-hidden dot-grid bg-transparent">
      {/* ── HERO */}
      <Hero />

      {/* ── PHILOSOPHY */}
      <QuoteBand />

      {/* ── BOTOES HOME (local only — nao commitar sem querer publicar) */}
      <BotoesHome />

      {/* ── CONTACT CTA */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <FadeInSection>
            <span className="section-label justify-center mb-6 flex">{t("index.cta.label")}</span>
            <p className="font-body text-base sm:text-lg mb-10 mx-auto max-w-md" style={{ color: "hsl(var(--muted-foreground))" }}>
              {t("index.cta.body")}
            </p>
            <GooeyNav
              items={[
                { label: "WhatsApp", href: WHATSAPP_CHAT_URL, icon: <MessageCircle className="w-5 h-5 shrink-0" />, external: true },
                { label: t("contact.email.cta"), href: MAILTO_HREF, icon: <Mail className="w-5 h-5 shrink-0" /> },
                { label: t("contact.linkedin.cta"), href: SOCIAL.linkedin, icon: <Linkedin className="w-5 h-5 shrink-0" />, external: true },
              ]}
              particleCount={15}
              particleDistances={[90, 10]}
              particleR={100}
              animationTime={600}
              timeVariance={300}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />
            <p className="font-body text-sm mt-8" style={{ color: "hsl(var(--muted-foreground))" }}>
              <Link to="/contact" className="underline underline-offset-4 hover:opacity-90 transition-opacity">
                {t("index.cta.formLink")}
              </Link>
            </p>
          </FadeInSection>
        </div>
      </section>
    </div>
    </>
  );

}
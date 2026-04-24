import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { motion, useInView } from "framer-motion";
import { Send, Mail, Instagram, Linkedin, Github, MapPin, Clock, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import BehanceIcon from "@/components/icons/BehanceIcon";
import {
  CONTACT_EMAIL,
  MAILTO_HREF,
  SOCIAL,
  WHATSAPP_CHAT_URL,
  socialHandleFromUrl,
} from "@/config/links";

function FadeInSection({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const socialRows = [
  {
    icon: Instagram,
    labelKey: "Instagram",
    href: SOCIAL.instagram,
    handle: socialHandleFromUrl(SOCIAL.instagram, "instagram"),
  },
  {
    icon: Linkedin,
    labelKey: "LinkedIn",
    href: SOCIAL.linkedin,
    handle: socialHandleFromUrl(SOCIAL.linkedin, "linkedin"),
  },
  {
    icon: BehanceIcon,
    labelKey: "Behance",
    href: SOCIAL.behance,
    handle: socialHandleFromUrl(SOCIAL.behance, "behance"),
  },
  {
    icon: Github,
    labelKey: "GitHub",
    href: SOCIAL.github,
    handle: socialHandleFromUrl(SOCIAL.github, "github"),
  },
] as const;

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [focused, setFocused] = useState<string | null>(null);

  const services = [
    t("svc.brand"),
    t("svc.motion"),
    t("svc.3d"),
    t("svc.ui"),
    t("svc.packaging"),
    t("svc.direction"),
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          service: form.service,
          message: form.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(() => setStatus("sent"))
      .catch(() => setStatus("idle"));
  };

  const inputStyle = (name: string) => ({
    background: focused === name ? "hsl(var(--input))" : "hsl(var(--background))",
    border: `1px solid ${focused === name ? "hsl(var(--ring))" : "hsl(var(--border))"}`,
    boxShadow: focused === name ? "0 0 0 3px hsl(var(--ring) / 0.15)" : "none",
    color: "hsl(var(--foreground))",
    borderRadius: "10px",
    padding: "14px 16px",
    width: "100%",
    fontFamily: "var(--font-body)",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.2s ease",
  });

  return (
    <div className="min-h-screen dot-grid bg-transparent overflow-x-hidden">
      <div className="relative pt-20 sm:pt-24 pb-14 sm:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeInSection>
            <span className="section-label block mb-6">{t("contact.label")}</span>
            <h1
              className="font-display font-extrabold uppercase leading-[0.85] mb-6"
              style={{ fontSize: "clamp(2.5rem, 7vw, 7rem)" }}
            >
              {t("contact.h1a")}
              <br />
              <span className="gradient-text">{t("contact.h1b")}</span>
            </h1>
            <p className="font-body text-base sm:text-xl max-w-lg" style={{ color: "hsl(var(--muted-foreground))" }}>
              {t("contact.description")}
            </p>
          </FadeInSection>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">
          <FadeInSection delay={0.1} className="lg:col-span-3 space-y-6">
            <div className="glass-panel p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ background: "hsl(var(--primary))" }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{ background: "hsl(var(--primary))" }}
                  />
                </span>
                <span className="font-display text-xs tracking-[0.2em] uppercase" style={{ color: "hsl(var(--primary))" }}>
                  {t("contact.available")}
                </span>
              </div>
              <p className="font-body text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                {t("contact.available.body")}
              </p>
              <div
                className="flex items-center gap-2 text-xs font-display tracking-[0.1em] uppercase"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                <Clock className="w-3 h-3 shrink-0" />
                {t("contact.response")}
              </div>
              <div
                className="flex items-center gap-2 text-xs font-display tracking-[0.1em] uppercase"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                <MapPin className="w-3 h-3 shrink-0" />
                {t("contact.location")}
              </div>
              <a
                href={MAILTO_HREF}
                className="flex items-center gap-2 text-xs font-display tracking-[0.1em] uppercase break-all hover:opacity-90"
                style={{ color: "hsl(var(--foreground))" }}
              >
                <Mail className="w-3 h-3 shrink-0" style={{ color: "hsl(var(--primary))" }} />
                {CONTACT_EMAIL}
              </a>
            </div>

            <div className="glass-panel p-8 md:p-10 space-y-6">
              <div>
                <span className="section-label block mb-3">{t("contact.quick.label")}</span>
                <p className="font-body text-base max-w-xl" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {t("contact.quick.subtitle")}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <a
                  href={WHATSAPP_CHAT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass-primary w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 py-5 px-4 text-sm md:text-base text-center sm:text-left"
                >
                  <MessageCircle className="w-6 h-6 shrink-0" />
                  <span className="min-w-0">
                    <span className="block font-display tracking-[0.12em] uppercase">{t("contact.whatsapp.title")}</span>
                    <span className="block font-body text-xs font-normal normal-case tracking-normal opacity-90 mt-0.5">
                      {t("contact.whatsapp.body")}
                    </span>
                  </span>
                </a>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a href={MAILTO_HREF} className="btn-glass-secondary w-full justify-center py-4 text-sm gap-2">
                    <Mail className="w-5 h-5 shrink-0" />
                    {t("contact.email.cta")}
                  </a>
                  <a
                    href={SOCIAL.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glass-secondary w-full justify-center py-4 text-sm gap-2"
                  >
                    <Linkedin className="w-5 h-5 shrink-0" />
                    {t("contact.linkedin.cta")}
                  </a>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 space-y-4">
              <span className="section-label">{t("contact.services.label")}</span>
              <div className="flex flex-wrap gap-2">
                {services.map((svc) => (
                  <div
                    key={svc}
                    className="glass-panel-sm font-display text-xs tracking-[0.1em] uppercase px-3 py-2 rounded-xl transition-all duration-200"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {svc}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 space-y-4">
              <span className="section-label">{t("contact.socials.label")}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {socialRows.map((row) => {
                  const Icon = row.icon;
                  return (
                    <a
                      key={row.labelKey}
                      href={row.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 group transition-all duration-200 glass-panel-sm p-3 rounded-xl hover:border-primary/40"
                    >
                      <div className="glass-panel-sm p-2 shrink-0 group-hover:border-primary/40 transition-colors duration-200">
                        <Icon className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-display text-xs tracking-[0.1em] uppercase" style={{ color: "hsl(var(--foreground))" }}>
                          {row.labelKey}
                        </div>
                        <div className="font-body text-xs truncate" style={{ color: "hsl(var(--muted-foreground))" }}>
                          {row.handle}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.2} className="lg:col-span-2">
            <div className="glass-panel p-6 md:p-8 lg:sticky lg:top-28">
              <p className="font-body text-xs mb-4 leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                {t("contact.form.secondaryHint")}
              </p>
              {status === "sent" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center gap-6"
                >
                  <div className="w-20 h-20 rounded-full flex items-center justify-center glass-panel">
                    <Send className="w-8 h-8" style={{ color: "hsl(var(--primary))" }} />
                  </div>
                  <h3 className="font-display font-bold text-2xl uppercase">{t("contact.form.sent.title")}</h3>
                  <p className="font-body" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {t("contact.form.sent.body")}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <span className="section-label block mb-8">{t("contact.form.label")}</span>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label
                        className="font-display text-xs tracking-[0.15em] uppercase block"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        {t("contact.form.name")}
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused(null)}
                        placeholder={t("contact.form.name.placeholder")}
                        required
                        style={inputStyle("name")}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        className="font-display text-xs tracking-[0.15em] uppercase block"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        {t("contact.form.email")}
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                        placeholder={t("contact.form.email.placeholder")}
                        required
                        style={inputStyle("email")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      className="font-display text-xs tracking-[0.15em] uppercase block"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {t("contact.form.service")}
                    </label>
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      onFocus={() => setFocused("service")}
                      onBlur={() => setFocused(null)}
                      style={{ ...inputStyle("service"), appearance: "none" as const }}
                    >
                      <option value="" style={{ background: "hsl(var(--background))" }}>
                        {t("contact.form.service.placeholder")}
                      </option>
                      {services.map((s) => (
                        <option key={s} value={s} style={{ background: "hsl(var(--background))" }}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      className="font-display text-xs tracking-[0.15em] uppercase block"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {t("contact.form.message")}
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                      placeholder={t("contact.form.message.placeholder")}
                      required
                      rows={5}
                      style={{ ...inputStyle("message"), resize: "vertical" as const, minHeight: "120px" }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn-glass-secondary w-full justify-center py-3.5 text-xs"
                    style={{ opacity: status === "sending" ? 0.7 : 1 }}
                  >
                    {status === "sending" ? (
                      <>{t("contact.form.sending")}</>
                    ) : (
                      <>
                        {t("contact.form.send")} <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </FadeInSection>
        </div>
      </div>
    </div>
  );
}

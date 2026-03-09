import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Send, Mail, Instagram, Linkedin, Twitter, Github, MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

function FadeInSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

const socials = [
  { icon: Instagram, label: "Instagram", handle: "@refraction_point", href: "#" },
  { icon: Linkedin, label: "LinkedIn", handle: "in/refraction-point", href: "#" },
  { icon: Twitter, label: "Twitter", handle: "@refractionpoint", href: "#" },
  { icon: Github, label: "GitHub", handle: "refraction-point", href: "#" },
];

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [focused, setFocused] = useState<string | null>(null);

  const services = [
    t("svc.brand"), t("svc.motion"), t("svc.3d"),
    t("svc.ui"), t("svc.packaging"), t("svc.direction"),
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 2000);
  };

  const inputStyle = (name: string) => ({
    background: focused === name ? "rgba(112,251,249,0.06)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${focused === name ? "rgba(112,251,249,0.45)" : "rgba(112,251,249,0.12)"}`,
    boxShadow: focused === name ? "0 0 20px rgba(112,251,249,0.1)" : "none",
    color: "hsl(var(--foreground))",
    borderRadius: "12px",
    padding: "14px 16px",
    width: "100%",
    fontFamily: "var(--font-body)",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.3s ease",
    backdropFilter: "blur(12px)",
  });

  return (
    <div className="min-h-screen dot-grid" style={{ background: "var(--gradient-bg)" }}>
      {/* Header */}
      <div className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 radial-glow-cyan opacity-25 pointer-events-none" />
        <div className="absolute bottom-0 left-0 radial-glow-magenta opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <span className="section-label block mb-6">{t("contact.label")}</span>
            <h1 className="font-display font-extrabold uppercase leading-[0.85] mb-6" style={{ fontSize: "clamp(3rem, 7vw, 7rem)" }}>
              {t("contact.h1a")}
              <br />
              <span className="gradient-text">{t("contact.h1b")}</span>
            </h1>
            <p className="font-body text-xl max-w-lg" style={{ color: "hsl(var(--muted-foreground))" }}>
              {t("contact.description")}
            </p>
          </FadeInSection>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Info sidebar */}
          <FadeInSection delay={0.1} className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 space-y-4" style={{ boxShadow: "var(--glow-cyan-sm)" }}>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "hsl(var(--primary))" }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "hsl(var(--primary))" }} />
                </span>
                <span className="font-display text-xs tracking-[0.2em] uppercase" style={{ color: "hsl(var(--primary))" }}>
                  {t("contact.available")}
                </span>
              </div>
              <p className="font-body text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                {t("contact.available.body")}
              </p>
              <div className="flex items-center gap-2 text-xs font-display tracking-[0.1em] uppercase" style={{ color: "hsl(var(--muted-foreground))" }}>
                <Clock className="w-3 h-3" />{t("contact.response")}
              </div>
              <div className="flex items-center gap-2 text-xs font-display tracking-[0.1em] uppercase" style={{ color: "hsl(var(--muted-foreground))" }}>
                <MapPin className="w-3 h-3" />{t("contact.location")}
              </div>
              <div className="flex items-center gap-2 text-xs font-display tracking-[0.1em] uppercase" style={{ color: "hsl(var(--muted-foreground))" }}>
                <Mail className="w-3 h-3" />hello@refractionpoint.com
              </div>
            </div>

            <div className="glass-panel p-6 space-y-4">
              <span className="section-label">{t("contact.services.label")}</span>
              <div className="space-y-2">
                {services.map((svc) => (
                  <div key={svc} className="font-display text-xs tracking-[0.1em] uppercase px-3 py-2 rounded-xl transition-all duration-200"
                    style={{ background: "rgba(112,251,249,0.04)", border: "1px solid rgba(112,251,249,0.1)", color: "hsl(var(--muted-foreground))" }}>
                    {svc}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 space-y-4">
              <span className="section-label">{t("contact.socials.label")}</span>
              <div className="space-y-3">
                {socials.map(({ icon: Icon, label, handle, href }) => (
                  <a key={label} href={href} className="flex items-center gap-3 group transition-all duration-200">
                    <div className="glass-panel-sm p-2 group-hover:border-primary/40 transition-colors duration-200">
                      <Icon className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                    </div>
                    <div>
                      <div className="font-display text-xs tracking-[0.1em] uppercase" style={{ color: "hsl(var(--foreground))" }}>{label}</div>
                      <div className="font-body text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{handle}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </FadeInSection>

          {/* Contact form */}
          <FadeInSection delay={0.2} className="lg:col-span-3">
            <div className="glass-panel p-8 md:p-12" style={{ boxShadow: "var(--glow-combined)" }}>
              {status === "sent" ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center gap-6">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(112,251,249,0.1)", border: "1px solid rgba(112,251,249,0.4)", boxShadow: "var(--glow-cyan)" }}>
                    <Send className="w-8 h-8" style={{ color: "hsl(var(--primary))" }} />
                  </div>
                  <h3 className="font-display font-bold text-2xl uppercase">{t("contact.form.sent.title")}</h3>
                  <p className="font-body" style={{ color: "hsl(var(--muted-foreground))" }}>{t("contact.form.sent.body")}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <span className="section-label block mb-8">{t("contact.form.label")}</span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="font-display text-xs tracking-[0.15em] uppercase block" style={{ color: "hsl(var(--muted-foreground))" }}>
                        {t("contact.form.name")}
                      </label>
                      <input name="name" value={form.name} onChange={handleChange}
                        onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                        placeholder={t("contact.form.name.placeholder")} required style={inputStyle("name")} />
                    </div>
                    <div className="space-y-2">
                      <label className="font-display text-xs tracking-[0.15em] uppercase block" style={{ color: "hsl(var(--muted-foreground))" }}>
                        {t("contact.form.email")}
                      </label>
                      <input name="email" type="email" value={form.email} onChange={handleChange}
                        onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                        placeholder={t("contact.form.email.placeholder")} required style={inputStyle("email")} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-display text-xs tracking-[0.15em] uppercase block" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {t("contact.form.service")}
                    </label>
                    <select name="service" value={form.service} onChange={handleChange}
                      onFocus={() => setFocused("service")} onBlur={() => setFocused(null)}
                      style={{ ...inputStyle("service"), appearance: "none" }}>
                      <option value="" style={{ background: "hsl(var(--background))" }}>{t("contact.form.service.placeholder")}</option>
                      {services.map((s) => (
                        <option key={s} value={s} style={{ background: "hsl(var(--background))" }}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="font-display text-xs tracking-[0.15em] uppercase block" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {t("contact.form.message")}
                    </label>
                    <textarea name="message" value={form.message} onChange={handleChange}
                      onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
                      placeholder={t("contact.form.message.placeholder")} required rows={6}
                      style={{ ...inputStyle("message"), resize: "vertical", minHeight: "140px" }} />
                  </div>

                  <button type="submit" disabled={status === "sending"} className="btn-glass-primary w-full justify-center py-4 text-sm"
                    style={{ boxShadow: "var(--glow-cyan-sm)", opacity: status === "sending" ? 0.7 : 1 }}>
                    {status === "sending" ? (
                      <>{t("contact.form.sending")}</>
                    ) : (
                      <>{t("contact.form.send")} <Send className="w-4 h-4" /></>
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

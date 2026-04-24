import { Link } from "react-router-dom";
import { Github, Linkedin, Instagram, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import BehanceIcon from "@/components/icons/BehanceIcon";
import { SOCIAL } from "@/config/links";
import Logo from "@/components/Logo";

const socials = [
  { icon: Github, href: SOCIAL.github, label: "GitHub" },
  { icon: BehanceIcon, href: SOCIAL.behance, label: "Behance" },
  { icon: Linkedin, href: SOCIAL.linkedin, label: "LinkedIn" },
  { icon: Instagram, href: SOCIAL.instagram, label: "Instagram" },
] as const;

export default function Footer() {
  const { t } = useLanguage();

  const footerLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/projects", label: t("nav.projects") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <footer
      className="relative overflow-hidden border-t"
      style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12">
          <div className="space-y-4">
            <div className="flex items-center">
              <Logo height={80} style={{ marginLeft: "-27px" }} />
            </div>
            <p className="font-body text-sm leading-relaxed max-w-md" style={{ color: "hsl(var(--muted-foreground))" }}>
              {t("footer.tagline")}
            </p>
            <div className="flex flex-wrap gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="glass-panel-sm p-2 transition-all duration-300 hover:scale-110"
                >
                  <Icon className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <span className="section-label">{t("footer.nav.label")}</span>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="font-display text-xs tracking-[0.15em] uppercase transition-colors duration-200 flex items-center gap-1 group"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    <span className="group-hover:text-primary transition-colors duration-200">{link.label}</span>
                    <ArrowUpRight
                      className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-y-0.5 group-hover:-translate-y-1 group-hover:translate-x-0.5"
                      style={{ color: "hsl(var(--primary))" }}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <span className="section-label">{t("footer.status.label")}</span>
            <div className="glass-panel-sm p-4 space-y-3 max-w-md lg:max-w-none">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ background: "hsl(var(--primary))" }}
                  />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "hsl(var(--primary))" }} />
                </span>
                <span className="font-display text-xs tracking-widest uppercase" style={{ color: "hsl(var(--primary))" }}>
                  {t("footer.status.available")}
                </span>
              </div>
              <p className="font-body text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                {t("footer.status.body")}
              </p>
              <Link to="/contact" className="block">
                <button className="btn-glass-primary text-xs w-full justify-center mt-2">{t("footer.status.cta")}</button>
              </Link>
            </div>
          </div>
        </div>

        <div
          className="mt-10 sm:mt-12 pt-6 flex flex-col lg:flex-row justify-between items-center gap-3 sm:gap-4 text-center lg:text-left"
          style={{ borderTop: "1px solid hsl(var(--border) / 0.35)" }}
        >
          <p className="font-display text-[10px] sm:text-xs tracking-[0.12em] sm:tracking-[0.15em] uppercase" style={{ color: "hsl(var(--muted-foreground))" }}>
            {t("footer.copyright")}
          </p>
          <p className="font-display text-[10px] sm:text-xs tracking-[0.12em] sm:tracking-[0.15em] uppercase max-w-full break-words" style={{ color: "hsl(var(--muted-foreground))" }}>
            {t("footer.disciplines")}
          </p>
        </div>
      </div>
    </footer>
  );
}

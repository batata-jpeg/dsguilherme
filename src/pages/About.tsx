import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Award, Briefcase, Clock, Download } from "lucide-react";
import aboutPortrait from "@/assets/profile-photo.jpg";
import grainTexture from "@/assets/grain.png";
import { useLanguage } from "@/contexts/LanguageContext";
import ProfileCard from "@/components/ProfileCard";

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

const tools = [
  "Blender", "Adobe Illustrator", "After Effects",
  "Figma", "Photoshop", "InDesign",
  "TouchDesigner", "Houdini", "Protopie", "KeyShot",
];

export default function About() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const skills = [
    { key: "skill.brand", level: 98 },
    { key: "skill.3d", level: 90 },
    { key: "skill.motion", level: 88 },
    { key: "skill.ui", level: 85 },
    { key: "skill.illustration", level: 78 },
    { key: "skill.packaging", level: 82 },
  ];

  const experience = [
    {
      role: t("about.exp.0.role"),
      company: t("about.exp.0.company"),
      period: t("about.exp.0.period"),
      description: t("about.exp.0.desc"),
    },
    {
      role: t("about.exp.1.role"),
      company: t("about.exp.1.company"),
      period: t("about.exp.1.period"),
      description: t("about.exp.1.desc"),
    },
    {
      role: t("about.exp.2.role"),
      company: t("about.exp.2.company"),
      period: t("about.exp.2.period"),
      description: t("about.exp.2.desc"),
    },
  ];

  const awards = [
    { title: t("award.0"), year: "2023" },
    { title: t("award.1"), year: "2024" },
    { title: t("award.2"), year: "2022" },
    { title: t("award.3"), year: "2023" },
  ];

  return (
    <div className="min-h-screen dot-grid bg-transparent">


      {/* Portrait + Bio */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="glass-panel p-8 md:p-14 grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <FadeInSection className="lg:col-span-2 flex flex-col items-center gap-4">
            <ProfileCard
              avatarUrl={aboutPortrait}
              miniAvatarUrl={aboutPortrait}
              grainUrl={grainTexture}
              name={t("about.card.name")}
              title={t("about.card.title")}
              handle={t("about.card.handle")}
              status={t("about.card.status")}
              showUserInfo={true}
              className="w-full mx-auto"
            />
            <div className="flex gap-3 w-full mt-2">
              <a href="/cv-pt.pdf" download className="btn-glass-secondary flex items-center justify-center gap-2 flex-1 text-sm py-3 px-4">
                <Download className="w-4 h-4" /> CV Português
              </a>
              <a href="/cv-en.pdf" download className="btn-glass-secondary flex items-center justify-center gap-2 flex-1 text-sm py-3 px-4">
                <Download className="w-4 h-4" /> CV English
              </a>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.2} className="lg:col-span-3 space-y-10">
            <div className="space-y-4">
              <span className="section-label">{t("about.story.label")}</span>
              <p className="font-body leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{t("about.story.p1")}</p>
              <p className="font-body leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{t("about.story.p2")}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Clock, value: "7+", label: t("about.stats.years") },
                { icon: Briefcase, value: "120+", label: t("about.stats.projects") },
                { icon: Award, value: "8", label: t("about.stats.awards") },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="glass-panel-sm p-4 text-center">
                  <Icon className="w-4 h-4 mx-auto mb-2" style={{ color: "hsl(var(--primary))", opacity: 0.7 }} />
                  <div className="font-display font-extrabold gradient-text text-2xl">{value}</div>
                  <div className="font-display text-xs tracking-[0.15em] uppercase mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{label}</div>
                </div>
              ))}
            </div>

            <div>
              <span className="section-label block mb-4">{t("about.tools.label")}</span>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <span key={tool} className="font-display text-xs tracking-[0.08em] uppercase px-3 py-2 rounded-xl transition-all duration-200 hover:scale-105 glass-panel-sm"
                    style={{ color: "hsl(var(--foreground))" }}>
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>

      {/* Skills */}
      <div className="max-w-7xl mx-auto px-6 py-10 pb-20">
        <FadeInSection>
          <span className="section-label block mb-10">{t("about.skills.label")}</span>
        </FadeInSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill, i) => (
            <FadeInSection key={skill.key} delay={i * 0.08}>
              <div className="glass-panel p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-display font-600 text-sm tracking-[0.1em] uppercase" style={{ color: "hsl(var(--foreground))" }}>{t(skill.key)}</span>
                  <span className="font-display text-sm gradient-text font-bold">{skill.level}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(10,132,255,0.08)" }}>
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full" style={{ background: "var(--gradient-text)", boxShadow: "var(--glow-blue-sm)" }} />
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <FadeInSection>
          <span className="section-label block mb-10">{t("about.experience.label")}</span>
        </FadeInSection>
        <div className="space-y-4">
          {experience.map((exp, i) => (
            <FadeInSection key={exp.company} delay={i * 0.1}>
              <div className="glass-panel p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 items-start">
                <div>
                  <div className="font-display font-bold uppercase text-base" style={{ color: "hsl(var(--foreground))" }}>{exp.role}</div>
                  <div className="font-display text-sm mt-1 gradient-text font-600">{exp.company}</div>
                </div>
                <div className="md:text-center">
                  <span className="glass-panel-sm px-3 py-1 inline-block">
                    <span className="font-display text-xs tracking-[0.15em] uppercase" style={{ color: "hsl(var(--muted-foreground))" }}>{exp.period}</span>
                  </span>
                </div>
                <div>
                  <p className="font-body text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{exp.description}</p>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </div>
  );
}
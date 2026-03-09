import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Award, Briefcase, Clock, Download } from "lucide-react";
import aboutPortrait from "@/assets/about-portrait.jpg";

function FadeInSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
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

const skills = [
  { name: "Brand Identity", level: 98 },
  { name: "3D & Rendering", level: 90 },
  { name: "Motion Design", level: 88 },
  { name: "UI/UX Design", level: 85 },
  { name: "Illustration", level: 78 },
  { name: "Packaging Design", level: 82 },
];

const tools = [
  "Blender", "Cinema 4D", "Adobe Illustrator", "After Effects",
  "Figma", "Photoshop", "InDesign", "Substance 3D",
  "TouchDesigner", "Houdini", "Protopie", "KeyShot",
];

const experience = [
  {
    role: "Senior Creative Director",
    company: "Studio Nexus",
    period: "2022 — Present",
    description: "Leading a 12-person creative team across branding, digital, and motion projects for Fortune 500 clients and emerging luxury brands.",
  },
  {
    role: "Lead Brand Designer",
    company: "Paradigm Agency",
    period: "2019 — 2022",
    description: "Directed visual identity projects for technology and lifestyle brands, establishing design systems used across global campaigns.",
  },
  {
    role: "Visual Designer",
    company: "Orbit Creative",
    period: "2017 — 2019",
    description: "Designed across print, digital, and motion mediums for clients in fashion, music, and tech verticals.",
  },
];

const awards = [
  { title: "Gold — Pentawards", year: "2023" },
  { title: "GDUSA American Design Award", year: "2024" },
  { title: "Communication Arts Typography Award", year: "2022" },
  { title: "D&AD Shortlist — Graphic Design", year: "2023" },
];

export default function About() {
  return (
    <div className="min-h-screen dot-grid" style={{ background: "var(--gradient-bg)" }}>
      {/* Hero */}
      <div className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 radial-glow-magenta opacity-30 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 radial-glow-cyan opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <span className="section-label block mb-6">About Me</span>
          </FadeInSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeInSection delay={0.1}>
              <h1
                className="font-display font-extrabold uppercase leading-[0.85]"
                style={{ fontSize: "clamp(3rem, 6vw, 6rem)" }}
              >
                VISUAL
                <br />
                <span className="gradient-text">ARCHITECT</span>
                <br />
                OF DIGITAL
                <br />
                WORLDS.
              </h1>
            </FadeInSection>
            <FadeInSection delay={0.3} className="space-y-6">
              <p className="font-body text-xl leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                I'm a multidisciplinary graphic designer and visual artist based in New York. With over 7 years crafting brands, identities, and digital experiences, I push the boundaries of what design can evoke.
              </p>
              <p className="font-body leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                My practice lives at the intersection of graphic design, 3D art, motion, and conceptual thinking. I believe the best design doesn't just solve problems — it creates new ways of seeing.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link to="/contact">
                  <button className="btn-glass-primary">
                    Work Together <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <button className="btn-glass-secondary flex items-center gap-2">
                  <Download className="w-4 h-4" /> Download CV
                </button>
              </div>
            </FadeInSection>
          </div>
        </div>
      </div>

      {/* Portrait + Bio */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="glass-panel p-8 md:p-14 grid grid-cols-1 lg:grid-cols-5 gap-12 items-start" style={{ boxShadow: "var(--glow-combined)" }}>
          <FadeInSection className="lg:col-span-2">
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-2xl pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(112,251,249,0.1) 0%, rgba(231,57,245,0.06) 60%, transparent 80%)",
                  filter: "blur(24px)",
                }}
              />
              <img
                src={aboutPortrait}
                alt="Designer Portrait"
                className="relative w-full rounded-2xl object-cover"
                style={{
                  height: "500px",
                  objectPosition: "center top",
                  border: "1px solid rgba(112,251,249,0.2)",
                  boxShadow: "var(--glow-cyan-sm)",
                }}
              />
            </div>
          </FadeInSection>

          <FadeInSection delay={0.2} className="lg:col-span-3 space-y-10">
            <div className="space-y-4">
              <span className="section-label">The Story</span>
              <p className="font-body leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                My journey began in traditional graphic design, but quickly expanded into 3D, motion, and the emerging territories where these disciplines dissolve into each other. I studied at the School of Visual Arts in New York before working at some of the city's most respected design studios.
              </p>
              <p className="font-body leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                Today, I run an independent creative practice working with select clients who understand that design is more than decoration — it is the primary vehicle through which organisations communicate their deepest values.
              </p>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Clock, value: "7+", label: "Years" },
                { icon: Briefcase, value: "120+", label: "Projects" },
                { icon: Award, value: "8", label: "Awards" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="glass-panel-sm p-4 text-center">
                  <Icon className="w-4 h-4 mx-auto mb-2" style={{ color: "hsl(var(--primary))", opacity: 0.7 }} />
                  <div className="font-display font-extrabold gradient-text text-2xl">{value}</div>
                  <div className="font-display text-xs tracking-[0.15em] uppercase mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Tools */}
            <div>
              <span className="section-label block mb-4">Tools & Software</span>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="font-display text-xs tracking-[0.08em] uppercase px-3 py-2 rounded-xl transition-all duration-200 hover:scale-105"
                    style={{
                      background: "rgba(112,251,249,0.06)",
                      color: "hsl(var(--foreground))",
                      border: "1px solid rgba(112,251,249,0.12)",
                    }}
                  >
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
          <span className="section-label block mb-10">Expertise</span>
        </FadeInSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill, i) => (
            <FadeInSection key={skill.name} delay={i * 0.08}>
              <div className="glass-panel p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-display font-600 text-sm tracking-[0.1em] uppercase" style={{ color: "hsl(var(--foreground))" }}>
                    {skill.name}
                  </span>
                  <span className="font-display text-sm gradient-text font-bold">{skill.level}%</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(112,251,249,0.1)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{ background: "var(--gradient-text)", boxShadow: "var(--glow-cyan-sm)" }}
                  />
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <FadeInSection>
          <span className="section-label block mb-10">Experience</span>
        </FadeInSection>
        <div className="space-y-4">
          {experience.map((exp, i) => (
            <FadeInSection key={exp.company} delay={i * 0.1}>
              <div className="glass-panel p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 items-start group hover:border-primary/30 transition-colors duration-300">
                <div>
                  <div className="font-display font-bold uppercase text-base" style={{ color: "hsl(var(--foreground))" }}>{exp.role}</div>
                  <div className="font-display text-sm mt-1 gradient-text font-600">{exp.company}</div>
                </div>
                <div className="md:text-center">
                  <span className="glass-panel-sm px-3 py-1 inline-block">
                    <span className="font-display text-xs tracking-[0.15em] uppercase" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {exp.period}
                    </span>
                  </span>
                </div>
                <div>
                  <p className="font-body text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {exp.description}
                  </p>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>

      {/* Awards */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        <FadeInSection>
          <span className="section-label block mb-10">Recognition</span>
        </FadeInSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {awards.map((award, i) => (
            <FadeInSection key={award.title} delay={i * 0.1}>
              <div
                className="glass-panel p-6 flex items-center justify-between group hover:border-primary/30 transition-all duration-300"
                style={{ cursor: "none" }}
              >
                <div className="flex items-center gap-4">
                  <Award className="w-5 h-5 flex-shrink-0" style={{ color: "hsl(var(--primary))", opacity: 0.7 }} />
                  <span className="font-display font-600 text-sm tracking-[0.08em] uppercase" style={{ color: "hsl(var(--foreground))" }}>
                    {award.title}
                  </span>
                </div>
                <span className="font-display text-sm gradient-text font-bold flex-shrink-0">{award.year}</span>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </div>
  );
}

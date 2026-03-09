import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

const projects: Record<string, {
  title: string;
  category: string;
  description: string;
  image: string;
  year: string;
  tags: string[];
  tools: string[];
  challenge: string;
  process: string;
  outcome: string;
  images: string[];
}> = {
  "luminary-brand": {
    title: "Luminary Brand Identity",
    category: "Branding · Identity",
    description: "A complete luxury brand system featuring custom typography, mark design, and a premium visual language for an elite cosmetics label.",
    image: project1,
    year: "2024",
    tags: ["Branding", "Identity", "Typography"],
    tools: ["Adobe Illustrator", "Adobe InDesign", "Figma", "After Effects"],
    challenge: "Luminary came to us needing a visual identity that could stand beside the world's most recognised luxury beauty brands while maintaining a distinct, modern perspective. The brand needed to feel both timeless and avant-garde.",
    process: "We began with an extensive mood-boarding phase exploring the intersection of mineral forms and contemporary luxury. The logomark evolved from the refraction patterns of diamonds, translated into a precise geometric construction. The custom wordmark was refined over 40+ iterations to achieve the exact balance of authority and elegance.",
    outcome: "The completed brand system launched across 12 product lines and was recognised by the GDUSA American Design Awards. Client reported a 34% increase in perceived premium positioning among target consumers.",
    images: [project1, project2, project3],
  },
  "nebula-motion": {
    title: "Nebula Motion Series",
    category: "Motion · 3D",
    description: "Generative motion graphics exploring fluid dynamics and organic form through real-time 3D simulations.",
    image: project2,
    year: "2024",
    tags: ["Motion", "3D", "Generative"],
    tools: ["Blender", "Cinema 4D", "After Effects", "TouchDesigner"],
    challenge: "Create a series of visual works that exist at the boundary between digital and natural phenomena — exploring how computational processes can evoke emotional, visceral responses.",
    process: "Using fluid simulation software combined with custom particle systems, we generated a series of base simulations. These were then sculpted, coloured, and composed in Blender before final post-processing in After Effects to achieve the luminous, nebula-like quality.",
    outcome: "The series was exhibited at three digital art festivals and acquired by two private collectors. It became a reference work for the studio's approach to generative aesthetics.",
    images: [project2, project3, project1],
  },
  "nova-app": {
    title: "Nova App Interface",
    category: "UI/UX · Product",
    description: "A futuristic mobile OS concept with glassmorphism design language demonstrating advanced interface design thinking.",
    image: project3,
    year: "2023",
    tags: ["UI/UX", "Product", "Mobile"],
    tools: ["Figma", "Protopie", "After Effects", "Blender"],
    challenge: "Reimagine the mobile operating system interface for a near-future context where the boundary between digital and physical is increasingly blurred. The interface should feel like an extension of consciousness, not a tool.",
    process: "Extensive research into spatial computing, AR interfaces, and biometric interaction patterns informed the initial concepts. The glassmorphism language was chosen to create depth and layering that suggests the interface exists within physical space.",
    outcome: "The concept garnered significant attention online, accumulating over 200K views across design platforms and leading to two direct client commissions for similar exploratory work.",
    images: [project3, project2, project4],
  },
  "obsidian-packaging": {
    title: "Obsidian Packaging",
    category: "Identity · Packaging",
    description: "Luxury packaging design for a premium lifestyle brand with matte obsidian finish and holographic foil detailing.",
    image: project4,
    year: "2023",
    tags: ["Identity", "Packaging", "Luxury"],
    tools: ["Adobe Illustrator", "Keyshot", "Blender", "Adobe Photoshop"],
    challenge: "Design packaging that communicates absolute premium quality through restraint rather than decoration. The product should feel like a collector's item before it's even opened.",
    process: "The minimal approach demanded extreme attention to material texture, proportion, and the strategic use of negative space. Obsidian matte finish was selected after evaluating 15+ material samples. The holographic foil elements were positioned to reveal themselves only in specific lighting conditions.",
    outcome: "The packaging design won Gold at the Pentawards 2023. The client reported a 28% increase in retail sell-through attributed to packaging differentiation.",
    images: [project4, project1, project2],
  },
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = id ? projects[id] : null;

  if (!project) {
    return (
      <div className="min-h-screen dot-grid flex items-center justify-center" style={{ background: "var(--gradient-bg)" }}>
        <div className="text-center space-y-4">
          <h1 className="font-display font-bold text-4xl uppercase">Project Not Found</h1>
          <Link to="/projects">
            <button className="btn-glass-primary">Back to Projects</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dot-grid" style={{ background: "var(--gradient-bg)" }}>
      {/* Hero */}
      <div className="relative h-screen overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${project.image})` }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(3,6,21,0.4) 0%, rgba(3,6,21,0.8) 60%, rgba(3,6,21,1) 100%)" }} />

        {/* Back button */}
        <div className="absolute top-28 left-6 z-20">
          <Link to="/projects">
            <button className="btn-glass-primary text-xs flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> All Projects
            </button>
          </Link>
        </div>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-4"
          >
            <span className="section-label">{project.category}</span>
            <h1 className="font-display font-extrabold uppercase leading-tight" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-display text-xs tracking-[0.1em] uppercase px-3 py-1 rounded-xl"
                  style={{ background: "rgba(112,251,249,0.08)", color: "rgba(112,251,249,0.8)", border: "1px solid rgba(112,251,249,0.2)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-20">
        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          <div className="md:col-span-2">
            <span className="section-label block mb-6">Overview</span>
            <p className="font-body text-xl leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
              {project.description}
            </p>
          </div>
          <div className="glass-panel p-6 space-y-4">
            <div>
              <span className="section-label block mb-2">Year</span>
              <p className="font-display font-bold text-xl gradient-text">{project.year}</p>
            </div>
            <div style={{ borderTop: "1px solid rgba(112,251,249,0.1)", paddingTop: "1rem" }}>
              <span className="section-label block mb-3">Tools Used</span>
              <div className="space-y-2">
                {project.tools.map((tool) => (
                  <div key={tool} className="glass-panel-sm px-3 py-2">
                    <span className="font-display text-xs tracking-[0.1em] uppercase" style={{ color: "hsl(var(--foreground))" }}>{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Process cards */}
        {[
          { label: "The Challenge", text: project.challenge },
          { label: "The Process", text: project.process },
          { label: "The Outcome", text: project.outcome },
        ].map((section, i) => (
          <motion.div
            key={section.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-8 md:p-12"
          >
            <span className="section-label block mb-6">{section.label}</span>
            <p className="font-body text-lg leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
              {section.text}
            </p>
          </motion.div>
        ))}

        {/* Image gallery */}
        <div>
          <span className="section-label block mb-8">Gallery</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {project.images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel overflow-hidden group"
              >
                <img
                  src={img}
                  alt={`${project.title} - Image ${i + 1}`}
                  className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8" style={{ borderTop: "1px solid rgba(112,251,249,0.1)" }}>
          <Link to="/projects">
            <button className="btn-glass-primary">
              <ArrowLeft className="w-4 h-4" /> All Projects
            </button>
          </Link>
          <Link to="/contact">
            <button className="btn-glass-secondary flex items-center gap-2">
              Start a Project <ExternalLink className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

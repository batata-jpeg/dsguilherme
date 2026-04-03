import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "pt";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    "nav.home": "Home",
    "nav.projects": "Projects",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.cta": "Let's Talk",
    "scrollToTop.aria": "Back to top",
    "contact.quick.label": "Quick contact",
    "contact.quick.subtitle": "The fastest way to reach me — choose a channel below.",
    "contact.whatsapp.title": "WhatsApp",
    "contact.whatsapp.body": "Message me directly",
    "contact.email.cta": "Send email",
    "contact.linkedin.cta": "LinkedIn profile",

    // Index – Hero
    "index.hero.label": "Graphic Designer, 3D Artist, Visual Experiences",
    "index.hero.h1a": "WELCOME",
    "index.hero.h1b": "TO MY",
    "index.hero.h1c": "PORTFOLIO",
    "index.hero.description": "",
    "index.hero.cta.projects": "View Projects",
    "index.hero.cta.about": "About Me",
    "index.hero.available": "AVAILABLE FOR WORK!",
    "index.hero.scroll": "Scroll",

    // Index – Stats
    "index.stats.years": "Years Experience",
    "index.stats.projects": "Projects Delivered",
    "index.stats.clients": "Happy Clients",
    "index.stats.fields": "Creative Fields",

    // Index – Philosophy
    "index.philosophy.label": "Philosophy",
    "index.philosophy.line1": "\"CREATIVITY IS",
    "index.philosophy.line2": "INTELLIGENCE",
    "index.philosophy.accent": "HAVING FUN\"",
    "index.philosophy.author": "— ALBERT EINSTEIN",
    "index.philosophy.body": "An experience that blurs the line between digital and physical — where every pixel carries intention, every transition carries meaning.",

    // Index – Featured
    "index.featured.label": "Featured Work",
    "index.featured.title": "SELECTED PROJECTS",
    "index.featured.cta": "All Projects",
    "index.featured.view": "View Project",
    "index.featured.view.short": "View",

    // Index – About preview
    "index.about.label": "About Me",
    "index.about.title": "CRAFTING THE IMPOSSIBLE INTO VISUAL REALITY",
    "index.about.body": "I'm a multidisciplinary graphic designer and visual artist with over 7 years of experience crafting brands, identities, and digital experiences that push the boundaries of conventional design.",
    "index.about.cta": "Read My Story",

    // Index – Contact CTA
    "index.cta.label": "Contact",
    "index.cta.line1": "LET'S CREATE",
    "index.cta.line2": "SOMETHING",
    "index.cta.line3": "REMARKABLE.",
    "index.cta.body": "Ready to bring your vision to life? I'm available for select projects and collaborations.",
    "index.cta.btn": "Start a Conversation",
    "index.cta.formLink": "Or send a message through the contact form",

    // About
    "about.label": "About Me",
    "about.h1a": "VISUAL",
    "about.h1b": "ARCHITECT",
    "about.h1c": "OF DIGITAL",
    "about.h1d": "WORLDS.",
    "about.intro1": "I'm a multidisciplinary graphic designer and visual artist based in New York. With over 7 years crafting brands, identities, and digital experiences, I push the boundaries of what design can evoke.",
    "about.intro2": "My practice lives at the intersection of graphic design, 3D art, motion, and conceptual thinking. I believe the best design doesn't just solve problems — it creates new ways of seeing.",
    "about.cta.work": "Work Together",
    "about.cta.cv": "Download CV",
    "about.card.name": "Guilherme Carvalho",
    "about.card.title": "Visual Artist",
    "about.card.handle": "carvalhoguilherme_",
    "about.card.status": "Available",
    "about.story.label": "The Story",
    "about.story.p1": "My journey began in traditional graphic design, but quickly expanded into 3D, motion, and the emerging territories where these disciplines dissolve into each other. I studied at the School of Visual Arts in New York before working at some of the city's most respected design studios.",
    "about.story.p2": "Today, I run an independent creative practice working with select clients who understand that design is more than decoration — it is the primary vehicle through which organisations communicate their deepest values.",
    "about.stats.years": "Years",
    "about.stats.projects": "Projects",
    "about.stats.awards": "Awards",
    "about.tools.label": "Tools & Software",
    "about.skills.label": "Expertise",
    "about.experience.label": "Experience",
    "about.awards.label": "Recognition",

    // Experience entries
    "about.exp.0.role": "Senior Creative Director",
    "about.exp.0.company": "Studio Nexus",
    "about.exp.0.period": "2022 — Present",
    "about.exp.0.desc": "Leading a 12-person creative team across branding, digital, and motion projects for Fortune 500 clients and emerging luxury brands.",
    "about.exp.1.role": "Lead Brand Designer",
    "about.exp.1.company": "Paradigm Agency",
    "about.exp.1.period": "2019 — 2022",
    "about.exp.1.desc": "Directed visual identity projects for technology and lifestyle brands, establishing design systems used across global campaigns.",
    "about.exp.2.role": "Visual Designer",
    "about.exp.2.company": "Orbit Creative",
    "about.exp.2.period": "2017 — 2019",
    "about.exp.2.desc": "Designed across print, digital, and motion mediums for clients in fashion, music, and tech verticals.",

    // Skills
    "skill.brand": "Brand Identity",
    "skill.3d": "3D & Rendering",
    "skill.motion": "Motion Design",
    "skill.ui": "UI/UX Design",
    "skill.illustration": "Illustration",
    "skill.packaging": "Packaging Design",

    // Awards
    "award.0": "Gold — Pentawards",
    "award.1": "GDUSA American Design Award",
    "award.2": "Communication Arts Typography Award",
    "award.3": "D&AD Shortlist — Graphic Design",

    // Projects page
    "projects.label": "Portfolio",
    "projects.h1a": "ALL",
    "projects.h1b": "PROJECTS",
    "projects.description": "A curated collection of work spanning branding, motion, 3D, and digital experiences.",
    "projects.filter.all": "All",
    "projects.view": "View Project",

    // Project entries
    "proj.luminary.title": "Luminary Brand Identity",
    "proj.luminary.category": "Branding",
    "proj.luminary.desc": "A complete luxury brand system with custom typeface, logomark, and a premium visual language for a high-end cosmetics label.",
    "proj.nebula.title": "Nebula Motion Series",
    "proj.nebula.category": "Motion",
    "proj.nebula.desc": "Generative motion graphics series exploring fluid dynamics and organic form evolution through real-time 3D simulations.",
    "proj.nova.title": "Nova App Interface",
    "proj.nova.category": "UI/UX",
    "proj.nova.desc": "A futuristic mobile OS concept with a glassmorphism design language, demonstrating advanced interface design thinking.",
    "proj.obsidian.title": "Obsidian Packaging",
    "proj.obsidian.category": "Identity",
    "proj.obsidian.desc": "Luxury packaging design for a premium lifestyle brand — matte obsidian finish with subtle holographic foil detailing.",
    "proj.void.title": "Void Typeface",
    "proj.void.category": "Branding",
    "proj.void.desc": "An experimental display typeface designed for high-contrast environments, blending geometric precision with organic irregularities.",
    "proj.prism.title": "Prism Visual System",
    "proj.prism.category": "3D",
    "proj.prism.desc": "A comprehensive 3D visual system for a music label, including stage design concepts, album art, and promotional materials.",

    // Contact
    "contact.label": "Contact",
    "contact.h1a": "LET'S",
    "contact.h1b": "CONNECT",
    "contact.description": "Have a project in mind? Ready to build something remarkable together? I'd love to hear from you.",
    "contact.available": "Available for Projects",
    "contact.available.body": "Currently accepting select projects for Q1–Q2 2025. Response time is typically within 24 hours.",
    "contact.response": "Response within 24h",
    "contact.location": "New York, USA — Remote worldwide",
    "contact.services.label": "Services",
    "contact.socials.label": "Social Media",
    "contact.form.label": "Send a Message",
    "contact.form.secondaryHint": "Optional — for a detailed brief.",
    "contact.form.name": "Name",
    "contact.form.name.placeholder": "Your name",
    "contact.form.email": "Email",
    "contact.form.email.placeholder": "your@email.com",
    "contact.form.service": "Service Interested In",
    "contact.form.service.placeholder": "Select a service...",
    "contact.form.message": "Message",
    "contact.form.message.placeholder": "Tell me about your project, timeline, and goals...",
    "contact.form.send": "Send Message",
    "contact.form.sending": "Sending...",
    "contact.form.sent.title": "Message Sent!",
    "contact.form.sent.body": "Thank you for reaching out. I'll be in touch within 24 hours.",

    // Services
    "svc.brand": "Brand Identity",
    "svc.motion": "Motion Design",
    "svc.3d": "3D & Visualization",
    "svc.ui": "UI/UX Design",
    "svc.packaging": "Packaging Design",
    "svc.direction": "Creative Direction",

    // Footer
    "footer.tagline": "Crafting immersive digital experiences at the intersection of design, art, and technology.",
    "footer.nav.label": "Navigation",
    "footer.status.label": "Status",
    "footer.status.available": "Available for Work",
    "footer.status.body": "Open to new projects & collaborations.",
    "footer.status.cta": "Get in Touch",
    "footer.copyright": "© 2025 Guima. All rights reserved.",
    "footer.disciplines": "Branding, 3D, Motion, Identity",
  },

  pt: {
    // Nav
    "nav.home": "Início",
    "nav.projects": "Projetos",
    "nav.about": "Sobre",
    "nav.contact": "Contato",
    "nav.cta": "Fale Comigo",
    "scrollToTop.aria": "Voltar ao topo",
    "contact.quick.label": "Contacto rápido",
    "contact.quick.subtitle": "A forma mais rápida de falar comigo — escolhe um canal abaixo.",
    "contact.whatsapp.title": "WhatsApp",
    "contact.whatsapp.body": "Fala comigo por mensagem",
    "contact.email.cta": "Enviar e-mail",
    "contact.linkedin.cta": "Perfil no LinkedIn",

    // Index – Hero
    "index.hero.label": "Designer gráfico, artista 3D, experiências visuais",
    "index.hero.h1a": "BEM-VINDO",
    "index.hero.h1b": "AO MEU",
    "index.hero.h1c": "PORTFÓLIO",
    "index.hero.description": "",
    "index.hero.cta.projects": "Ver Projetos",
    "index.hero.cta.about": "Sobre Mim",
    "index.hero.available": "DISPONÍVEL PARA TRABALHO!",
    "index.hero.scroll": "Rolar",

    // Index – Stats
    "index.stats.years": "Anos de Experiência",
    "index.stats.projects": "Projetos Entregues",
    "index.stats.clients": "Clientes Satisfeitos",
    "index.stats.fields": "Áreas Criativas",

    // Index – Philosophy
    "index.philosophy.label": "Filosofia",
    "index.philosophy.line1": "\"A CRIATIVIDADE,",
    "index.philosophy.line2": "É A INTELIGÊNCIA",
    "index.philosophy.accent": "SE DIVERTINDO\"",
    "index.philosophy.author": "— ALBERT EINSTEIN",
    "index.philosophy.body": "Uma experiência que apaga a linha entre o digital e o físico — onde cada pixel carrega intenção, cada transição carrega significado.",

    // Index – Featured
    "index.featured.label": "Trabalhos em Destaque",
    "index.featured.title": "PROJETOS SELECIONADOS",
    "index.featured.cta": "Todos os Projetos",
    "index.featured.view": "Ver Projeto",
    "index.featured.view.short": "Ver",

    // Index – About preview
    "index.about.label": "Sobre Mim",
    "index.about.title": "TRANSFORMANDO O IMPOSSÍVEL EM REALIDADE VISUAL",
    "index.about.body": "Sou um designer gráfico multidisciplinar e artista visual com mais de 7 anos de experiência criando marcas, identidades e experiências digitais que ultrapassam os limites do design convencional.",
    "index.about.cta": "Minha História",

    // Index – Contact CTA
    "index.cta.label": "Contato",
    "index.cta.line1": "VAMOS TRANSFORMAR A",
    "index.cta.line2": "SUA IDEIA",
    "index.cta.line3": "EM REALIDADE!",
    "index.cta.body": "Pronto para dar vida à sua visão? Estou disponível para projetos e colaborações selecionados.",
    "index.cta.btn": "Iniciar uma Conversa",
    "index.cta.formLink": "Ou envia uma mensagem pelo formulário de contato",

    // About
    "about.label": "Sobre Mim",
    "about.h1a": "ARQUITETO",
    "about.h1b": "VISUAL",
    "about.h1c": "DE MUNDOS",
    "about.h1d": "DIGITAIS.",
    "about.intro1": "Sou um designer gráfico multidisciplinar e artista visual baseado em Nova York. Com mais de 7 anos criando marcas, identidades e experiências digitais, empurro os limites do que o design pode evocar.",
    "about.intro2": "Minha prática vive na interseção do design gráfico, arte 3D, motion e pensamento conceitual. Acredito que o melhor design não apenas resolve problemas — ele cria novas formas de ver.",
    "about.cta.work": "Trabalhar Juntos",
    "about.cta.cv": "Baixar CV",
    "about.card.name": "Guilherme Carvalho",
    "about.card.title": "Artista Visual",
    "about.card.handle": "guilhermecarvalho",
    "about.card.status": "Disponível",
    "about.story.label": "A História",
    "about.story.p1": "Minha jornada começou no design gráfico tradicional, mas rapidamente se expandiu para 3D, motion e os territórios emergentes onde essas disciplinas se dissolvem umas nas outras. Estudei na School of Visual Arts em Nova York antes de trabalhar em alguns dos mais respeitados estúdios de design da cidade.",
    "about.story.p2": "Hoje, conduzo uma prática criativa independente trabalhando com clientes selecionados que entendem que o design é mais do que decoração — é o principal veículo pelo qual organizações comunicam seus valores mais profundos.",
    "about.stats.years": "Anos",
    "about.stats.projects": "Projetos",
    "about.stats.awards": "Prêmios",
    "about.tools.label": "Ferramentas & Software",
    "about.skills.label": "Expertise",
    "about.experience.label": "Experiência",
    "about.awards.label": "Reconhecimentos",

    // Experience entries
    "about.exp.0.role": "Diretor Criativo Sênior",
    "about.exp.0.company": "Studio Nexus",
    "about.exp.0.period": "2022 — Presente",
    "about.exp.0.desc": "Liderando uma equipe criativa de 12 pessoas em projetos de branding, digital e motion para clientes Fortune 500 e marcas de luxo emergentes.",
    "about.exp.1.role": "Designer de Marca Líder",
    "about.exp.1.company": "Paradigm Agency",
    "about.exp.1.period": "2019 — 2022",
    "about.exp.1.desc": "Dirigiu projetos de identidade visual para marcas de tecnologia e lifestyle, estabelecendo sistemas de design usados em campanhas globais.",
    "about.exp.2.role": "Designer Visual",
    "about.exp.2.company": "Orbit Creative",
    "about.exp.2.period": "2017 — 2019",
    "about.exp.2.desc": "Projetou em mídias impressas, digitais e motion para clientes nas verticais de moda, música e tecnologia.",

    // Skills
    "skill.brand": "Identidade de Marca",
    "skill.3d": "3D & Renderização",
    "skill.motion": "Motion Design",
    "skill.ui": "UI/UX Design",
    "skill.illustration": "Ilustração",
    "skill.packaging": "Design de Embalagem",

    // Awards
    "award.0": "Ouro — Pentawards",
    "award.1": "GDUSA American Design Award",
    "award.2": "Communication Arts Typography Award",
    "award.3": "D&AD Shortlist — Graphic Design",

    // Projects page
    "projects.label": "Portfólio",
    "projects.h1a": "TODOS OS",
    "projects.h1b": "PROJETOS",
    "projects.description": "Uma coleção curada de trabalhos abrangendo branding, motion, 3D e experiências digitais.",
    "projects.filter.all": "Todos",
    "projects.view": "Ver Projeto",

    // Project entries
    "proj.luminary.title": "Identidade Luminary",
    "proj.luminary.category": "Branding",
    "proj.luminary.desc": "Um sistema de marca de luxo completo com tipografia personalizada, logomark e linguagem visual premium para uma marca de cosméticos.",
    "proj.nebula.title": "Série Nebula Motion",
    "proj.nebula.category": "Motion",
    "proj.nebula.desc": "Série de motion graphics generativos explorando dinâmica de fluidos e evolução de formas orgânicas por simulações 3D em tempo real.",
    "proj.nova.title": "Interface Nova App",
    "proj.nova.category": "UI/UX",
    "proj.nova.desc": "Um conceito futurista de OS mobile com linguagem de design glassmorphism, demonstrando pensamento avançado em design de interfaces.",
    "proj.obsidian.title": "Embalagem Obsidian",
    "proj.obsidian.category": "Identidade",
    "proj.obsidian.desc": "Design de embalagem de luxo para uma marca premium — acabamento fosco obsidiana com detalhes holográficos sutis.",
    "proj.void.title": "Typeface Void",
    "proj.void.category": "Branding",
    "proj.void.desc": "Uma tipografia display experimental para ambientes de alto contraste, mesclando precisão geométrica com irregularidades orgânicas.",
    "proj.prism.title": "Sistema Visual Prism",
    "proj.prism.category": "3D",
    "proj.prism.desc": "Um sistema visual 3D abrangente para uma gravadora, incluindo conceitos de cenário, capa de álbum e materiais promocionais.",

    // Contact
    "contact.label": "Contato",
    "contact.h1a": "VAMOS",
    "contact.h1b": "CONECTAR",
    "contact.description": "Tem um projeto em mente? Pronto para construir algo extraordinário juntos? Adoraria ouvir de você.",
    "contact.available": "Disponível para Projetos",
    "contact.available.body": "Aceitando projetos selecionados para o 1º–2º trimestre de 2025. Tempo de resposta geralmente dentro de 24 horas.",
    "contact.response": "Resposta em até 24h",
    "contact.location": "Nova York, EUA — Remoto em todo o mundo",
    "contact.services.label": "Serviços",
    "contact.socials.label": "Redes Sociais",
    "contact.form.label": "Enviar Mensagem",
    "contact.form.secondaryHint": "Opcional — para um briefing detalhado.",
    "contact.form.name": "Nome",
    "contact.form.name.placeholder": "Seu nome",
    "contact.form.email": "E-mail",
    "contact.form.email.placeholder": "seu@email.com",
    "contact.form.service": "Serviço de Interesse",
    "contact.form.service.placeholder": "Selecione um serviço...",
    "contact.form.message": "Mensagem",
    "contact.form.message.placeholder": "Fale sobre seu projeto, prazo e objetivos...",
    "contact.form.send": "Enviar Mensagem",
    "contact.form.sending": "Enviando...",
    "contact.form.sent.title": "Mensagem Enviada!",
    "contact.form.sent.body": "Obrigado por entrar em contato. Responderei em até 24 horas.",

    // Services
    "svc.brand": "Identidade de Marca",
    "svc.motion": "Motion Design",
    "svc.3d": "3D & Visualização",
    "svc.ui": "UI/UX Design",
    "svc.packaging": "Design de Embalagem",
    "svc.direction": "Direção Criativa",

    // Footer
    "footer.tagline": "Criando experiências digitais imersivas na interseção de design, arte e tecnologia.",
    "footer.nav.label": "Navegação",
    "footer.status.label": "Status",
    "footer.status.available": "Disponível para Trabalho",
    "footer.status.body": "Aberto a novos projetos e colaborações.",
    "footer.status.cta": "Entrar em Contato",
    "footer.copyright": "© 2025 Guima. Todos os direitos reservados.",
    "footer.disciplines": "Branding, 3D, Motion, Identidade",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt");

  const toggleLanguage = () =>
    setLanguage((prev) => (prev === "en" ? "pt" : "en"));

  const t = (key: string) => translations[language][key] ?? key;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

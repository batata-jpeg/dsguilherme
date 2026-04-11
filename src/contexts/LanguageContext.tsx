import { createContext, useContext, useState, type ReactNode } from "react";

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
    "index.featured.title": "FEATURED PROJECTS",
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
    "about.stats.awards": "Certificates",
    "about.tools.label": "Tools & Software",
    "about.skills.label": "Expertise",
    "about.experience.label": "Experience",
    "about.awards.label": "Recognition",

    // Experience entries
    "about.exp.0.role": "Intern - Packaging Design",
    "about.exp.0.company": "Ecobrindes - Sao Paulo, SP",
    "about.exp.0.period": "2022 — Present",
    "about.exp.0.desc": "Leading a 12-person creative team across branding, digital, and motion projects for Fortune 500 clients and emerging luxury brands.",
    "about.exp.1.role": "Freelancer",
    "about.exp.1.company": "Freelance",
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

    // Armagedom project detail
    "projdet.armagedom.title": "ARMAGEDOM – RPG BOARD GAME",
    "projdet.armagedom.category": "Game Design, Visual Identity, Illustration",
    "projdet.armagedom.description": "Armagedom is a board game with RPG mechanics that combines strategy, narrative, and decision-making in a dystopian universe. The project involved the complete creation of the game system, including rules, progression dynamics, visual design, and world-building, resulting in an immersive and original experience. The game uses cards, dice, and a modular board for cooperative or competitive matches, where players take on unique roles within an ever-evolving narrative.",
    "projdet.armagedom.client": "Academic Project (University)",
    "projdet.armagedom.audience": "RPG and board game players, ages 16–35, interested in strategy, immersive narrative, and dark fantasy aesthetics",
    "projdet.armagedom.challenge": "The main challenge was balancing three fundamental pillars: strategic gameplay, rule clarity, and a strong, cohesive visual identity. It was necessary to create a system accessible to new players but with enough depth to maintain long-term engagement.\n\nAdditionally, the project required building a consistent universe where narrative, mechanics, and aesthetics worked seamlessly together, avoiding a game that was visually attractive but superficial in gameplay.",
    "projdet.armagedom.process": "Development began with creating the narrative concept and defining the game universe, followed by prototyping the main mechanics (movement, combat, and progression).\n\nIn parallel, the entire visual system was developed:\n\n• Graphic identity based on high contrast (black, white, and red)\n• Original illustrations for cards and characters\n• Board and physical piece design\n• Creation of manuals and support materials\n\nSeveral iterations and playtests were conducted to adjust rules, balance, and experience flow.",
    "projdet.armagedom.outcome": "The result was a complete and functional game with its own rule system, consolidated visual identity, and a high level of immersion. The project demonstrates mastery of game design, art direction, and physical product development.\n\nThe final system presents strong cohesion between narrative and mechanics, providing an engaging and strategic experience for players.",
    "projdet.armagedom.cardCategory": "Identity",
    "projdet.armagedom.cardDesc": "Complete visual identity for the RPG board game Armagedom.",

    // Project detail UI labels
    "projdet.label.year": "Year",
    "projdet.label.client": "Client",
    "projdet.label.audience": "Target Audience",
    "projdet.label.about": "About the Project",
    "projdet.label.challenge": "The Challenge",
    "projdet.label.process": "The Process",
    "projdet.label.outcome": "The Outcome",
    "projdet.label.tools": "Tools Used",
    "projdet.label.tags": "Tags",
    "projdet.label.descPanel": "Project Description",
    "projdet.label.backToSlides": "Back to Images",
    "projdet.label.backToProjects": "All Projects",

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
    "index.featured.title": "PROJETOS EM DESTAQUE",
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
    "index.cta.line1": "VAMOS TRANSFORMAR",
    "index.cta.line2": "A SUA IDEIA",
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
    "about.card.handle": "carvalhoguilherme_",
    "about.card.status": "Disponível",
    "about.story.label": "A História",
    "about.story.p1": "Sou GUILHERME CARVALHO, designer gráfico especializado em criar soluções visuais inovadoras e eficazes. Com 7 anos de experiência, meu trabalho abrange desde identidades visuais até interfaces digitais, sempre com foco em estética e funcionalidade. Estou sempre em busca de novos desafios que me permitam aplicar criatividade e habiliades técnicas para transformar ideias em realidade.",
    "about.story.p2": "Nascido e criado na cidade de Uberlândia-MG, aos 18 anos deicidi começar a atuar com o design gráfico de fato, sendo aquilo que eu mais gostava, me mudando para São Paulo - SP, tendo a expectativa de me especializar no assunto.",
    "about.stats.years": "Anos",
    "about.stats.projects": "Projetos",
    "about.stats.awards": "Certificados",
    "about.tools.label": "Ferramentas & Software",
    "about.skills.label": "Expertise",
    "about.experience.label": "Experiência",
    "about.awards.label": "Reconhecimentos",

    // Experience entries
    "about.exp.0.role": "ESTAGIÁRIO - DESIGN DE EMBALAGEM",
    "about.exp.0.company": "ECOBRINDES - SAO PAULO, SP",
    "about.exp.0.period": "DEZ 2024 - JUL 2025",
    "about.exp.0.desc": "Atuava na digitação e formatação de documentos, garantindo padronização.\nCriava materiais gráficos como papelaria corporativa, layouts e artes para redes sociais.\nDesenvolvia ilustrações e tratava imagens para melhorar a qualidade visual.",
    "about.exp.1.role": "FREELANCER",
    "about.exp.1.company": "FREELANCE",
    "about.exp.1.period": "2019 — 2022",
    "about.exp.1.desc": "Realizava tratamento e edição de imagens para aprimorar a qualidade visual dos projetos.\nCriava layouts estratégicos focados em comunicação clara e atraente.\nGerenciava demandas de forma autônoma, garantindo prazos, organização e satisfação do cliente.",
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

    // Armagedom project detail
    "projdet.armagedom.title": "ARMAGEDOM – JOGO DE TABULEIRO RPG",
    "projdet.armagedom.category": "Game Design, Identidade Visual, Ilustração",
    "projdet.armagedom.description": "Armagedom é um jogo de tabuleiro com mecânicas de RPG que combina estratégia, narrativa e tomada de decisão em um universo distópico. O projeto envolveu a criação completa do sistema do jogo — incluindo regras, dinâmica de progressão, design visual e construção de mundo — resultando em uma experiência imersiva e autoral.\n\nO jogo utiliza cartas, dados e um tabuleiro modular para conduzir partidas cooperativas ou competitivas, onde os jogadores assumem papéis únicos dentro de uma narrativa em constante evolução.",
    "projdet.armagedom.client": "Projeto Acadêmico (Universidade)",
    "projdet.armagedom.audience": "Jogadores de RPG e jogos de tabuleiro, 16–35 anos, interessados em estratégia, narrativa imersiva e estética dark fantasy",
    "projdet.armagedom.challenge": "O principal desafio foi equilibrar três pilares fundamentais: jogabilidade estratégica, clareza de regras e uma identidade visual forte e coerente. Era necessário criar um sistema acessível para novos jogadores, mas com profundidade suficiente para manter o engajamento a longo prazo.\n\nAlém disso, o projeto exigiu a construção de um universo consistente, onde narrativa, mecânica e estética funcionassem de forma integrada, evitando que o jogo se tornasse apenas visualmente atrativo, mas superficial em gameplay.",
    "projdet.armagedom.process": "O desenvolvimento começou com a criação do conceito narrativo e definição do universo do jogo, seguido pela prototipagem das mecânicas principais (movimento, combate e progressão).\n\nEm paralelo, foi desenvolvido todo o sistema visual:\n\n• Identidade gráfica baseada em alto contraste (preto, branco e vermelho)\n• Ilustrações autorais para cartas e personagens\n• Design do tabuleiro e das peças físicas\n• Criação de manuais e materiais de apoio\n\nForam realizadas diversas iterações e testes de jogabilidade para ajustar regras, balanceamento e fluxo da experiência.",
    "projdet.armagedom.outcome": "O resultado foi um jogo completo e funcional, com sistema próprio de regras, identidade visual consolidada e alto nível de imersão. O projeto demonstra domínio de game design, direção de arte e desenvolvimento de produto físico.\n\nO sistema final apresenta forte coesão entre narrativa e mecânica, proporcionando uma experiência envolvente e estratégica para os jogadores.",
    "projdet.armagedom.cardCategory": "Identidade",
    "projdet.armagedom.cardDesc": "Identidade visual completa para o jogo de tabuleiro RPG Armagedom.",

    // Project detail UI labels
    "projdet.label.year": "Ano",
    "projdet.label.client": "Cliente",
    "projdet.label.audience": "Público-alvo",
    "projdet.label.about": "Sobre o Projeto",
    "projdet.label.challenge": "O Desafio",
    "projdet.label.process": "O Processo",
    "projdet.label.outcome": "O Resultado",
    "projdet.label.tools": "Ferramentas Utilizadas",
    "projdet.label.tags": "Tags",
    "projdet.label.descPanel": "Descrição do Projeto",
    "projdet.label.backToSlides": "Voltar para Imagens",
    "projdet.label.backToProjects": "Todos os Projetos",

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

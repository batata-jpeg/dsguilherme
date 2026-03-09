import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "pt";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.projects": "Projects",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.cta": "Let's Talk",
  },
  pt: {
    "nav.home": "Início",
    "nav.projects": "Projetos",
    "nav.about": "Sobre",
    "nav.contact": "Contato",
    "nav.cta": "Fale Comigo",
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

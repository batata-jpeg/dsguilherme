function envStr(key: string, fallback: string): string {
  const v = (import.meta.env[key] as string | undefined)?.trim();
  return v || fallback;
}

export const CONTACT_EMAIL = envStr("VITE_CONTACT_EMAIL", "guicarvalhoguima@gmail.com");
export const MAILTO_HREF = `mailto:${CONTACT_EMAIL}`;
export const WHATSAPP_CHAT_URL = envStr("VITE_WHATSAPP_URL", "https://wa.me/5534998855454?text=Ol%C3%A1%2C%20gostaria%20de%20contratar%20um%20servi%C3%A7o%20seu!");

export const SOCIAL = {
  linkedin: envStr(
    "VITE_LINKEDIN_URL",
    "https://www.linkedin.com/in/guilherme-carvalho-13a194293/?locale=en",
  ),
  instagram: envStr("VITE_INSTAGRAM_URL", "https://www.instagram.com/carvalhoguilherme_/"),
  behance: envStr("VITE_BEHANCE_URL", "https://www.behance.net/guilherguimara18/projects"),
  github: envStr("VITE_GITHUB_URL", "https://github.com/batata-jpeg"),
} as const;

export type SocialNetwork = "instagram" | "linkedin" | "behance" | "github";

export function socialHandleFromUrl(url: string, network: SocialNetwork): string {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    if (network === "instagram") {
      const h = parts[parts.length - 1] ?? "";
      return h ? `@${h}` : url;
    }
    if (network === "behance") {
      return parts[0] ?? url;
    }
    return parts[parts.length - 1] ?? url;
  } catch {
    return url;
  }
}

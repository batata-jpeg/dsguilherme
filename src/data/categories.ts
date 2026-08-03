// Content registry for the "O que eu crio" blocks on the home page.
//
// Each category opens a gallery modal. A category with an empty `items` array
// renders as a disabled block ("em breve") until the files land here — so the
// only thing needed to switch one on is adding its media below.

export interface GalleryItem {
  src: string;
  type: "image" | "video";
  /** Poster frame shown before a video loads. Ignored for images. */
  poster?: string;
  /** Optional. Omit for image-only cards — nothing is rendered without it. */
  title?: string;
  sub?: string;
}

/** A row in a link-list category (Websites), not a gallery thumbnail. */
export interface LinkItem {
  /** Dark artwork, used on the light plate in light mode. */
  logoBlack: string;
  /** Light artwork, used on the dark plate in dark mode. */
  logoWhite: string;
  name: string;
  description: string;
  url: string;
}

export interface CategoryGallery {
  id: string;
  /** Aspect ratio of the grid thumbnails, e.g. "3 / 4". */
  aspect: string;
  items: GalleryItem[];
  /** When set, the modal renders a link list instead of a photo grid. */
  links?: LinkItem[];
}

/** How many entries a category holds, whichever shape it uses. */
export function categoryCount(id: string): number {
  const g = CATEGORY_GALLERIES[id];
  if (!g) return 0;
  return g.links ? g.links.length : g.items.length;
}

export const CATEGORY_GALLERIES: Record<string, CategoryGallery> = {
  "3d": {
    id: "3d",
    aspect: "4 / 3",
    items: [],
  },
  videos: {
    id: "videos",
    aspect: "16 / 9",
    items: [],
  },
  imagens: {
    id: "imagens",
    aspect: "4 / 3",
    items: [],
  },
  ilustracao: {
    id: "ilustracao",
    // Matches the artwork's own 1640x2360 so object-fit: cover crops nothing.
    aspect: "1640 / 2360",
    // Image-only cards: no title, so nothing renders over the artwork.
    items: Array.from({ length: 9 }, (_, i) => ({
      src: `/ilustracoes/ilu-${String(i + 1).padStart(2, "0")}.jpg`,
      type: "image" as const,
    })),
  },
  motions: {
    id: "motions",
    aspect: "4 / 3",
    items: [],
  },
  websites: {
    id: "websites",
    aspect: "16 / 10",
    items: [],
    // Descriptions were written from what the repo already says about each
    // project — worth a read-through before this goes live.
    links: [
      {
        logoBlack: "/websites/guima-black.svg",
        logoWhite: "/websites/guima-white.svg",
        name: "Guima",
        description:
          "Meu portfólio. Reúne os trabalhos de branding, 3D, motion e ilustração, com o estudo de caso completo de cada projeto.",
        url: "https://dsguilherme.com.br",
      },
      {
        logoBlack: "/websites/hold-black.png",
        logoWhite: "/websites/hold-white.png",
        name: "Hold Corretora",
        description:
          "Site institucional da Hold Corretora, com a apresentação da empresa, os serviços oferecidos e os canais de contato para os clientes.",
        url: "https://holdcorretora.com",
      },
      {
        logoBlack: "/websites/prumo-black.svg",
        logoWhite: "/websites/prumo-white.svg",
        name: "Prumo Estúdio",
        description:
          "Estúdio digital que une estratégia, design e tecnologia. O site apresenta o posicionamento da marca e os serviços de criação de sites e identidade visual.",
        url: "https://prumoestudio.com.br",
      },
    ],
  },
};

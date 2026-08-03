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
  title: string;
  sub?: string;
}

export interface CategoryGallery {
  id: string;
  /** Aspect ratio of the grid thumbnails, e.g. "3 / 4". */
  aspect: string;
  items: GalleryItem[];
}

const bookPages: GalleryItem[] = Array.from({ length: 24 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    src: `/book/p${n}.jpg`,
    type: "image" as const,
    title: `Página ${i + 1}`,
    sub: "Do Verde às Cinzas",
  };
});

export const CATEGORY_GALLERIES: Record<string, CategoryGallery> = {
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
    aspect: "3 / 4",
    items: bookPages,
  },
  motions: {
    id: "motions",
    aspect: "4 / 3",
    items: [
      {
        src: "/prumo/prumo-03.gif",
        type: "image",
        title: "Prumo — Abertura",
        sub: "Motion / Identidade",
      },
      {
        src: "/prumo/prumo-07.gif",
        type: "image",
        title: "Prumo — Aplicação",
        sub: "Motion / Identidade",
      },
    ],
  },
  websites: {
    id: "websites",
    aspect: "16 / 10",
    items: [],
  },
};

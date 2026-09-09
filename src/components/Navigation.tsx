// Thin seam kept so App.tsx does not need to know which bar is in use.
// The previous PillNav implementation is still in the repo (PillNav.tsx/.css),
// unused, if the old three-capsule bar is ever wanted back.

import GlassNav from "@/components/GlassNav";

export default function Navigation() {
  return <GlassNav />;
}

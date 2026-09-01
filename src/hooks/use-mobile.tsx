import * as React from "react";

const MOBILE_BREAKPOINT = 1024;

export function useIsMobile() {
  // Resolved on the very first render, not after the first effect. Returning a
  // provisional `false` was not harmless: CategoryModal picks a different root
  // <motion.div> per breakpoint, so the desktop branch mounted first and the
  // mobile branch replaced it a tick later. React reuses that DOM node, framer
  // keeps its motion values, and the desktop `initial={{ opacity: 0 }}` was
  // left stranded — the mobile sheet opened fully transparent.
  const [isMobile, setIsMobile] = React.useState<boolean>(
    () => typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ClickSpark from "@/components/ClickSpark";
import PageTransition from "@/components/PageTransition";
import LampCord from "@/components/LampCord";
import ScrollToTop from "@/components/ScrollToTop";
import SiteBackground from "@/components/SiteBackground";

import Index from "./pages/Index.tsx";
import Projects from "./pages/Projects.tsx";
import ProjectDetail from "./pages/ProjectDetail.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

const queryClient = new QueryClient();

function NavigationWrapper() {
  const location = useLocation();
  const isProjectDetail = location.pathname.startsWith("/projects/") && location.pathname !== "/projects/";
  if (isProjectDetail) return null;
  return <Navigation />;
}

function AnimatedRoutes() {
  const location = useLocation();
  const isProjectDetail = location.pathname.startsWith("/projects/") && location.pathname !== "/projects/";

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
          <Route path="/projects/:id" element={<PageTransition><ProjectDetail /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
      {!isProjectDetail && <Footer />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SiteBackground />
            <LampCord />
            <div className="relative z-10 min-h-screen">
              <NavigationWrapper />
              <ClickSpark sparkColor="#ffffff" sparkRadius={30} sparkCount={10} extraScale={1.3}>
                <AnimatedRoutes />
              </ClickSpark>
              <ScrollToTop />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

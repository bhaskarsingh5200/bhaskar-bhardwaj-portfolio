import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Footer from "./components/Footer.jsx";
import SeoManager from "./components/SeoManager.jsx";
import SectionSkeleton from "./components/SectionSkeleton.jsx";
import NotFound from "./pages/NotFound.jsx";
import { ContentProvider, useContent } from "./context/ContentContext.jsx";
import { initAnalytics } from "./lib/analytics.js";
import { DEFAULT_PALETTE, PALETTES } from "./data/palettes.js";

const Projects = lazy(() => import("./components/Projects.jsx"));
const Services = lazy(() => import("./components/Services.jsx"));
const Pricing = lazy(() => import("./components/Pricing.jsx"));
const Process = lazy(() => import("./components/Process.jsx"));
const About = lazy(() => import("./components/About.jsx"));
const TechStack = lazy(() => import("./components/TechStack.jsx"));
const Contact = lazy(() => import("./components/Contact.jsx"));
const AdminApp = lazy(() => import("./admin/AdminApp.jsx"));

function Home() {
  return (
    <>
      <Hero />
      <Suspense fallback={<SectionSkeleton />}>
        <Projects />
        <Services />
        <Pricing />
        <Process />
        <About />
        <TechStack />
        <Contact />
      </Suspense>
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ThemeApplier() {
  const { pathname } = useLocation();
  const { settings } = useContent();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    const root = document.documentElement;
    if (isAdmin) {
      root.removeAttribute("data-theme");
      return;
    }
    const palette = settings?.theme_palette || DEFAULT_PALETTE;
    const previous = root.getAttribute("data-theme");
    if (PALETTES.some((p) => p.id === palette)) {
      if (previous && previous !== palette) {
        root.classList.add("theme-flip");
      }
      root.setAttribute("data-theme", palette);
      try {
        localStorage.setItem("bb-site-theme", palette);
      } catch (e) {}
      if (previous && previous !== palette) {
        requestAnimationFrame(() => root.classList.remove("theme-flip"));
      }
    } else {
      root.removeAttribute("data-theme");
    }
  }, [settings, isAdmin]);

  return null;
}

function Shell() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {!isAdmin && <Navbar />}
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={null}>
                <AdminApp />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}

export default function App() {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <ContentProvider>
        <SeoManager />
        <ThemeApplier />
        <MotionConfig reducedMotion="user">
          <Shell />
        </MotionConfig>
      </ContentProvider>
    </BrowserRouter>
  );
}

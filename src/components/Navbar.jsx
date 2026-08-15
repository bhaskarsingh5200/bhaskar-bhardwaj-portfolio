import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { navigation } from "../data/site.js";
import { useContent } from "../context/ContentContext.jsx";
import { useScrolled } from "../hooks/useScrolled.js";
import { useActiveSection } from "../hooks/useActiveSection.js";
import { trackEvent } from "../lib/analytics.js";
import Button from "./Button.jsx";

const SECTION_IDS = ["work", "services", "pricing", "about", "contact"];

export default function Navbar() {
  const { settings } = useContent();
  const scrolled = useScrolled(24);
  const active = useActiveSection(SECTION_IDS);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);

  const closeMenu = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";

    const firstFocusable = menuRef.current?.querySelector("a, button");
    firstFocusable?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMenu();
        return;
      }
      if (event.key === "Tab" && menuRef.current) {
        const focusable = Array.from(
          menuRef.current.querySelectorAll("a, button")
        ).filter((el) => !el.hasAttribute("disabled"));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [open, closeMenu]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[var(--nav-height)] border-b transition-[background-color,border-color,backdrop-filter,box-shadow] duration-300 ${
        scrolled
          ? "border-line bg-base/85 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="shell flex h-full items-center justify-between">
        <a href="#top" className="group flex items-baseline gap-px font-heading text-[1.3rem] font-bold tracking-[0.02em]" aria-label="Bhaskar Bhardwaj — back to top">
          <span className="text-ink">{settings?.firstName || "Bhaskar"}</span>
          <span className="text-accent">.</span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {navigation.map((item) => {
            const isActive = active === item.href.replace("#", "");
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={`text-[0.92rem] font-medium transition-colors duration-200 ${
                  isActive ? "text-accent" : "text-ink-secondary hover:text-ink"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            href="#contact"
            size="sm"
            className="hidden lg:inline-flex"
            onClick={() => trackEvent("nav_start_project")}
          >
            Start a Project
            <ArrowRight size={15} className="btn-arrow" />
          </Button>

          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-line-strong text-ink lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-base/95 backdrop-blur-xl lg:hidden"
          >
            <nav className="flex w-full flex-col items-center gap-1 px-6 pb-8 pt-24 text-center" aria-label="Mobile">
              {navigation.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 * (index + 1) }}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 py-2 font-heading text-[clamp(1.7rem,6vw,2.4rem)] font-bold tracking-[-0.02em] ${
                    active === item.href.replace("#", "")
                      ? "text-accent"
                      : "text-ink hover:text-accent"
                  }`}
                >
                  <span className="font-body text-[0.8rem] font-medium tracking-[0.1em] text-accent">
                    0{index + 1}
                  </span>
                  {item.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 * (navigation.length + 2) }}
                className="mt-8"
              >
                <Button href="#contact" size="lg" onClick={closeMenu}>
                  Start a Project
                  <ArrowRight size={17} className="btn-arrow" />
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

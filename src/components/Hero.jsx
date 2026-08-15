import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ease, slideRight } from "../lib/motion.js";
import { hero as fallbackHero, socialLinks } from "../data/site.js";
import { useContent } from "../context/ContentContext.jsx";
import { trackEvent } from "../lib/analytics.js";
import { GithubIcon, LinkedinIcon } from "./BrandIcons.jsx";
import Button from "./Button.jsx";

const step = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease, delay: 0.12 * i }
  })
};

const float = {
  animate: { y: [0, -7, 0] },
  transition: { duration: 5.5, ease: "easeInOut", repeat: Infinity }
};

const FLOATING_CHIPS = [
  { label: "React", className: "left-2 top-[12%] lg:-left-4" },
  { label: "WordPress", className: "right-0 top-[34%] lg:-right-3" },
  { label: "Mobile-first", className: "bottom-[12%] left-4 lg:-left-2" }
];

const SOCIAL_ICONS = { LinkedIn: LinkedinIcon, GitHub: GithubIcon };

const MARQUEE_ITEMS = [
  "React",
  "WordPress",
  "JavaScript",
  "Tailwind CSS",
  "HTML & CSS",
  "Responsive Design",
  "SEO",
  "Performance"
];

export default function Hero() {
  const { settings } = useContent();
  const heroData = {
    eyebrow: settings?.hero_eyebrow || fallbackHero.eyebrow,
    name: settings?.name || fallbackHero.name,
    roleBefore: fallbackHero.roleBefore,
    roleAccent: fallbackHero.roleAccent,
    description: settings?.hero_description || fallbackHero.description,
    primaryCta: fallbackHero.primaryCta,
    secondaryCta: fallbackHero.secondaryCta
  };

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <div className="shell relative grid flex-1 items-center gap-12 pb-[clamp(2rem,4vw,3rem)] pt-[calc(var(--nav-height)+clamp(2.5rem,6vw,4rem))] lg:grid-cols-[1.05fr_0.95fr] lg:gap-[clamp(2.5rem,5vw,4.5rem)]">
        <div className="max-w-[600px]">
          <motion.div variants={step} custom={1} initial="hidden" animate="visible" className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-line bg-base/60 px-4 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-[0.82rem] font-medium text-ink-secondary">Available for new projects</span>
          </motion.div>

          <motion.h1
            variants={step}
            custom={2}
            initial="hidden"
            animate="visible"
            className="mb-4 font-heading text-[clamp(2.6rem,6vw,4.1rem)] font-extrabold leading-[1.05] tracking-[-0.035em]"
          >
            Hi, I'm{" "}
            <span className="accent-text-gradient">{heroData.name}</span>
          </motion.h1>

          <motion.p variants={step} custom={3} initial="hidden" animate="visible" className="mb-6 font-heading text-[clamp(1.05rem,1.8vw,1.3rem)] font-medium text-ink-secondary">
            {heroData.roleBefore} <span className="font-bold text-accent">{heroData.roleAccent}</span>
          </motion.p>

          <motion.p
            variants={step}
            custom={4}
            initial="hidden"
            animate="visible"
            className="mb-8 max-w-[52ch] text-[0.98rem] leading-relaxed text-ink-secondary"
          >
            {heroData.description}
          </motion.p>

          <motion.div variants={step} custom={5} initial="hidden" animate="visible" className="mb-9 flex items-center gap-3">
            {socialLinks.map(({ label, href }) => {
              const Icon = SOCIAL_ICONS[label];
              if (!Icon) return null;
              return (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  onClick={() => trackEvent("social_click", { network: label })}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-ink-secondary transition-colors duration-300 hover:border-accent hover:text-accent"
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </motion.div>

          <motion.div variants={step} custom={6} initial="hidden" animate="visible" className="flex flex-wrap items-center gap-3.5">
            <Button href={heroData.primaryCta.href} onClick={() => trackEvent("start_project")}>
              {heroData.primaryCta.label}
              <ArrowRight size={17} className="btn-arrow" />
            </Button>
            <Button href={heroData.secondaryCta.href} variant="secondary" onClick={() => trackEvent("view_work")}>
              {heroData.secondaryCta.label}
            </Button>
          </motion.div>
        </div>

        <motion.div variants={slideRight} initial="hidden" animate="visible" className="relative mx-auto flex w-full max-w-[420px] items-center justify-center py-8 lg:py-0">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 animate-glow-breathe rounded-full bg-accent/20 blur-[90px]" aria-hidden="true" />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgb(var(--accent) / 0.35), rgb(var(--accent) / 0.05) 60%, transparent 75%)"
            }}
            aria-hidden="true"
          />

          <motion.div {...float} className="relative z-10 w-[78%]">
            <div
              className="rounded-[24px] p-[2px] shadow-blue-glow"
              style={{
                background:
                  "linear-gradient(135deg, rgb(var(--accent-grad-from)), rgb(var(--accent-grad-to)))"
              }}
            >
              <div className="overflow-hidden rounded-[22px] bg-base">
                <img
                  src="/images/portrait-2.png"
                  alt={`${heroData.name} — web developer portrait`}
                  loading="eager"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {FLOATING_CHIPS.map(({ label, className }) => (
            <motion.span
              key={label}
              {...float}
              transition={{ ...float.transition, delay: 1.4 }}
              className={`absolute z-20 hidden items-center gap-2 rounded-full border border-line bg-surface/90 px-3.5 py-2 text-[0.78rem] font-medium text-ink backdrop-blur-md sm:flex ${className}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {label}
            </motion.span>
          ))}
        </motion.div>
      </div>

      <div className="border-t border-line py-5" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {MARQUEE_ITEMS.map((item) => (
                <span key={`${copy}-${item}`} className="mx-6 flex items-center gap-6 font-heading text-[0.85rem] font-medium uppercase tracking-[0.18em] text-ink-muted">
                  {item}
                  <span className="text-accent">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

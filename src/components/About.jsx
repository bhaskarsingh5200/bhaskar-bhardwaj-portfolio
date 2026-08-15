import { motion } from "framer-motion";
import { Handshake, MonitorSmartphone, Search, Zap } from "lucide-react";
import { fadeUpStagger, viewport } from "../lib/motion.js";
import { useContent } from "../context/ContentContext.jsx";
import { trackEvent } from "../lib/analytics.js";
import Button from "./Button.jsx";

const HIGHLIGHT_ICONS = {
  responsive: MonitorSmartphone,
  bolt: Zap,
  search: Search,
  handshake: Handshake
};

export default function About() {
  const { about, highlights, loading } = useContent();

  if (loading) {
    return (
      <section id="about" className="section bg-surface" aria-hidden="true">
        <div className="shell grid grid-cols-1 items-start gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-[0.8fr_1.2fr]">
          <div className="skeleton aspect-square rounded-full" />
          <div>
            <div className="skeleton mb-4 h-5 w-24 rounded-full" />
            <div className="skeleton mb-8 h-12 w-full max-w-sm rounded-[12px]" />
            <div className="skeleton mb-4 h-4 w-full rounded" />
            <div className="skeleton h-4 w-4/5 rounded" />
          </div>
        </div>
      </section>
    );
  }

  const aboutData = about || { heading: "About Me", copy: [], profileImage: "", gallery: [] };
  const paragraphs = aboutData.copy.length ? aboutData.copy.slice(0, 2) : [];
  const profileImage = aboutData.profileImage || "/images/portrait-2.png";

  return (
    <section id="about" className="section bg-surface">
      <div className="shell grid grid-cols-1 items-center gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-[0.85fr_1.15fr]">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewport}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[340px] lg:max-w-none"
        >
          <div className="relative mx-auto aspect-square w-full max-w-[340px]">
            <div className="pointer-events-none absolute inset-0 animate-glow-breathe rounded-full bg-accent/25 blur-[70px]" aria-hidden="true" />
            <div
              className="absolute inset-[7%] rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, rgb(var(--accent-grad-from)), rgb(var(--accent-grad-to)))"
              }}
              aria-hidden="true"
            />
            <img
              src={profileImage}
              alt="Portrait of Bhaskar Bhardwaj"
              loading="lazy"
              className="absolute inset-[11%] aspect-square w-[78%] rounded-full border border-accent/40 object-cover object-[center_20%] shadow-blue-glow"
            />
          </div>
        </motion.div>

        <div>
          <motion.span variants={fadeUpStagger} custom={0} initial="hidden" whileInView="visible" viewport={viewport} className="eyebrow">
            About
          </motion.span>

          <motion.h2 variants={fadeUpStagger} custom={1} initial="hidden" whileInView="visible" viewport={viewport} className="heading-2">
            {aboutData.heading || "About Me"}
          </motion.h2>

          <motion.p variants={fadeUpStagger} custom={2} initial="hidden" whileInView="visible" viewport={viewport} className="mb-1 font-heading text-[1.05rem] font-semibold text-ink-secondary">
            And I'm a <span className="font-bold text-accent">Web Developer</span>
          </motion.p>

          <motion.div
            variants={fadeUpStagger}
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="mb-9 mt-5 flex flex-col gap-4"
          >
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={index === 0 ? "text-[1rem] leading-relaxed" : "text-[0.95rem] leading-relaxed text-ink-secondary"}
              >
                {paragraph}
              </p>
            ))}
          </motion.div>

          {aboutData.gallery.length > 0 && (
            <motion.div
              variants={fadeUpStagger}
              custom={4}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="mb-9 grid max-w-md grid-cols-3 gap-3"
            >
              {aboutData.gallery.map((src, index) => (
                <motion.div
                  key={src}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="group overflow-hidden rounded-[10px] border border-line"
                >
                  <img
                    src={src}
                    alt={`Bhaskar Bhardwaj photo ${index + 1}`}
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {(highlights?.length ?? 0) > 0 && (
            <motion.ul
              variants={fadeUpStagger}
              custom={5}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="mb-10 grid max-w-xl grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2"
            >
              {highlights.map((item) => {
                const Icon = HIGHLIGHT_ICONS[item.icon] || Zap;
                return (
                  <li key={item.id ?? item.title} className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] border border-accent/20 bg-accent-soft text-accent">
                      <Icon size={18} />
                    </span>
                    <span>
                      <span className="block text-[0.95rem] font-semibold">{item.title}</span>
                      <span className="mt-0.5 block text-[0.82rem] leading-relaxed text-ink-secondary">
                        {item.description}
                      </span>
                    </span>
                  </li>
                );
              })}
            </motion.ul>
          )}

          <motion.div variants={fadeUpStagger} custom={6} initial="hidden" whileInView="visible" viewport={viewport}>
            <Button href="#work" variant="secondary" onClick={() => trackEvent("about_see_more")}>
              See My Work
              <ArrowRightInline />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ArrowRightInline() {
  return (
    <span className="btn-arrow" aria-hidden="true">
      →
    </span>
  );
}

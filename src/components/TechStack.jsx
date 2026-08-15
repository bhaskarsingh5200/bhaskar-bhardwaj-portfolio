import { motion } from "framer-motion";
import { fadeUpStagger, viewport } from "../lib/motion.js";
import { techStack as fallbackTechStack } from "../data/technologies.js";
import { useContent } from "../context/ContentContext.jsx";
import SectionHeading from "./SectionHeading.jsx";
import SectionSkeleton from "./SectionSkeleton.jsx";
import IconByName from "./IconByName.jsx";

export default function TechStack() {
  const { skills, loading } = useContent();

  if (loading) return <SectionSkeleton />;

  const categories = skills || [];
  const techStack = fallbackTechStack;

  return (
    <section id="stack" className="section">
      <div className="shell">
        <SectionHeading eyebrow={techStack.eyebrow} title={techStack.title} subtitle={techStack.subtitle} />

        <div className="mt-[clamp(2.5rem,5vw,4rem)] grid grid-cols-1 gap-[clamp(1.25rem,3vw,1.75rem)] md:grid-cols-3">
          {categories.map((category, catIndex) => (
            <motion.div
              key={category.id}
              variants={fadeUpStagger}
              custom={catIndex}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="group rounded-card border border-line bg-surface/60 p-[clamp(1.5rem,3vw,2rem)] transition-colors duration-300 hover:border-accent/40"
            >
              <h3 className="mb-5 font-heading text-[0.95rem] font-bold tracking-[-0.01em] text-ink-secondary">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((tech) => (
                  <span
                    key={tech.name}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-base/60 px-3.5 py-1.5 text-[0.85rem] font-medium text-ink-secondary transition-colors duration-300 hover:border-accent/40 hover:text-accent"
                  >
                    <span className="text-ink-muted" aria-hidden="true">
                      <IconByName name={tech.icon} size={14} />
                    </span>
                    {tech.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

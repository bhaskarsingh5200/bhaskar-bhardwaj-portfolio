import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { fadeUpStagger, viewport } from "../lib/motion.js";
import { trackEvent } from "../lib/analytics.js";
import ProjectMockup from "./ProjectMockup.jsx";
import { GithubIcon } from "./BrandIcons.jsx";

const linkButtons = [
  { key: "live", label: "View Project", field: "liveUrl", icon: ArrowUpRight },
  { key: "case", label: "Case Study", field: "caseStudyUrl", icon: ArrowUpRight },
  { key: "source", label: "Source", field: "githubUrl", icon: GithubIcon }
];

export default function ProjectCard({ project, index }) {
  const availableLinks = linkButtons.filter(({ field }) => project[field]);

  return (
    <motion.article
      variants={fadeUpStagger}
      custom={index % 2}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface/60 transition-colors duration-500 hover:border-accent/30 hover:shadow-card"
    >
      <div className="relative overflow-hidden border-b border-line bg-base/60">
        {project.image ? (
          <div className="p-[clamp(1.1rem,2.5vw,1.7rem)]">
            <img
              src={project.image}
              alt={`${project.name} screenshot`}
              loading="lazy"
              className="aspect-[16/10] w-full rounded-[10px] border border-line bg-surface object-cover"
            />
          </div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="p-[clamp(1.1rem,2.5vw,1.7rem)]"
          >
            <ProjectMockup variant={project.mockup} />
          </motion.div>
        )}

        <span className="pointer-events-none absolute right-[clamp(1.1rem,2.5vw,1.7rem)] top-[clamp(0.9rem,2vw,1.4rem)] z-10 font-heading text-[clamp(2.6rem,5vw,3.4rem)] font-extrabold tracking-[-0.04em] text-transparent transition-colors duration-300 [-webkit-text-stroke:1px_rgba(255,255,255,0.22)] group-hover:text-accent group-hover:[-webkit-text-stroke-color:transparent]">
          {project.number || project.id}        </span>

        <span className="absolute left-[clamp(1.1rem,2.5vw,1.7rem)] top-[clamp(0.9rem,2vw,1.4rem)] z-10 rounded-full border border-line-strong bg-black/60 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink-secondary backdrop-blur-sm">
          Concept Project
        </span>
      </div>

      <div className="flex flex-1 flex-col p-[clamp(1.5rem,3vw,2rem)]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <span className="font-heading text-[0.7rem] font-bold uppercase tracking-[0.18em] text-ink-muted">
            Project {project.number || project.id}
          </span>
          <span className="text-right text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-accent">
            {project.category}
          </span>
        </div>

        <h3 className="mb-3 text-[clamp(1.5rem,3vw,1.9rem)] font-extrabold tracking-[-0.02em]">
          {project.name}
        </h3>
        <p className="mb-5 max-w-[52ch] text-[0.95rem] leading-relaxed text-ink-secondary">
          {project.description}
        </p>

        <div className="mb-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        {availableLinks.length > 0 ? (
          <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-5">
            {availableLinks.map(({ key, label, field, icon: Icon }) => (
              <a
                key={key}
                href={project[field]}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("view_project", { project: project.name, link: key })}
                className="group/link inline-flex items-center gap-2 font-heading text-[0.95rem] font-semibold transition-colors duration-300 hover:text-accent"
              >
                {label}
                <Icon size={16} className="transition-transform duration-300 group-hover/link:translate-x-1.5" aria-hidden="true" />
              </a>
            ))}
          </div>
        ) : (
          <span
            aria-disabled="true"
            title="Link coming soon"
            className="mt-auto inline-flex items-center gap-2 border-t border-line pt-5 font-heading text-[0.95rem] font-semibold text-ink/60"
          >
            Coming Soon
          </span>
        )}
      </div>
    </motion.article>
  );
}

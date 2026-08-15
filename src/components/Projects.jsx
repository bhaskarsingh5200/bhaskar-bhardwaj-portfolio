import { useContent } from "../context/ContentContext.jsx";
import SectionHeading from "./SectionHeading.jsx";
import SectionSkeleton from "./SectionSkeleton.jsx";
import ProjectCard from "./ProjectCard.jsx";

export default function Projects() {
  const { projects, loading } = useContent();

  if (loading) return <SectionSkeleton />;

  const items = projects || [];

  return (
    <section id="work" className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="Selected Work"
          title="Selected Work"
          subtitle="A selection of websites and digital experiences I've designed and developed."
        />

        {items.length > 0 ? (
          <div className="mt-[clamp(3rem,6vw,4.5rem)] grid grid-cols-1 gap-[clamp(1.5rem,3vw,2.5rem)] lg:grid-cols-2">
            {items.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <p className="mt-[clamp(3rem,6vw,4.5rem)] text-[0.95rem] text-ink-muted">
            No published projects yet.
          </p>
        )}
      </div>
    </section>
  );
}

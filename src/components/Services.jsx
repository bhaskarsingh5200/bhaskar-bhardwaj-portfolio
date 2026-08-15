import { motion } from "framer-motion";
import {
  Bot,
  Code,
  Dumbbell,
  Globe,
  Layers,
  MapPin,
  Megaphone,
  ShoppingBag,
  Sparkles
} from "lucide-react";
import { fadeUpStagger, viewport } from "../lib/motion.js";
import { useContent } from "../context/ContentContext.jsx";
import SectionHeading from "./SectionHeading.jsx";
import SectionSkeleton from "./SectionSkeleton.jsx";

const ICON_MAP = {
  browser: Globe,
  layers: Layers,
  bag: ShoppingBag,
  code: Code,
  dumbbell: Dumbbell,
  megaphone: Megaphone,
  "map-pin": MapPin,
  bot: Bot
};

const GROUPS = [
  { id: "web", label: "Web Development" },
  { id: "digital", label: "Digital Growth" }
];

function ServiceCard({ service, index }) {
  const Icon = ICON_MAP[service.icon] || Sparkles;
  return (
    <motion.div
      variants={fadeUpStagger}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface/60 p-[clamp(1.5rem,3vw,2rem)] transition-colors duration-300 hover:border-accent/40"
    >
      <span className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" aria-hidden="true" />

      <span
        className="pointer-events-none absolute -bottom-2 -right-2 font-heading text-[3.4rem] font-extrabold leading-none tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.08)] transition-colors duration-300 group-hover:[-webkit-text-stroke-color:rgba(0,149,255,0.4)]"
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <span className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-[10px] border border-accent/20 bg-accent-soft text-accent">
        <Icon size={22} />
      </span>

      <h3 className="mb-3 text-[1.15rem] font-bold tracking-[-0.01em]">{service.title}</h3>
      <p className="max-w-[42ch] text-[0.92rem] leading-relaxed text-ink-secondary">
        {service.description}
      </p>
    </motion.div>
  );
}

export default function Services() {
  const { services, loading } = useContent();

  if (loading) return <SectionSkeleton />;

  const items = services || [];

  return (
    <section id="services" className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="Services"
          title="Everything Your Business Needs Online"
          subtitle="Focused services that build, grow and promote your business — websites plus the digital services that bring you customers."
        />

        {GROUPS.map((group, groupIndex) => {
          const groupItems = items.filter((s) => (s.group || "web") === group.id);
          if (groupItems.length === 0) return null;
          return (
            <div key={group.id}>
              <div className="mt-[clamp(2.5rem,5vw,4rem)] mb-6 flex items-center gap-4">
                <h3 className="font-heading text-[1.05rem] font-bold tracking-[-0.01em]">
                  {group.label}
                </h3>
                <span className="h-px flex-1 bg-line" aria-hidden="true" />
              </div>
              <div className="grid grid-cols-1 gap-[clamp(1.25rem,3vw,1.75rem)] md:grid-cols-2 lg:grid-cols-3">
                {groupItems.map((service, index) => (
                  <ServiceCard key={service.id} service={service} index={index + groupIndex} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

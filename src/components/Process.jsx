import { motion } from "framer-motion";
import { fadeUpStagger, viewport } from "../lib/motion.js";
import { process } from "../data/services.js";
import SectionHeading from "./SectionHeading.jsx";

export default function Process() {
  return (
    <section id="process" className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="Process"
          title="How I Work"
          subtitle="A clear, collaborative process designed to take a project from first conversation to a polished, working launch."
        />

        <div className="relative mt-[clamp(3rem,6vw,4.5rem)] pl-10 md:pl-0">
          <span
            className="absolute bottom-6 left-[19px] top-[19px] w-px bg-line-strong md:bottom-auto md:left-6 md:right-6 md:top-[29px] md:h-px md:w-auto"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 gap-0 md:grid-cols-4 md:gap-[clamp(1.5rem,3vw,2.5rem)]">
            {process.map((step, index) => (
              <motion.div
                key={step.id}
                variants={fadeUpStagger}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative pb-10 pl-9 md:pb-0 md:pl-0 md:pt-1"
              >
                <span className="absolute left-0 top-0 z-10 flex h-[38px] w-[38px] items-center justify-center rounded-full border border-line-strong bg-base font-heading text-[0.8rem] font-bold text-ink-secondary md:static md:mb-6 md:flex md:h-[58px] md:w-[58px] md:text-[1.05rem] md:transition-[color,border-color,background-color,box-shadow] md:hover:border-accent/50 md:hover:bg-accent-soft md:hover:text-accent md:hover:shadow-[0_0_0_6px_rgb(var(--accent)_/_0.08)]">
                  {step.id}
                </span>

                <h3 className="mb-2 text-[1.15rem] font-bold tracking-[-0.02em] md:mb-2.5 md:text-[1.2rem]">
                  {step.title}
                </h3>
                <p className="max-w-[30ch] text-[0.92rem] leading-relaxed text-ink-secondary">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { fadeUpStagger, viewport } from "../lib/motion.js";

export default function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="max-w-[720px]">
      <motion.span
        variants={fadeUpStagger}
        initial="hidden"
        whileInView="visible"
        custom={0}
        viewport={viewport}
        className="eyebrow"
      >
        {eyebrow}
      </motion.span>
      <motion.h2
        variants={fadeUpStagger}
        initial="hidden"
        whileInView="visible"
        custom={1}
        viewport={viewport}
        className="heading-2"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeUpStagger}
          initial="hidden"
          whileInView="visible"
          custom={2}
          viewport={viewport}
          className="max-w-[52ch] text-[clamp(1rem,2vw,1.15rem)] text-ink-secondary"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

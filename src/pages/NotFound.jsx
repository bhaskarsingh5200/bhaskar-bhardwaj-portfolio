import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ease } from "../lib/motion.js";

export default function NotFound() {
  return (
    <section className="fill-height shell flex flex-col items-center justify-center pt-[var(--nav-height)] pb-20 text-center">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="font-heading text-[clamp(6rem,22vw,11rem)] font-extrabold leading-none tracking-[-0.05em] text-transparent [-webkit-text-stroke:1.5px_rgb(var(--accent)_/_0.45)]"
        aria-hidden="true"
      >
        404
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.12 }}
        className="heading-2 mt-4"
      >
        Page Not Found
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.2 }}
        className="mb-10 max-w-[46ch] text-[1.02rem] leading-relaxed text-ink-secondary"
      >
        The page you're looking for doesn't exist or may have been moved.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.28 }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 rounded-[10px] bg-accent px-7 py-3.5 font-heading text-[0.95rem] font-semibold text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] transition-colors duration-300 hover:bg-accent-hover"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Back to Home
        </Link>
      </motion.div>
    </section>
  );
}

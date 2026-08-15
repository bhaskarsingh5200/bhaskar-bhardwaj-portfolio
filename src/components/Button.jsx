import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-accent text-white shadow-[0_10px_28px_-12px_rgb(var(--accent)_/_0.6),inset_0_1px_0_rgba(255,255,255,0.16)] hover:bg-accent-hover",
  secondary:
    "border border-line-strong text-ink hover:border-accent/50 hover:text-accent"
};

const sizes = {
  sm: "px-[1.15rem] py-[0.62rem] text-[0.88rem]",
  md: "px-[1.6rem] py-[0.9rem] text-[0.95rem]",
  lg: "px-[1.9rem] py-[1.05rem] text-[1rem]"
};

export default function Button({ variant = "primary", size = "md", className = "", children, ...rest }) {
  return (
    <motion.a
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-[7px] font-heading font-semibold transition-colors duration-300 ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </motion.a>
  );
}

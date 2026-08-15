import { motion } from "framer-motion";
import { ArrowRight, Check, Info, X } from "lucide-react";
import { fadeUpStagger, viewport } from "../lib/motion.js";
import SectionHeading from "./SectionHeading.jsx";
import Button from "./Button.jsx";
import { pricingComparison, pricingTiers } from "../data/pricing.js";

function ValueCell({ value }) {
  if (value === "yes") {
    return (
      <td className="px-4 py-3 text-center">
        <Check size={16} strokeWidth={3} className="mx-auto text-accent" aria-label="Included" />
      </td>
    );
  }
  if (value === "no") {
    return (
      <td className="px-4 py-3 text-center">
        <X size={15} className="mx-auto text-ink-muted/50" aria-label="Not included" />
      </td>
    );
  }
  return (
    <td className="px-4 py-3 text-center">
      <span className="text-[0.78rem] font-medium leading-tight text-ink-secondary">{value}</span>
    </td>
  );
}

function TierCard({ tier, index }) {
  return (
    <motion.div
      variants={fadeUpStagger}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative flex flex-col rounded-card border bg-surface/60 p-6 transition-colors duration-300 ${
        tier.popular
          ? "border-accent/60 shadow-[0_24px_60px_-28px_rgb(var(--accent)_/_0.45)]"
          : "border-line hover:border-accent/40"
      }`}
    >
      {tier.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-3.5 py-1 font-heading text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white shadow-lg">
          ⭐ Most Popular
        </span>
      )}

      <div className="mb-4 flex items-center justify-between">
        <span className="text-[1.4rem]" aria-hidden="true">{tier.dot}</span>
        <span className="rounded-full border border-line bg-base px-3 py-1 text-[0.72rem] font-medium text-ink-secondary">
          {tier.audience}
        </span>
      </div>

      <h3 className="font-heading text-[1.15rem] font-extrabold tracking-[-0.01em]">{tier.name}</h3>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="font-heading text-[clamp(1.7rem,3vw,2rem)] font-extrabold tracking-[-0.02em]">
          {tier.price}
        </span>
        <span className="text-[0.8rem] text-ink-muted">one-time</span>
      </div>

      <p className="mt-3 text-[0.88rem] leading-relaxed text-ink-secondary">{tier.blurb}</p>

      <ul className="mt-5 flex flex-col gap-2.5 border-t border-line pt-5">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-[0.86rem] leading-snug text-ink-secondary">
            <Check size={15} strokeWidth={3} className="mt-0.5 shrink-0 text-accent" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <Button
          variant={tier.popular ? "primary" : "secondary"}
          size="md"
          href="#contact"
          className="w-full"
        >
          {tier.popular ? "Choose Professional" : `Get ${tier.name}`}
          <ArrowRight size={16} className="btn-arrow" />
        </Button>
      </div>
    </motion.div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="Pricing"
          title="Gym Website Packages"
          subtitle="One-time build pricing for gym & fitness websites — from a professional website to a complete business management system. Choose the package that fits your budget and growth stage."
        />

        <motion.div
          variants={fadeUpStagger}
          custom={3}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-6 flex max-w-[760px] items-start gap-3 rounded-card border border-accent/25 bg-accent-soft px-4 py-3.5"
        >
          <Info size={17} className="mt-0.5 shrink-0 text-accent" />
          <p className="text-[0.85rem] leading-relaxed text-ink-secondary">
            <span className="font-semibold text-ink">Third-party costs are extra</span> — domain, hosting, payment
            gateway, WhatsApp API, and professional photography are billed at actual cost, separate from the package
            price.
          </p>
        </motion.div>

        <div className="mt-[clamp(2.5rem,5vw,4rem)] grid grid-cols-1 gap-[clamp(1.25rem,2vw,1.5rem)] md:grid-cols-2 xl:grid-cols-4">
          {pricingTiers.map((tier, index) => (
            <TierCard key={tier.id} tier={tier} index={index} />
          ))}
        </div>

        <motion.div
          variants={fadeUpStagger}
          custom={4}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-[clamp(3rem,6vw,4.5rem)] overflow-hidden rounded-card border border-line bg-surface/40"
        >
          <div className="border-b border-line px-5 py-5 sm:px-7">
            <h3 className="font-heading text-[1.15rem] font-bold tracking-[-0.01em]">Full Feature Comparison</h3>
            <p className="mt-1 text-[0.85rem] text-ink-muted">Everything included in each package, side by side.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-surface-2/60">
                  <th className="sticky left-0 bg-surface-2/60 px-5 py-4 font-heading text-[0.72rem] font-bold uppercase tracking-[0.14em] text-ink-muted sm:px-7">
                    Feature
                  </th>
                  {pricingTiers.map((tier) => (
                    <th
                      key={tier.id}
                      className={`px-4 py-4 text-center font-heading text-[0.82rem] font-bold ${
                        tier.popular ? "text-accent" : "text-ink"
                      }`}
                    >
                      <span className="mr-1" aria-hidden="true">{tier.dot}</span>
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pricingComparison.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 1 ? "bg-surface-2/30" : ""}>
                    <td className="sticky left-0 bg-surface/40 px-5 py-3 text-[0.88rem] font-medium sm:px-7">
                      {row.feature}
                    </td>
                    {row.values.map((value, j) => (
                      <ValueCell key={j} value={value} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

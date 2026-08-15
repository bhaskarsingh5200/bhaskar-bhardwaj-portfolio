import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Info, X } from "lucide-react";
import { fadeUpStagger, viewport } from "../lib/motion.js";
import SectionHeading from "./SectionHeading.jsx";
import Button from "./Button.jsx";
import { pricingCategories } from "../data/pricing.js";
import { useState } from "react";

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

function TierCard({ tier }) {
  return (
    <motion.div
      layout
      variants={fadeUpStagger}
      custom={0}
      initial="hidden"
      animate="visible"
      viewport={viewport}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative flex flex-col rounded-card border bg-surface/60 p-6 ${
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
  const [activeId, setActiveId] = useState(pricingCategories[0].id);
  const active = pricingCategories.find((c) => c.id === activeId) || pricingCategories[0];
  const cols = active.tiers.length === 4 ? "xl:grid-cols-4" : "xl:grid-cols-3";

  return (
    <section id="pricing" className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="Pricing"
          title="Website Packages for Every Business"
          subtitle="Pick your business type to see the packages — one-time build pricing, from a professional website to a complete business system. Choose the package that fits your budget and growth stage."
        />

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:justify-center">
          {pricingCategories.map((cat) => {
            const isActive = cat.id === activeId;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveId(cat.id)}
                aria-pressed={isActive}
                className={`shrink-0 rounded-full border px-4 py-2 text-[0.85rem] font-semibold transition-colors duration-200 ${
                  isActive
                    ? "border-accent bg-accent text-white shadow-[0_10px_30px_-12px_rgb(var(--accent)_/_0.6)]"
                    : "border-line bg-surface/60 text-ink-secondary hover:border-accent/50 hover:text-ink"
                }`}
              >
                <span className="mr-1.5" aria-hidden="true">{cat.emoji}</span>
                {cat.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="mt-14 text-center">
              <h3 className="font-heading text-[clamp(1.3rem,2.4vw,1.6rem)] font-extrabold tracking-[-0.01em]">
                {active.heading}
              </h3>
              <p className="mx-auto mt-2 max-w-[680px] text-[0.9rem] leading-relaxed text-ink-secondary">
                {active.subtitle}
              </p>
            </div>

            <motion.div
              variants={fadeUpStagger}
              custom={3}
              initial="hidden"
              animate="visible"
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

            <div className={`mx-auto mt-[clamp(2.5rem,5vw,4rem)] grid grid-cols-1 gap-[clamp(1.25rem,2vw,1.5rem)] md:grid-cols-2 ${cols}`}>
              {active.tiers.map((tier) => (
                <TierCard key={tier.id} tier={tier} />
              ))}
            </div>

            <motion.div
              variants={fadeUpStagger}
              custom={4}
              initial="hidden"
              animate="visible"
              viewport={viewport}
              className="mt-[clamp(3rem,6vw,4.5rem)] overflow-hidden rounded-card border border-line bg-surface/40"
            >
              <div className="border-b border-line px-5 py-5 sm:px-7">
                <h3 className="font-heading text-[1.15rem] font-bold tracking-[-0.01em]">Full Feature Comparison</h3>
                <p className="mt-1 text-[0.85rem] text-ink-muted">Everything included in each package, side by side.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-line bg-surface-2/60">
                      <th className="sticky left-0 bg-surface-2/60 px-5 py-4 font-heading text-[0.72rem] font-bold uppercase tracking-[0.14em] text-ink-muted sm:px-7">
                        Feature
                      </th>
                      {active.tiers.map((t) => (
                        <th
                          key={t.id}
                          className={`px-4 py-4 text-center font-heading text-[0.82rem] font-bold ${
                            t.popular ? "text-accent" : "text-ink"
                          }`}
                        >
                          <span className="mr-1" aria-hidden="true">{t.dot}</span>
                          {t.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {active.comparison.map((row, i) => (
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
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

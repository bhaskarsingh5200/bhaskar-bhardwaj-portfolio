import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { contactCta as fallbackContactCta, social, whatsappLink } from "../data/site.js";
import { useContent } from "../context/ContentContext.jsx";
import { submitInquiry } from "../lib/contact.js";
import { trackEvent } from "../lib/analytics.js";
import { fadeUpStagger, viewport } from "../lib/motion.js";
import Button from "./Button.jsx";

const PROJECT_TYPES = [
  "Business Website",
  "WordPress Website",
  "E-commerce",
  "Custom Web Development",
  "Other"
];

const BUDGETS = [
  "Under ₹15,000",
  "₹15,000–₹25,000",
  "₹25,000–₹35,000",
  "₹35,000–₹50,000",
  "₹50,000+"
];

const EMPTY_FORM = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  budget: "",
  message: ""
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!values.projectType) errors.projectType = "Please select a project type.";
  if (!values.message.trim()) errors.message = "Please tell me a little about your project.";
  return errors;
}

const errorText = "mt-1.5 text-[0.82rem] text-[#e08170]";

export default function Contact() {
  const { settings } = useContent();
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [submitError, setSubmitError] = useState("");

  const emailAddress = settings?.email || social.EMAIL_ADDRESS;
  const whatsappNumber = settings?.whatsapp_number || social.WHATSAPP_NUMBER;
  const whatsHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi Bhaskar, I'd like to discuss a website project.")}`
    : "#";
  const ctaTitle = settings?.contact_cta_title || fallbackContactCta.title;
  const ctaText = settings?.contact_cta_text || fallbackContactCta.text;

  const setField = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstInvalid = document.querySelector("[aria-invalid='true']");
      firstInvalid?.focus();
      return;
    }

    setStatus("submitting");
    setSubmitError("");
    try {
      await submitInquiry(values);
      trackEvent("contact_form_submit", {
        project_type: values.projectType,
        budget: values.budget || "Not specified"
      });
      setStatus("success");
      setValues(EMPTY_FORM);
    } catch (err) {
      setStatus("error");
      setSubmitError(
        "Something went wrong. Please try again or contact me directly."
      );
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setValues(EMPTY_FORM);
    setErrors({});
  };

  return (
    <section id="contact" className="section">
      <div className="shell grid grid-cols-1 items-start gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-[1fr_1.1fr]">
        <motion.div
          variants={fadeUpStagger}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="lg:sticky lg:top-[calc(var(--nav-height)+2rem)]"
        >
          <span className="eyebrow">Contact</span>
          <h2 className="mb-5 font-heading text-[clamp(2.1rem,5vw,3.4rem)] font-extrabold leading-[1.08] tracking-[-0.03em]">
            {ctaTitle}
          </h2>
          <p className="mb-8 max-w-[46ch] text-[1.05rem] leading-relaxed text-ink-secondary">
            {ctaText}
          </p>

          <div className="mb-10 flex flex-wrap gap-3.5">
            <Button href="#contact-form" onClick={() => trackEvent("start_project")}>
              Start a Project
              <ArrowRight size={18} className="btn-arrow" />
            </Button>
            <Button href={whatsHref} variant="secondary" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("whatsapp_click")}>
              <MessageCircle size={18} />
              WhatsApp
            </Button>
          </div>

          <div className="flex flex-col items-start gap-4">
            <a
              href={`mailto:${emailAddress}`}
              onClick={() => trackEvent("email_click")}
              className="border-b border-line-strong pb-0.5 font-heading text-[1.1rem] font-semibold transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              {emailAddress}
            </a>
            <span className="inline-flex items-center gap-2.5 text-[0.9rem] text-ink-secondary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent" aria-hidden="true" />
              Currently accepting new projects
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUpStagger}
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="rounded-card border border-line bg-surface/60 p-[clamp(1.5rem,3vw,2rem)]"
        >
          {status === "success" ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center" role="status">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent">
                <CheckCircle2 size={32} />
              </span>
              <h3 className="text-[1.5rem] font-bold tracking-[-0.02em]">Inquiry Received</h3>
              <p className="max-w-[42ch] text-[0.95rem] leading-relaxed text-ink-secondary">
                Thanks! Your project inquiry has been received. I'll get back to you soon.
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="mt-2 rounded-[10px] border border-line-strong px-5 py-2.5 font-heading text-[0.9rem] font-semibold transition-colors duration-300 hover:border-ink-secondary hover:bg-ink/5"
              >
                Send another inquiry
              </button>
            </div>
          ) : (
            <form id="contact-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              {status === "error" && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-[10px] border border-[#e08170]/40 bg-[#e08170]/10 px-4 py-3 text-[0.9rem] text-[#e08170]"
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="field-label">
                    Name <span className="text-accent" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={setField("name")}
                    aria-required="true"
                    aria-invalid={errors.name ? "true" : undefined}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                    className={`field-input ${errors.name ? "border-[#e08170]/60" : ""}`}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p id="contact-name-error" className={errorText} role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-email" className="field-label">
                    Email <span className="text-accent" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={setField("email")}
                    aria-required="true"
                    aria-invalid={errors.email ? "true" : undefined}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                    className={`field-input ${errors.email ? "border-[#e08170]/60" : ""}`}
                    placeholder="you@company.com"
                  />
                  {errors.email && (
                    <p id="contact-email-error" className={errorText} role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-company" className="field-label">
                    Business / Company
                  </label>
                  <input
                    id="contact-company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    value={values.company}
                    onChange={setField("company")}
                    className="field-input"
                    placeholder="Company name (optional)"
                  />
                </div>

                <div>
                  <label htmlFor="contact-project-type" className="field-label">
                    Project Type <span className="text-accent" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="contact-project-type"
                    name="projectType"
                    value={values.projectType}
                    onChange={setField("projectType")}
                    aria-required="true"
                    aria-invalid={errors.projectType ? "true" : undefined}
                    aria-describedby={errors.projectType ? "contact-project-type-error" : undefined}
                    className={`field-input ${errors.projectType ? "border-[#e08170]/60" : ""}`}
                  >
                    <option value="">Select a project type…</option>
                    {PROJECT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.projectType && (
                    <p id="contact-project-type-error" className={errorText} role="alert">
                      {errors.projectType}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="contact-budget" className="field-label">
                  Budget Range
                </label>
                <select
                  id="contact-budget"
                  name="budget"
                  value={values.budget}
                  onChange={setField("budget")}
                  className="field-input"
                >
                  <option value="">Select a budget range…</option>
                  {BUDGETS.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="field-label">
                  Message <span className="text-accent" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows="5"
                  value={values.message}
                  onChange={setField("message")}
                  aria-required="true"
                  aria-invalid={errors.message ? "true" : undefined}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                  className={`field-input ${errors.message ? "border-[#e08170]/60" : ""}`}
                  placeholder="Tell me about your project, goals, and timeline…"
                />
                {errors.message && (
                  <p id="contact-message-error" className={errorText} role="alert">
                    {errors.message}
                  </p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={status === "submitting"}
                whileHover={status === "submitting" ? undefined : { y: -2, scale: 1.02 }}
                whileTap={status === "submitting" ? undefined : { scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-[7px] bg-accent px-7 py-4 font-heading text-[1rem] font-semibold text-white shadow-[0_10px_28px_-12px_rgb(var(--accent)_/_0.6),inset_0_1px_0_rgba(255,255,255,0.16)] transition-colors duration-300 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send Project Inquiry
                    <ArrowRight size={18} className="btn-arrow" />
                  </>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

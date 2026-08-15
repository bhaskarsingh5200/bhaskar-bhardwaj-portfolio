const env = import.meta.env;

export const siteConfig = {
  SITE_URL: env.VITE_PUBLIC_SITE_URL || "https://bhaskarbhardwaj.dev",
  GITHUB_URL: env.VITE_PUBLIC_GITHUB_URL || "https://github.com/",
  LINKEDIN_URL: env.VITE_PUBLIC_LINKEDIN_URL || "https://www.linkedin.com/in/",
  EMAIL_ADDRESS: env.VITE_PUBLIC_EMAIL || "bhaskarsingh876543@gmail.com",
  WHATSAPP_NUMBER: env.VITE_PUBLIC_WHATSAPP || "919508594706"
};

export const social = siteConfig;

export const site = {
  name: "Bhaskar Bhardwaj",
  firstName: "Bhaskar",
  role: "Independent Web Developer",
  tagline: "I Build Premium Websites That Help Businesses Grow Online."
};

export const navigation = [
  { label: "Home", href: "#top" },
  { label: "Portfolio", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" }
];

const DEFAULT_WHATSAPP_MESSAGE = "Hi Bhaskar, I'd like to discuss a website project.";

export const whatsappLink = (message = DEFAULT_WHATSAPP_MESSAGE) =>
  `https://wa.me/${social.WHATSAPP_NUMBER}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;

export const hero = {
  eyebrow: "Independent Web Developer",
  name: "Bhaskar Bhardwaj",
  roleBefore: "And I'm a",
  roleAccent: "Web Developer",
  description:
    "I build modern, responsive and high-performance websites for businesses, creators and growing brands.",
  primaryCta: { label: "Start a Project", href: "#contact" },
  secondaryCta: { label: "View My Work", href: "#work" }
};

export const socialLinks = [
  { label: "LinkedIn", href: social.LINKEDIN_URL },
  { label: "GitHub", href: social.GITHUB_URL }
];

export const contactCta = {
  title: "Have a Project in Mind?",
  text: "Whether you need a business website, WordPress build, or custom web experience, let's discuss what you're looking to create."
};

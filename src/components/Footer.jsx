import { Mail, MessageCircle } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons.jsx";
import { navigation } from "../data/site.js";
import { useContent } from "../context/ContentContext.jsx";
import { trackEvent } from "../lib/analytics.js";

const WHATSAPP_MESSAGE = "Hi Bhaskar, I'd like to discuss a website project.";

export default function Footer() {
  const { settings } = useContent();
  const name = settings?.name || "Bhaskar Bhardwaj";
  const role = settings?.role || "Independent Web Developer";
  const email = settings?.email || "";
  const whatsappNumber = settings?.whatsapp_number || "";
  const githubUrl = settings?.github_url || "";
  const linkedinUrl = settings?.linkedin_url || "";
  const footerText = settings?.footer_text || "";
  const whatsHref = whatsappNumber ? whatsappLinkFromNumber(whatsappNumber, WHATSAPP_MESSAGE) : "#";

  const socialLinks = [
    { label: "GitHub", href: githubUrl || "#", icon: GithubIcon, event: undefined },
    { label: "LinkedIn", href: linkedinUrl || "#", icon: LinkedinIcon, event: undefined },
    { label: "Email", href: email ? `mailto:${email}` : "#", icon: Mail, event: "email_click" },
    { label: "WhatsApp", href: whatsHref, icon: MessageCircle, event: "whatsapp_click" }
  ];

  return (
    <footer className="border-t border-line bg-base py-12">
      <div className="shell flex flex-col flex-wrap items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <a href="#top" className="font-heading text-[1.35rem] font-extrabold tracking-[-0.03em]">
            {name}<span className="text-accent">.</span>
          </a>
          <p className="mt-1 text-[0.85rem] text-ink-muted">{role}</p>
        </div>

        <nav className="flex flex-wrap gap-x-7 gap-y-2" aria-label="Footer">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[0.9rem] text-ink-secondary transition-colors duration-300 hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col items-start gap-2.5 md:items-end">
          <div className="flex gap-3">
            {socialLinks.map(({ label, href, icon: Icon, event }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                onClick={event ? () => trackEvent(event) : undefined}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-line text-ink-secondary transition-[color,border-color,background-color] duration-300 hover:border-accent/40 hover:bg-accent-soft hover:text-accent"
              >
                <Icon size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
          <p className="text-[0.78rem] text-ink-muted">
            © 2026 {name}. All rights reserved. {footerText}
          </p>
        </div>
      </div>
    </footer>
  );
}

function whatsappLinkFromNumber(number, message) {
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

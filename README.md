# Bhaskar Bhardwaj — Developer Portfolio

A premium, production-ready developer portfolio for **Bhaskar Bhardwaj**, built with React and Vite. The site is designed to build trust, showcase project work, and convert visitors into project inquiries.

![Theme](https://img.shields.io/badge/theme-dark-gold-%23111111)

## Tech Stack

- **React 18** + **Vite 5**
- **Tailwind CSS** (design system via `tailwind.config.js`)
- **Framer Motion** (animations, respects `prefers-reduced-motion`)
- **Lucide React** (icons)
- **React Router** (routing + custom 404 page)
- **Supabase** (optional admin panel / CMS — auth, PostgreSQL, RLS, storage)
- Plain JavaScript — no TypeScript, no heavy state libraries

## Features

- Animated hero with sequenced entrance + browser mockup
- Selected Work grid with optional live / case study / GitHub links
- Services, Process timeline, About, and **Tech Stack** sections
- Full contact form with client-side validation, loading/error/success states, and an isolated submission layer ready for Formspree, Resend, EmailJS, or a custom backend
- Config-driven WhatsApp CTA with a pre-filled message
- Custom 404 page
- SEO: meta description, canonical, Open Graph, Twitter cards, JSON-LD (Person + ProfessionalService), `robots.txt`, `sitemap.xml`, favicon, theme color
- Accessibility: skip link, focus management, accessible mobile menu, form error association, keyboard navigation, reduced-motion support
- Code splitting (each section is its own chunk) and lazy loading
- Error boundary with a graceful fallback
- Admin panel (`/admin`) powered by Supabase — manage projects, services, skills, About, messages, settings, and SEO without code
- Content layer with caching + static fallback — the site keeps working if Supabase isn't configured
- About section with a three-photo gallery

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Production build
npm run build

# Preview the production build locally
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your own values. All variables are optional and safe to expose publicly — never put real secrets here.

| Variable | Purpose |
| --- | --- |
| `VITE_PUBLIC_SITE_URL` | Canonical / Open Graph base URL (e.g. `https://yourdomain.dev`) |
| `VITE_PUBLIC_EMAIL` | Contact email used for mailto and structured data |
| `VITE_PUBLIC_WHATSAPP` | WhatsApp number in international format (e.g. `919876543210`) |
| `VITE_PUBLIC_GITHUB_URL` | GitHub profile URL |
| `VITE_PUBLIC_LINKEDIN_URL` | LinkedIn profile URL |
| `VITE_PUBLIC_FORM_ENDPOINT` | Form backend URL (Formspree, Resend, custom API, etc.). When empty, the form opens a pre-filled email instead |
| `VITE_PUBLIC_ANALYTICS_ID` | Google Analytics Measurement ID. When empty, no tracking loads at all |
| `VITE_SUPABASE_URL` | Supabase project URL. Required for the admin panel / CMS |
| `VITE_SUPABASE_ANON_KEY` | Supabase public "anon" key. Required for the admin panel / CMS |

**Important:** the site ships with placeholder values in `src/data/site.js`. Replace the social URLs, email, and WhatsApp number with your real values (via env vars or directly in that file) before going live.

## Contact Form Backend

`src/lib/contact.js` exposes `submitInquiry(payload)`. It is intentionally isolated:

- If Supabase is configured, inquiries are stored in the `contact_messages` table and appear in the admin inbox.
- If `VITE_PUBLIC_FORM_ENDPOINT` is set, it POSTs the payload as JSON.
- Otherwise it falls back to opening a pre-filled mailto message.

No external service is enabled unless you configure it.

## Admin Panel / CMS (Supabase)

The site includes a full admin panel at `/admin` for managing portfolio content without touching code — projects, services, skills, About (bio + photos), contact messages, site settings, and SEO metadata. Content published there replaces the static content in `src/data/` on the live site.

### 1. Create the database

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the whole file: `supabase/migrations/0001_init.sql`. This creates the tables, row-level security, storage buckets, and seed content. RLS ensures the public can only read published content and the admin panel is the only way to write.

### 2. Connect the app

Set these in `.env.local` (and in your host's environment variables for production):

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

The **anon key** is public by design — never use the `service_role` key in this codebase.

### 3. Create your admin account

1. In Supabase Dashboard → **Authentication → Users → Add user**, create an account for yourself.
2. In the **SQL Editor**, promote that account to admin (required for the admin panel):

```sql
update public.profiles set role = 'admin' where email = 'your@email.com';
```

3. Visit `/admin/login`, sign in, and you're done. New users added later default to the `editor` role and can't access the panel.

### 4. Storage buckets

`project-images`, `profile-images`, and `seo-assets` are created by the migration with public read + admin-only write. Uploads (project covers, portrait, gallery photos) happen from the admin panel directly.

### Without Supabase

If you don't configure Supabase, the public site works exactly as before using the static content in `src/data/`, the contact form falls back to the endpoint/mailto path, and `/admin/login` shows setup instructions.

## Analytics & Conversion Tracking

`src/lib/analytics.js` provides a clean integration point. When `VITE_PUBLIC_ANALYTICS_ID` is set, the Google Analytics script loads asynchronously. Conversion events fire for: View Project, Start a Project, Contact Form Submit, WhatsApp Click, and Email Click. No tracking loads when the variable is empty.

## Deployment (Vercel)

1. Push this repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Set the environment variables above in the project settings (Production).
4. Deploy — the framework preset is detected automatically (Vite).
5. Connect your custom domain in the Vercel dashboard.
6. Verify HTTPS is enabled.

`vercel.json` includes an SPA rewrite (all routes fall back to `index.html` for client-side routing) and basic security headers.

## Custom Domain

The recommended domain is `bhaskarbhardwaj.dev` (or another domain based on availability). The site does not assume a domain is registered — update the canonical/OG URLs in `index.html`, `public/robots.txt`, and `public/sitemap.xml`, or set `VITE_PUBLIC_SITE_URL` for runtime references.

## Project Structure

```
src/
  admin/        Admin panel (layout, login, CRUD pages, UI primitives)
  components/   UI components (flat structure)
  context/      ContentProvider + AuthProvider (React context)
  data/         Static fallback content (site, projects, services, technologies)
  hooks/        useScrolled, useActiveSection
  lib/          motion variants, supabase client, public/admin data APIs, contact, analytics
  pages/        NotFound
  App.jsx       Routes + layout
  main.jsx      Entry point
public/         Static assets (favicon, OG image, robots.txt, sitemap.xml, portrait photos)
supabase/migrations/   SQL schema + RLS + seed (run once in the Supabase SQL Editor)
```

## License

All rights reserved. This portfolio is for personal/professional use by Bhaskar Bhardwaj.

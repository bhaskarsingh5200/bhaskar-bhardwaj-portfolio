-- ============================================================
-- Bhaskar Bhardwaj Portfolio — Supabase schema
-- Run once in the Supabase SQL Editor (Settings -> SQL Editor).
-- Grant admin access afterwards:
--   update profiles set role = 'admin' where email = '<your-email>';
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- helper: updated_at ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'editor' check (role in ('editor', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- helper: is_admin ----------
-- security definer so RLS on profiles does not block the check
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_insert_admin" on public.profiles;
create policy "profiles_insert_admin" on public.profiles
  for insert with check (public.is_admin());

drop policy if exists "profiles_delete_admin" on public.profiles;
create policy "profiles_delete_admin" on public.profiles
  for delete using (public.is_admin());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data ->> 'full_name', 'editor')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists "on_auth_user_created" on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists "profiles_updated_at" on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------- projects ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text,
  description text,
  technologies text[] not null default '{}',
  image_url text,
  live_url text,
  case_study_url text,
  github_url text,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

drop policy if exists "projects_select_public" on public.projects;
create policy "projects_select_public" on public.projects
  for select using (status = 'published');

drop policy if exists "projects_admin_all" on public.projects;
create policy "projects_admin_all" on public.projects
  for all using (public.is_admin()) with check (public.is_admin());

drop trigger if exists "projects_updated_at" on public.projects;
create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------- project_images ----------
create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  url text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.project_images enable row level security;

drop policy if exists "project_images_select_public" on public.project_images;
create policy "project_images_select_public" on public.project_images
  for select using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.status = 'published'
    )
  );

drop policy if exists "project_images_admin_all" on public.project_images;
create policy "project_images_admin_all" on public.project_images
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- services ----------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.services enable row level security;

drop policy if exists "services_select_public" on public.services;
create policy "services_select_public" on public.services
  for select using (status = 'published');

drop policy if exists "services_admin_all" on public.services;
create policy "services_admin_all" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

drop trigger if exists "services_updated_at" on public.services;
create trigger services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

-- ---------- skills ----------
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('Frontend', 'CMS & Backend', 'Workflow')),
  icon text,
  description text,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.skills enable row level security;

drop policy if exists "skills_select_public" on public.skills;
create policy "skills_select_public" on public.skills
  for select using (status = 'published');

drop policy if exists "skills_admin_all" on public.skills;
create policy "skills_admin_all" on public.skills
  for all using (public.is_admin()) with check (public.is_admin());

drop trigger if exists "skills_updated_at" on public.skills;
create trigger skills_updated_at
  before update on public.skills
  for each row execute function public.set_updated_at();

-- ---------- highlights (About) ----------
create table if not exists public.highlights (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.highlights enable row level security;

drop policy if exists "highlights_select_public" on public.highlights;
create policy "highlights_select_public" on public.highlights
  for select using (true);

drop policy if exists "highlights_admin_all" on public.highlights;
create policy "highlights_admin_all" on public.highlights
  for all using (public.is_admin()) with check (public.is_admin());

drop trigger if exists "highlights_updated_at" on public.highlights;
create trigger highlights_updated_at
  before update on public.highlights
  for each row execute function public.set_updated_at();

-- ---------- contact_messages (private) ----------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  project_type text,
  budget text,
  message text not null,
  is_read boolean not null default false,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- No public policy: anonymous access is denied by default.
drop policy if exists "contact_messages_admin_all" on public.contact_messages;
create policy "contact_messages_admin_all" on public.contact_messages
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- site_settings ----------
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "site_settings_select_public" on public.site_settings;
create policy "site_settings_select_public" on public.site_settings
  for select using (true);

drop policy if exists "site_settings_admin_all" on public.site_settings;
create policy "site_settings_admin_all" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- seo_settings ----------
create table if not exists public.seo_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.seo_settings enable row level security;

drop policy if exists "seo_settings_select_public" on public.seo_settings;
create policy "seo_settings_select_public" on public.seo_settings
  for select using (true);

drop policy if exists "seo_settings_admin_all" on public.seo_settings;
create policy "seo_settings_admin_all" on public.seo_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- Storage buckets + policies
-- ============================================================
insert into storage.buckets (id, name, public)
values
  ('project-images', 'project-images', true),
  ('profile-images', 'profile-images', true),
  ('seo-assets', 'seo-assets', true)
on conflict (id) do nothing;

drop policy if exists "public_read_images" on storage.objects;
create policy "public_read_images" on storage.objects
  for select using (bucket_id in ('project-images', 'profile-images', 'seo-assets'));

drop policy if exists "admin_upload_images" on storage.objects;
create policy "admin_upload_images" on storage.objects
  for insert with check (bucket_id in ('project-images', 'profile-images', 'seo-assets') and public.is_admin());

drop policy if exists "admin_update_images" on storage.objects;
create policy "admin_update_images" on storage.objects
  for update using (bucket_id in ('project-images', 'profile-images', 'seo-assets') and public.is_admin());

drop policy if exists "admin_delete_images" on storage.objects;
create policy "admin_delete_images" on storage.objects
  for delete using (bucket_id in ('project-images', 'profile-images', 'seo-assets') and public.is_admin());

-- ============================================================
-- Seed content (safe to re-run: on conflict do nothing)
-- ============================================================
insert into public.site_settings (key, value) values
  ('name', '"Bhaskar Bhardwaj"'),
  ('firstName', '"Bhaskar"'),
  ('role', '"Independent Web Developer"'),
  ('hero_eyebrow', '"Independent Web Developer"'),
  ('hero_headline_before', '"I Build Premium Websites That Help Businesses "'),
  ('hero_headline_accent', '"Grow Online."'),
  ('hero_description', '"I design and develop fast, modern, and conversion-focused websites for businesses, creators, and growing brands."'),
  ('primary_cta_label', '"View Selected Work"'),
  ('primary_cta_href', '"#work"'),
  ('secondary_cta_label', '"Start a Project"'),
  ('secondary_cta_href', '"#contact"'),
  ('email', '"bhaskarsingh876543@gmail.com"'),
  ('whatsapp_number', '"919508594706"'),
  ('github_url', '"https://github.com/"'),
  ('linkedin_url', '"https://www.linkedin.com/in/"'),
  ('footer_text', '""'),
  ('theme_palette', '"blue-black"'),
  ('profile_image', '"/images/portrait-2.webp"'),
  ('gallery_images', '["/images/portrait-1.webp", "/images/portrait-2.webp", "/images/portrait-3.webp"]'),
  ('about_heading', '"About Me"'),
  ('about_copy', '["I\u0027m Bhaskar Bhardwaj, a web developer based in Patna, Bihar, focused on building modern, reliable websites for businesses and growing brands.", "I hold a Diploma in Computer Science \u0026 Engineering from Kameshwar Narayan Singh Govt. Polytechnic, Samastipur (First Class, CGPA 7.58) and a B.Sc. (Hons.) in Physics from G.D. College, Begusarai (LNMU). My work combines thoughtful design with practical development \u2014 performance, responsiveness, SEO foundations, and websites that are easy to manage after launch.", "I work across WordPress, custom themes, React-based interfaces, e-commerce, content platforms, and business websites."]')
on conflict (key) do nothing;

insert into public.seo_settings (key, value) values
  ('site_title', '"Bhaskar Bhardwaj \u2014 Web Developer"'),
  ('meta_description', '"Bhaskar Bhardwaj is a web developer from Patna, Bihar, building modern, responsive, and conversion-focused websites for businesses and growing brands."'),
  ('canonical_url', '"https://bhaskarbhardwaj.dev/"'),
  ('og_title', '"Bhaskar Bhardwaj \u2014 Web Developer"'),
  ('og_description', '"Premium websites for businesses, creators, and growing brands."'),
  ('og_image', '"/og-image.png"'),
  ('twitter_title', '"Bhaskar Bhardwaj \u2014 Web Developer"'),
  ('twitter_description', '"Premium websites for businesses, creators, and growing brands."'),
  ('twitter_image', '"/og-image.png"')
on conflict (key) do nothing;

insert into public.services (title, description, icon, sort_order, status) values
  ('Business Websites', 'Professional websites built to establish credibility and generate leads.', 'browser', 1, 'published'),
  ('WordPress Development', 'Custom WordPress websites, themes, CMS setups, and performance optimization.', 'layers', 2, 'published'),
  ('E-commerce', 'Modern online stores designed for smooth shopping experiences and growth.', 'bag', 3, 'published'),
  ('Custom Web Development', 'React and custom frontend solutions when a standard website isn''t enough.', 'code', 4, 'published');

insert into public.skills (name, category, icon, sort_order, status) values
  ('HTML', 'Frontend', 'html', 1, 'published'),
  ('CSS', 'Frontend', 'css', 2, 'published'),
  ('JavaScript', 'Frontend', 'javascript', 3, 'published'),
  ('React', 'Frontend', 'react', 4, 'published'),
  ('WordPress', 'CMS & Backend', 'wordpress', 1, 'published'),
  ('PHP', 'CMS & Backend', 'php', 2, 'published'),
  ('MySQL', 'CMS & Backend', 'mysql', 3, 'published'),
  ('Git', 'Workflow', 'git', 1, 'published'),
  ('GitHub', 'Workflow', 'github', 2, 'published'),
  ('Figma', 'Workflow', 'figma', 3, 'published'),
  ('Hostinger', 'Workflow', 'hostinger', 4, 'published');

insert into public.highlights (title, description, icon, sort_order) values
  ('Responsive by Design', 'Built to work beautifully across desktop, tablet, and mobile.', 'responsive', 1),
  ('Performance Focused', 'Clean implementation with attention to loading speed and usability.', 'bolt', 2),
  ('SEO Friendly', 'Structured pages and technical foundations designed with search visibility in mind.', 'search', 3),
  ('Client Friendly', 'Websites designed to be practical and easy to manage.', 'handshake', 4);

insert into public.projects (title, slug, category, description, technologies, featured, status, sort_order) values
  ('Gym Website', 'gym-website', 'Fitness Business Website', 'A modern gym website designed to showcase memberships, training programs, and lead-generation features with a clean, high-conversion layout.', array['WordPress', 'Responsive', 'SEO Ready'], false, 'published', 1),
  ('Fashion Loot', 'fashion-loot', 'E-commerce Website', 'A premium fashion storefront focused on product discovery, trust, and a polished shopping experience.', array['E-commerce', 'Custom UI', 'Mobile First'], false, 'published', 2),
  ('The News Express', 'the-news-express', 'Content Platform', 'A content-focused website built around structured publishing, category navigation, SEO foundations, and scalable content management.', array['WordPress', 'SEO', 'Content Management'], false, 'published', 3),
  ('Recipe Platform', 'recipe-platform', 'Content Website', 'A recipe-focused website featuring structured content, ratings, related recipes, and intuitive browsing.', array['Custom Theme', 'CMS', 'UX'], false, 'published', 4);

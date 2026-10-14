-- ==============================================================================
-- ARCLINE HEADLESS CMS — SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================
-- Run this script in your Supabase SQL Editor to provision the complete database,
-- security rules, and initial website seed data.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES & ROLES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger to automatically create profile on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'editor')
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email, updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if current user is authenticated editor or admin
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'editor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default-settings',
  site_name TEXT NOT NULL DEFAULT 'Arcline',
  default_title TEXT NOT NULL DEFAULT 'Arcline — Architecture & Design Agency',
  default_description TEXT NOT NULL DEFAULT 'Distinguished architectural agency located in Canada, creating meaningful spaces that stand the test of time.',
  default_og_image TEXT DEFAULT '/images/home-hero-image.webp',
  phone TEXT DEFAULT '(804) 707-5821',
  email TEXT DEFAULT 'contact@seelutions.com',
  address TEXT DEFAULT '567 Jac Spruce Crescent, Montreal, QC H1A 2K3',
  legal_notice TEXT DEFAULT '© 2026 seelutions. All Rights Reserved.',
  social_links JSONB DEFAULT '{"linkedin": "https://linkedin.com", "instagram": "https://instagram.com"}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 4. NAVIGATION MENUS
CREATE TABLE IF NOT EXISTS public.navigation_menus (
  id TEXT PRIMARY KEY,
  location TEXT NOT NULL UNIQUE CHECK (location IN ('header', 'footer', 'mobile')),
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  cta_label TEXT,
  cta_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. PAGES & SECTIONS
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.page_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  section_type TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  order_index INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(page_id, section_key)
);

CREATE TABLE IF NOT EXISTS public.page_revisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_by TEXT,
  revision_note TEXT
);

-- 6. ARTICLES (BLOG / PATIENT GROWER)
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  cover_image_alt TEXT,
  author_name TEXT NOT NULL DEFAULT 'Editorial Team',
  category TEXT NOT NULL DEFAULT 'Architecture & Strategy',
  tags TEXT[] DEFAULT ARRAY['Architecture', 'Design'],
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN NOT NULL DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  published_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.article_revisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_by TEXT,
  revision_note TEXT
);

-- 7. MEDIA ASSETS
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  public_url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  mime_type TEXT NOT NULL,
  file_size INT NOT NULL,
  width INT,
  height INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. AUDIT & PUBLICATION LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.publication_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  target TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('publishing', 'published', 'failed')),
  trigger_type TEXT NOT NULL DEFAULT 'manual',
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  finished_at TIMESTAMPTZ
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publication_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile; admins can read & update all
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Admins full access to profiles" ON public.profiles
  FOR ALL TO authenticated USING (public.is_admin());

-- Site Settings: Public read; Staff write
CREATE POLICY "Public read site settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Staff write site settings" ON public.site_settings
  FOR ALL TO authenticated USING (public.is_staff());

-- Navigation Menus: Public read; Staff write
CREATE POLICY "Public read navigation" ON public.navigation_menus
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Staff write navigation" ON public.navigation_menus
  FOR ALL TO authenticated USING (public.is_staff());

-- Pages: Public read published; Staff read all & write
CREATE POLICY "Public read published pages" ON public.pages
  FOR SELECT TO anon, authenticated USING (status = 'published');

CREATE POLICY "Staff all pages" ON public.pages
  FOR ALL TO authenticated USING (public.is_staff());

-- Page Sections: Public read visible sections; Staff manage all
CREATE POLICY "Public read visible page sections" ON public.page_sections
  FOR SELECT TO anon, authenticated USING (is_visible = true);

CREATE POLICY "Staff all page sections" ON public.page_sections
  FOR ALL TO authenticated USING (public.is_staff());

-- Page Revisions: Staff only
CREATE POLICY "Staff all page revisions" ON public.page_revisions
  FOR ALL TO authenticated USING (public.is_staff());

-- Articles: Public read published; Staff read all & write
CREATE POLICY "Public read published articles" ON public.articles
  FOR SELECT TO anon, authenticated USING (status = 'published');

CREATE POLICY "Staff all articles" ON public.articles
  FOR ALL TO authenticated USING (public.is_staff());

-- Article Revisions: Staff only
CREATE POLICY "Staff all article revisions" ON public.article_revisions
  FOR ALL TO authenticated USING (public.is_staff());

-- Media Assets: Public read; Staff upload/delete
CREATE POLICY "Public read media assets" ON public.media_assets
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Staff manage media assets" ON public.media_assets
  FOR ALL TO authenticated USING (public.is_staff());

-- Audit & Publication Logs: Staff only
CREATE POLICY "Staff read audit logs" ON public.audit_logs
  FOR SELECT TO authenticated USING (public.is_staff());

CREATE POLICY "Staff insert audit logs" ON public.audit_logs
  FOR INSERT TO authenticated WITH CHECK (public.is_staff());

CREATE POLICY "Staff read publication logs" ON public.publication_logs
  FOR SELECT TO authenticated USING (public.is_staff());

CREATE POLICY "Staff insert publication logs" ON public.publication_logs
  FOR INSERT TO authenticated WITH CHECK (public.is_staff());

-- ==============================================================================
-- STORAGE BUCKET CONFIGURATION (for Supabase Storage)
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read media bucket" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'media');

CREATE POLICY "Staff upload to media bucket" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.is_staff());

CREATE POLICY "Staff delete from media bucket" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.is_staff());

-- ==============================================================================
-- SEED DATA (Arcline Website Content)
-- ==============================================================================

INSERT INTO public.site_settings (id, site_name, default_title, default_description, default_og_image, phone, email, address, legal_notice)
VALUES (
  'default-settings',
  'Arcline',
  'Arcline — Architecture & Design Agency',
  'Distinguished architectural agency located in Canada, creating meaningful spaces that stand the test of time.',
  '/images/home-hero-image.webp',
  '(804) 707-5821',
  'contact@seelutions.com',
  '567 Jac Spruce Crescent, Montreal, QC H1A 2K3',
  '© 2026 seelutions. All Rights Reserved. Patient Grower is a specialized publication of seelutions.'
)
ON CONFLICT (id) DO UPDATE SET updated_at = now();

INSERT INTO public.navigation_menus (id, location, cta_label, cta_url, items)
VALUES
(
  'nav-header',
  'header',
  'Request Practice Audit',
  '#contact',
  '[
    {"id": "nav-1", "label": "About", "href": "/#about", "order_index": 0, "is_active": true},
    {"id": "nav-2", "label": "Services", "href": "/#services", "order_index": 1, "is_active": true, "has_dropdown": true, "dropdown_items": [
      {"label": "Local SEO & Maps", "href": "/services/local-seo"},
      {"label": "AI Search & GEO", "href": "/services/ai-search"},
      {"label": "Medical Brand Identity", "href": "/services/branding"},
      {"label": "Surgical Web Design", "href": "/services/web-design"},
      {"label": "Patient Acquisition & PPC", "href": "/services/ppc"},
      {"label": "Med Spa Pipelines", "href": "/services/med-spa"}
    ]},
    {"id": "nav-3", "label": "Case Study", "href": "/case-studies", "order_index": 2, "is_active": true},
    {"id": "nav-4", "label": "Patient Grower", "href": "/patient-grower", "order_index": 3, "is_active": true}
  ]'::jsonb
),
(
  'nav-footer',
  'footer',
  NULL,
  NULL,
  '[
    {"id": "foot-1", "label": "About", "href": "/#about", "order_index": 0, "is_active": true},
    {"id": "foot-2", "label": "Services", "href": "/#services", "order_index": 1, "is_active": true},
    {"id": "foot-3", "label": "Case Study", "href": "/#case-study", "order_index": 2, "is_active": true},
    {"id": "foot-4", "label": "Patient Grower", "href": "/#patient-grower", "order_index": 3, "is_active": true}
  ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Seed Pages
INSERT INTO public.pages (id, slug, title, seo_title, seo_description, status, published_at)
VALUES
(
  'e1000000-0000-0000-0000-000000000001',
  'home',
  'Home — Arcline Architecture',
  'Arcline — Architecture & Design Agency',
  'Distinguished architectural agency located in Canada, creating meaningful spaces that stand the test of time.',
  'published',
  now()
),
(
  'e1000000-0000-0000-0000-000000000002',
  'about',
  'About Us — 10-Year Case Study',
  'About Us & 10-Year Practice Case Study — Specialized Patient Acquisition',
  'How Dr. Ryan Diepenbrock scaled to regional market dominance across a decade of digital shift.',
  'published',
  now()
),
(
  'e1000000-0000-0000-0000-000000000003',
  'services',
  'Services — Specialized Patient Acquisition',
  'Services — Arcline Architecture & Design',
  'Explore our specialized architectural, interior design, landscape, and renovation services.',
  'published',
  now()
),
(
  'e1000000-0000-0000-0000-000000000004',
  'projects',
  'Projects Portfolio',
  'Projects Portfolio — Arcline Architecture',
  'Explore our built work across residential villas, commercial pavilions, and urban developments.',
  'published',
  now()
),
(
  'e1000000-0000-0000-0000-000000000005',
  'blog',
  'Journal & Perspectives',
  'Journal & Perspectives — Arcline Architecture',
  'Critical essays, research, and reflections on architecture, biophilic design, and urban density.',
  'published',
  now()
)
ON CONFLICT (slug) DO NOTHING;

-- Seed Articles
INSERT INTO public.articles (id, slug, title, excerpt, content, cover_image, author_name, category, tags, status, featured, published_at)
VALUES
(
  'f1000000-0000-0000-0000-000000000001',
  'how-chatgpt-perplexity-recommend-surgeons',
  'How ChatGPT, Perplexity, and Google AI Overviews Select Which Plastic Surgeon to Recommend in Your City',
  'Discover how large language models parse medical entity authority, local citations, and procedural schema to rank surgical practices in zero-click generative search results.',
  '# How ChatGPT, Perplexity, and Google AI Overviews Recommend Surgeons\n\nModern surgical patients no longer rely solely on basic Google queries. They prompt conversational AI assistants like ChatGPT, Perplexity, and Google AI Overviews for direct clinical recommendations.\n\n## 1. Medical Entity Authority\nLarge language models look for verified digital citations across professional medical registries, board certifications, and high-authority academic or practice publications.\n\n## 2. Procedural Hub Depth\nRather than shallow 300-word blurbs, modern generative engines cite deep procedure hubs detailing specialized techniques, candid recovery timelines, and verifiable surgical outcomes.\n\n## 3. Structured Schema & Map Pack Dominance\nClear JSON-LD schemas linking your physical surgical suite to regional entities ensure AI systems accurately identify your practice as the premier regional authority.',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=85',
  'Editorial Team',
  'AI Search Optimization',
  ARRAY['AI Search', 'AEO', 'Medical Marketing'],
  'published',
  true,
  now() - INTERVAL '3 days'
),
(
  'f1000000-0000-0000-0000-000000000002',
  'structuring-facelift-rhinoplasty-galleries',
  'Structuring Facelift & Rhinoplasty Before/After Galleries for Maximum GA4 Engagement and Consult Bookings',
  'Why high-net-worth patients looking for $20,000+ procedures abandon generic contact forms, and how immersive case studies drive qualified consultation requests.',
  '# Structuring Facelift & Rhinoplasty Galleries for Maximum Engagement\n\nHigh-net-worth patients evaluating $20,000+ cosmetic surgical procedures rarely fill out generic one-line contact forms without thorough proof of aesthetic mastery.\n\n## The Engagement Architecture\n- High-resolution uncompressed before-and-after photography with standardized medical angles\n- Detailed surgical monologues describing patient concerns, tailored surgical approaches, and healing milestones\n- Seamless mobile interaction that respects patient privacy while maximizing conversion velocity.',
  'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=600&q=85',
  'Editorial Team',
  'Practice Conversion Economics',
  ARRAY['Gallery UX', 'Conversion Rate', 'Facelift'],
  'published',
  false,
  now() - INTERVAL '7 days'
),
(
  'f1000000-0000-0000-0000-000000000003',
  'converting-injectable-patients-surgical-consults',
  'Strategies for Converting Non-Surgical Injectable Patients into High-Margin Surgical Consults',
  'The exact automated referral workflows and cross-sell patient journeys that turn routine Botox and laser clients into lifelong surgical practice advocates.',
  '# Converting Injectable Patients into Surgical Consultations\n\nMany leading facial cosmetic and plastic surgeons operate high-volume attached med spas. Transforming recurrent injectable patients into surgical facelift candidates is the highest-margin growth engine available to a practice.\n\n## Key Conversion Milestones\n1. **Integrated CRM Nurturing**: Automated educational email journeys highlighting structural vs. volume-based facial rejuvenation.\n2. **In-Clinic Cross-Consultation**: Structured training for aesthetic injectors to identify when a surgical consultation best serves the patient goals.\n3. **Long-Term Patient Trust**: Compounding patient lifetime value across multiple years.',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=85',
  'Editorial Team',
  'Med Spa Pipeline Growth',
  ARRAY['Med Spa', 'Patient Retention', 'Injectables'],
  'published',
  false,
  now() - INTERVAL '14 days'
)
ON CONFLICT (slug) DO NOTHING;

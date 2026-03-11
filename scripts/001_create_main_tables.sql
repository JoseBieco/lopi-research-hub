-- Plataforma Acadêmica - Tabelas Principais

CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_pt TEXT NOT NULL,
  name_en TEXT,
  role TEXT NOT NULL CHECK (role IN ('professor', 'postdoc', 'phd', 'masters', 'undergrad', 'alumni')),
  bio_pt TEXT,
  bio_en TEXT,
  photo_url TEXT,
  email TEXT,
  lattes_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  orcid_url TEXT,
  scholar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS research_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_pt TEXT NOT NULL,
  name_en TEXT,
  description_pt TEXT,
  description_en TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_pt TEXT NOT NULL,
  title_en TEXT,
  description_pt TEXT,
  description_en TEXT,
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'completed')),
  funding_agency TEXT,
  start_date DATE,
  end_date DATE,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  abstract_pt TEXT,
  abstract_en TEXT,
  publication_type TEXT NOT NULL CHECK (publication_type IN ('journal', 'conference', 'book_chapter', 'thesis', 'workshop', 'proceedings')),
  venue TEXT,
  year INTEGER NOT NULL,
  doi TEXT,
  pdf_url TEXT,
  bibtex TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description_pt TEXT,
  description_en TEXT,
  tool_url TEXT,
  github_url TEXT,
  docs_url TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_pt TEXT NOT NULL,
  title_en TEXT,
  content_pt TEXT,
  content_en TEXT,
  news_type TEXT CHECK (news_type IN ('defense', 'award', 'publication', 'grant', 'general', 'seminar')),
  published_at TIMESTAMPTZ DEFAULT now(),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

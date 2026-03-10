-- =============================================
-- Plataforma Acadêmica - Grupo de Pesquisa
-- Migration: Criação das tabelas principais
-- =============================================

-- 1. Tabela de Membros da Equipe
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

-- 2. Tabela de Linhas de Pesquisa
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

-- 3. Tabela de Projetos de Pesquisa
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

-- 4. Tabela de Publicações
CREATE TABLE IF NOT EXISTS publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  abstract_pt TEXT,
  abstract_en TEXT,
  publication_type TEXT NOT NULL CHECK (publication_type IN ('journal', 'conference', 'book_chapter', 'thesis')),
  venue TEXT,
  year INTEGER NOT NULL,
  doi TEXT,
  pdf_url TEXT,
  bibtex TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Tabela de Ferramentas e Softwares
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

-- 6. Tabela de Notícias e Marcos
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_pt TEXT NOT NULL,
  title_en TEXT,
  content_pt TEXT,
  content_en TEXT,
  news_type TEXT CHECK (news_type IN ('defense', 'award', 'publication', 'grant', 'general')),
  published_at TIMESTAMPTZ DEFAULT now(),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- Tabelas de Junção (Relacionamentos N:N)
-- =============================================

-- Membros <-> Projetos
CREATE TABLE IF NOT EXISTS project_members (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('coordinator', 'researcher', 'student')),
  PRIMARY KEY (project_id, member_id)
);

-- Membros <-> Publicações (Autoria)
CREATE TABLE IF NOT EXISTS publication_authors (
  publication_id UUID REFERENCES publications(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  author_order INTEGER NOT NULL,
  PRIMARY KEY (publication_id, member_id)
);

-- Projetos <-> Publicações
CREATE TABLE IF NOT EXISTS project_publications (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  publication_id UUID REFERENCES publications(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, publication_id)
);

-- Projetos <-> Ferramentas
CREATE TABLE IF NOT EXISTS project_tools (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tool_id)
);

-- Membros <-> Linhas de Pesquisa
CREATE TABLE IF NOT EXISTS member_research_areas (
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  research_area_id UUID REFERENCES research_areas(id) ON DELETE CASCADE,
  PRIMARY KEY (member_id, research_area_id)
);

-- Projetos <-> Linhas de Pesquisa
CREATE TABLE IF NOT EXISTS project_research_areas (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  research_area_id UUID REFERENCES research_areas(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, research_area_id)
);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_research_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_research_areas ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura Pública
CREATE POLICY "public_read_members" ON members FOR SELECT USING (true);
CREATE POLICY "public_read_research_areas" ON research_areas FOR SELECT USING (true);
CREATE POLICY "public_read_projects" ON projects FOR SELECT USING (true);
CREATE POLICY "public_read_publications" ON publications FOR SELECT USING (true);
CREATE POLICY "public_read_tools" ON tools FOR SELECT USING (true);
CREATE POLICY "public_read_news" ON news FOR SELECT USING (is_published = true);
CREATE POLICY "public_read_project_members" ON project_members FOR SELECT USING (true);
CREATE POLICY "public_read_publication_authors" ON publication_authors FOR SELECT USING (true);
CREATE POLICY "public_read_project_publications" ON project_publications FOR SELECT USING (true);
CREATE POLICY "public_read_project_tools" ON project_tools FOR SELECT USING (true);
CREATE POLICY "public_read_member_research_areas" ON member_research_areas FOR SELECT USING (true);
CREATE POLICY "public_read_project_research_areas" ON project_research_areas FOR SELECT USING (true);

-- Políticas de Escrita para Admins (baseado em user_metadata.is_admin)
CREATE POLICY "admin_all_members" ON members FOR ALL 
  USING ((SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean));
CREATE POLICY "admin_all_research_areas" ON research_areas FOR ALL 
  USING ((SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean));
CREATE POLICY "admin_all_projects" ON projects FOR ALL 
  USING ((SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean));
CREATE POLICY "admin_all_publications" ON publications FOR ALL 
  USING ((SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean));
CREATE POLICY "admin_all_tools" ON tools FOR ALL 
  USING ((SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean));
CREATE POLICY "admin_all_news" ON news FOR ALL 
  USING ((SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean));
CREATE POLICY "admin_all_project_members" ON project_members FOR ALL 
  USING ((SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean));
CREATE POLICY "admin_all_publication_authors" ON publication_authors FOR ALL 
  USING ((SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean));
CREATE POLICY "admin_all_project_publications" ON project_publications FOR ALL 
  USING ((SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean));
CREATE POLICY "admin_all_project_tools" ON project_tools FOR ALL 
  USING ((SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean));
CREATE POLICY "admin_all_member_research_areas" ON member_research_areas FOR ALL 
  USING ((SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean));
CREATE POLICY "admin_all_project_research_areas" ON project_research_areas FOR ALL 
  USING ((SELECT (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean));

-- =============================================
-- Índices para Performance
-- =============================================

CREATE INDEX IF NOT EXISTS idx_members_role ON members(role);
CREATE INDEX IF NOT EXISTS idx_members_is_active ON members(is_active);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_publications_year ON publications(year);
CREATE INDEX IF NOT EXISTS idx_publications_type ON publications(publication_type);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at);
CREATE INDEX IF NOT EXISTS idx_news_is_published ON news(is_published);

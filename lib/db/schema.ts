/**
 * Database Schema for Academic Research Group Platform
 * This file defines all the SQL DDL statements needed to set up the database
 */

export const dbSchema = {
  // Members table
  members: `
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
  `,

  // Research Areas table
  researchAreas: `
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
  `,

  // Projects table
  projects: `
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
  `,

  // Publications table
  publications: `
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
  `,

  // Tools table
  tools: `
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
  `,

  // News table
  news: `
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
  `,

  // Junction: members_projects (many-to-many)
  membersProjects: `
    CREATE TABLE IF NOT EXISTS members_projects (
      member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
      project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      role TEXT DEFAULT 'member',
      PRIMARY KEY (member_id, project_id)
    );
  `,

  // Junction: project_research_areas (many-to-many)
  projectResearchAreas: `
    CREATE TABLE IF NOT EXISTS project_research_areas (
      project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      research_area_id UUID NOT NULL REFERENCES research_areas(id) ON DELETE CASCADE,
      PRIMARY KEY (project_id, research_area_id)
    );
  `,

  // Junction: publication_members (many-to-many)
  publicationMembers: `
    CREATE TABLE IF NOT EXISTS publication_members (
      publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
      member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
      author_order INTEGER,
      PRIMARY KEY (publication_id, member_id)
    );
  `,

  // Junction: publication_projects (many-to-many)
  publicationProjects: `
    CREATE TABLE IF NOT EXISTS publication_projects (
      publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
      project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      PRIMARY KEY (publication_id, project_id)
    );
  `,

  // Junction: tool_members (many-to-many)
  toolMembers: `
    CREATE TABLE IF NOT EXISTS tool_members (
      tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
      member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
      PRIMARY KEY (tool_id, member_id)
    );
  `,
}

// Row Level Security (RLS) policies
export const rlsPolicies = {
  // Allow public read access to all tables
  membersSelectPublic: `
    ALTER TABLE members ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Allow public read" ON members FOR SELECT USING (true);
  `,

  researchAreasSelectPublic: `
    ALTER TABLE research_areas ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Allow public read" ON research_areas FOR SELECT USING (true);
  `,

  projectsSelectPublic: `
    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Allow public read" ON projects FOR SELECT USING (true);
  `,

  publicationsSelectPublic: `
    ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Allow public read" ON publications FOR SELECT USING (true);
  `,

  toolsSelectPublic: `
    ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Allow public read" ON tools FOR SELECT USING (true);
  `,

  newsSelectPublic: `
    ALTER TABLE news ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Allow public read" ON news FOR SELECT USING (true);
  `,
}

// All statements in order
export const allStatements = [
  ...Object.values(dbSchema),
  ...Object.values(rlsPolicies),
]

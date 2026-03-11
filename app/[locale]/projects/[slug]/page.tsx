import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import {
  ArrowLeft,
  Calendar,
  Building2,
  Users,
  FileText,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("title_pt, title_en, description_pt, description_en")
    .eq("slug", slug)
    .single();

  if (!project) {
    return { title: "Project Not Found" };
  }

  const title = locale === "en" ? project.title_en : project.title_pt;
  const description =
    locale === "en" ? project.description_en : project.description_pt;

  return {
    title: `${title || "Projeto"} | Plataforma Acadêmica`,
    description:
      description?.substring(0, 160) || `Detalhes do projeto ${title}`,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations();
  const supabase = await createClient();

  // Fetch project data
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !project) {
    notFound();
  }

  // Fetch project members
  const { data: projectMembers } = await supabase
    .from("project_members")
    .select(
      `
      role,
      member:members (
        id, slug, name_pt, name_en, photo_url, role
      )
    `,
    )
    .eq("project_id", project.id);

  // Fetch project publications
  const { data: projectPublications } = await supabase
    .from("project_publications")
    .select(
      `
      publication:publications (
        id, title, authors, year, publication_type, doi
      )
    `,
    )
    .eq("project_id", project.id);

  const title =
    locale === "en" ? project.title_en || project.title_pt : project.title_pt;
  const description =
    locale === "en"
      ? project.description_en || project.description_pt
      : project.description_pt;
  const objectives =
    locale === "en"
      ? project.objectives_en || project.objectives_pt
      : project.objectives_pt;
  const results =
    locale === "en"
      ? project.results_en || project.results_pt
      : project.results_pt;

  const members =
    projectMembers
      ?.map((pm) => ({ ...pm.member, projectRole: pm.role }))
      .filter(Boolean) || [];
  const publications =
    projectPublications?.map((pp) => pp.publication).filter(Boolean) || [];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === "en" ? "en-US" : "pt-BR", {
      month: "long",
      year: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <main id="main-content" className="flex-1">
      {/* Back button */}
      <div className="bg-muted/50 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/${locale}/projects`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {locale === "en" ? "Back to projects" : "Voltar para projetos"}
            </Link>
          </Button>
        </div>
      </div>

      {/* Project Header */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <Badge
              variant={project.status === "active" ? "default" : "secondary"}
              className="text-sm"
            >
              {project.status === "active"
                ? locale === "en"
                  ? "In Progress"
                  : "Em Andamento"
                : locale === "en"
                  ? "Completed"
                  : "Concluído"}
            </Badge>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {title}
            </h1>

            <div className="flex flex-wrap gap-6 text-muted-foreground">
              {project.funding_agency && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  <span>{project.funding_agency}</span>
                </div>
              )}

              {(project.start_date || project.end_date) && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>
                    {project.start_date && formatDate(project.start_date)}
                    {project.start_date && project.end_date && " - "}
                    {project.end_date && formatDate(project.end_date)}
                    {project.start_date &&
                      !project.end_date &&
                      ` - ${locale === "en" ? "Present" : "Atual"}`}
                  </span>
                </div>
              )}

              {members.length > 0 && (
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>
                    {members.length} {locale === "en" ? "members" : "membros"}
                  </span>
                </div>
              )}
            </div>

            {project.website_url && (
              <Button asChild>
                <a
                  href={project.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {locale === "en" ? "Project Website" : "Site do Projeto"}
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Description */}
          {description && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {locale === "en" ? "Description" : "Descrição"}
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>
            </div>
          )}

          {/* Objectives */}
          {objectives && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {locale === "en" ? "Objectives" : "Objetivos"}
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {objectives}
                </p>
              </div>
            </div>
          )}

          {/* Results */}
          {results && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {locale === "en" ? "Results" : "Resultados"}
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {results}
                </p>
              </div>
            </div>
          )}

          <Separator />

          {/* Team Members */}
          {members.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                {locale === "en" ? "Team" : "Equipe"}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map(
                  (member: {
                    id: string;
                    slug: string;
                    name_pt: string;
                    name_en: string;
                    photo_url?: string;
                    role: string;
                    projectRole?: string;
                  }) => (
                    <Card
                      key={member.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <Link
                          href={`/${locale}/team/${member.slug}`}
                          className="flex items-center gap-3"
                        >
                          <Avatar>
                            <AvatarImage src={member.photo_url || ""} />
                            <AvatarFallback>
                              {getInitials(
                                locale === "en"
                                  ? member.name_en || member.name_pt
                                  : member.name_pt,
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium truncate hover:text-primary transition-colors">
                              {locale === "en"
                                ? member.name_en || member.name_pt
                                : member.name_pt}
                            </p>
                            {member.projectRole && (
                              <p className="text-sm text-muted-foreground truncate">
                                {member.projectRole}
                              </p>
                            )}
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ),
                )}
              </div>
            </div>
          )}

          {/* Publications */}
          {publications.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                {locale === "en"
                  ? "Related Publications"
                  : "Publicações Relacionadas"}
              </h2>
              <div className="space-y-4">
                {publications.map(
                  (pub: {
                    id: string;
                    title: string;
                    authors: string;
                    year: number;
                    publication_type: string;
                    doi?: string;
                  }) => (
                    <Card key={pub.id}>
                      <CardContent className="p-4">
                        <div className="space-y-1">
                          <p className="font-medium">{pub.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {pub.authors}
                          </p>
                          <div className="flex items-center gap-2 text-sm">
                            <Badge variant="outline">{pub.year}</Badge>
                            {pub.doi && (
                              <a
                                href={`https://doi.org/${pub.doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <FileText className="h-3 w-3" />
                                DOI
                              </a>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

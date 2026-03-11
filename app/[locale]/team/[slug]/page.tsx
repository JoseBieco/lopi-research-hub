import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import {
  ArrowLeft,
  Mail,
  Globe,
  Github,
  Linkedin,
  BookOpen,
  GraduationCap,
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

  const { data: member } = await supabase
    .from("members")
    .select("name_pt, name_en, role, bio_pt, bio_en")
    .eq("slug", slug)
    .single();

  if (!member) {
    return { title: "Member Not Found" };
  }

  const name = locale === "en" ? member.name_en : member.name_pt;
  const bio = locale === "en" ? member.bio_en : member.bio_pt;

  return {
    title: `${name || "Membro"} | Plataforma Acadêmica`,
    description: bio?.substring(0, 160) || `Perfil de ${name}`,
  };
}

export default async function MemberProfilePage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations();
  const supabase = await createClient();

  // Fetch member data
  const { data: member, error } = await supabase
    .from("members")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !member) {
    notFound();
  }

  // Fetch member's projects
  const { data: memberProjects } = await supabase
    .from("project_members")
    .select(
      `
      project:projects (
        id, slug, title_pt, title_en, status
      )
    `,
    )
    .eq("member_id", member.id);

  // Fetch member's publications
  const { data: memberPublications } = await supabase
    .from("publication_authors")
    .select(
      `
      publication:publications (
        id, title, authors, year, publication_type, doi
      )
    `,
    )
    .eq("member_id", member.id)
    .order("year", { foreignTable: "publications", ascending: false });

  const name =
    locale === "en" ? member.name_en || member.name_pt : member.name_pt;
  const bio = locale === "en" ? member.bio_en || member.bio_pt : member.bio_pt;
  const currentRole =
    locale === "en"
      ? member.current_role_en || member.current_role_pt
      : member.current_role_pt;

  const roleLabels: Record<string, string> = {
    professor: locale === "en" ? "Professor" : "Docente",
    postdoc: locale === "en" ? "Postdoctoral Researcher" : "Pós-Doutorando",
    phd: locale === "en" ? "PhD Student" : "Doutorando",
    masters: locale === "en" ? "Master's Student" : "Mestrando",
    undergrad:
      locale === "en" ? "Undergraduate Researcher" : "Iniciação Científica",
    alumni: locale === "en" ? "Alumni" : "Egresso",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const projects =
    memberProjects?.map((mp) => mp.project).filter(Boolean) || [];
  const publications =
    memberPublications?.map((mp) => mp.publication).filter(Boolean) || [];

  return (
    <main id="main-content" className="flex-1">
      {/* Back button */}
      <div className="bg-muted/50 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/${locale}/team`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {locale === "en" ? "Back to team" : "Voltar para equipe"}
            </Link>
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <Avatar className="h-40 w-40 flex-shrink-0 border-4 border-background shadow-xl">
              <AvatarImage src={member.photo_url || ""} alt={name} />
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {name}
                </h1>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary" className="text-sm">
                    {roleLabels[member.role] || member.role}
                  </Badge>
                  {currentRole && (
                    <span className="text-muted-foreground">{currentRole}</span>
                  )}
                </div>
              </div>

              {/* External Links */}
              <div className="flex flex-wrap gap-2">
                {member.email && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${member.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </a>
                  </Button>
                )}
                {member.lattes_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={member.lattes_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Lattes
                    </a>
                  </Button>
                )}
                {member.orcid_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={member.orcid_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      ORCID
                    </a>
                  </Button>
                )}
                {member.linkedin_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {member.github_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={member.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}
                {member.website_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={member.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Biography */}
          {bio && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {locale === "en" ? "Biography" : "Biografia"}
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {bio}
                </p>
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {locale === "en" ? "Projects" : "Projetos"}
              </h2>
              <div className="grid gap-4">
                {projects.map(
                  (project: {
                    id: string;
                    slug: string;
                    title_pt: string;
                    title_en: string;
                    status: string;
                  }) => (
                    <Card key={project.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <Link
                            href={`/${locale}/projects/${project.slug}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {locale === "en"
                              ? project.title_en
                              : project.title_pt}
                          </Link>
                          <Badge
                            variant={
                              project.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {project.status === "active"
                              ? locale === "en"
                                ? "Active"
                                : "Ativo"
                              : locale === "en"
                                ? "Completed"
                                : "Concluído"}
                          </Badge>
                        </div>
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
              <h2 className="text-2xl font-bold mb-4">
                {locale === "en" ? "Publications" : "Publicações"}
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
                            <Badge variant="secondary">
                              {pub.publication_type}
                            </Badge>
                            {pub.doi && (
                              <a
                                href={`https://doi.org/${pub.doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
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

          {/* Empty state for projects and publications */}
          {projects.length === 0 && publications.length === 0 && !bio && (
            <div className="text-center py-12 text-muted-foreground">
              {locale === "en"
                ? "No additional information available for this member."
                : "Nenhuma informação adicional disponível para este membro."}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

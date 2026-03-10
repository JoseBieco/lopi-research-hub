import { createClient } from "@/lib/supabase/server";

const sampleData = {
  members: [
    {
      slug: "dr-carlos-silva",
      name_pt: "Dr. Carlos Silva",
      name_en: "Dr. Carlos Silva",
      role: "professor",
      bio_pt:
        "Professor com expertise em otimização e métodos numéricos. Líder do grupo de pesquisa.",
      email: "carlos.silva@example.com",
      display_order: 1,
    },
    {
      slug: "maria-oliveira",
      name_pt: "Dra. Maria Oliveira",
      name_en: "Dr. Maria Oliveira",
      role: "postdoc",
      bio_pt: "Pesquisadora em reconstrução de imagens e problemas inversos.",
      display_order: 2,
    },
    {
      slug: "joao-santos",
      name_pt: "João Santos",
      role: "phd",
      bio_pt: "Doutorando em otimização convexa.",
      display_order: 3,
    },
  ],

  projects: [
    {
      slug: "projeto-otimizacao-gpu",
      title_pt: "Otimização em GPU para Processamento em Larga Escala",
      description_pt:
        "Desenvolvimento de algoritmos paralelos para otimização em GPU.",
      status: "in_progress",
      funding_agency: "CNPq",
    },
    {
      slug: "reconstrucao-tomografia",
      title_pt: "Métodos Numéricos para Tomografia Computadorizada",
      description_pt:
        "Pesquisa em métodos regularizados para reconstrução de imagens tomográficas.",
      status: "completed",
      funding_agency: "FAPESP",
    },
  ],

  publications: [
    {
      title:
        "Fast algorithms for image reconstruction using proximal methods and applications to tomography",
      publication_type: "journal",
      venue: "Journal of Computational and Applied Mathematics",
      year: 2024,
      abstract_pt:
        "Este artigo apresenta algoritmos eficientes para problemas de reconstrução de imagens.",
      doi: "10.1016/j.cam.2024.001234",
    },
  ],

  tools: [
    {
      slug: "pyotim",
      name: "PyOtim",
      description_pt:
        "Biblioteca Python para otimização numérica com suporte a GPU.",
      tool_url: "https://pypi.org/project/pyotim",
      github_url: "https://github.com/research-group/pyotim",
      is_featured: true,
    },
  ],

  news: [
    {
      slug: "publicacao-destaque-2024",
      title_pt: "Novo artigo publicado em periódico de alto impacto",
      content_pt: "O artigo foi aceito para publicação em janeiro de 2024.",
      news_type: "publication",
      is_published: true,
    },
  ],
};

export async function POST(request: Request) {
  try {
    // Only allow from localhost or with admin auth
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.user_metadata?.is_admin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Starting database seed...");

    // Insert members
    const { error: membersError } = await supabase
      .from("members")
      .insert(sampleData.members);

    if (membersError && !membersError.message.includes("duplicate")) {
      console.log("Members error:", membersError);
    }

    // Insert projects
    const { error: projectsError } = await supabase
      .from("projects")
      .insert(sampleData.projects);

    if (projectsError && !projectsError.message.includes("duplicate")) {
      console.log("Projects error:", projectsError);
    }

    // Insert publications
    const { error: pubError } = await supabase
      .from("publications")
      .insert(sampleData.publications);

    if (pubError && !pubError.message.includes("duplicate")) {
      console.log("Publications error:", pubError);
    }

    // Insert tools
    const { error: toolsError } = await supabase
      .from("tools")
      .insert(sampleData.tools);

    if (toolsError && !toolsError.message.includes("duplicate")) {
      console.log("Tools error:", toolsError);
    }

    // Insert news
    const { error: newsError } = await supabase
      .from("news")
      .insert(sampleData.news);

    if (newsError && !newsError.message.includes("duplicate")) {
      console.log("News error:", newsError);
    }

    return Response.json({
      success: true,
      message: "Database seeded successfully",
    });
  } catch (error) {
    console.error("Seed error:", error);
    return Response.json({ error: "Failed to seed database" }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    message: "Use POST to seed the database",
  });
}

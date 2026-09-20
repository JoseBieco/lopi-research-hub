import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import NewsList from "./news-list";

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const supabase = await createClient();
  const { data: newsData } = await supabase
    .from("news")
    .select("id, slug, title_pt, title_en, content_pt, content_en, news_type, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  const news = newsData || [];

  const translations = {
    searchPlaceholder: locale === "en" ? "Search news..." : "Buscar notícias...",
    all: locale === "en" ? "All" : "Todas",
    readMore: locale === "en" ? "Read full article" : "Ler artigo completo",
    noResults: locale === "en" ? "No news found." : "Nenhuma notícia encontrada.",
    sortNewest: locale === "en" ? "Newest first" : "Mais recentes primeiro",
    sortOldest: locale === "en" ? "Oldest first" : "Mais antigas primeiro",
    adminLink: locale === "en" ? "Go to Admin Panel" : "Ir para Painel Administrativo",
  };

  return (
    <main id="main-content" className="flex-1 bg-slate-50/50 pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 border-b border-blue-100/50 mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight">
            {t("common.news")}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            {locale === "en" 
              ? "Follow the latest updates, achievements, and events from our research group." 
              : "Acompanhe os últimos acontecimentos, prêmios e eventos do nosso grupo de pesquisa."}
          </p>
        </div>
      </section>

      {/* Interactive News Feed */}
      <NewsList 
        initialNews={news} 
        locale={locale} 
        translations={translations} 
      />
    </main>
  );
}

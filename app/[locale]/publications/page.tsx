import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import PublicationsList from "./publications-list";

export default async function PublicationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  // Busca os dados do Supabase no lado do Servidor
  const supabase = await createClient();
  const { data: publicationsData } = await supabase
    .from("publications")
    .select("id, title, authors, publication_type, year, venue, abstract_pt, abstract_en, bibtex, doi, pdf_url")
    .order("year", { ascending: false });

  const publications = publicationsData || [];

  // Passar as traduções que o Client Component precisa
  const listTranslations = {
    journal: t("publications.journal"),
    conference: t("publications.conference"),
    book_chapter: t("publications.book_chapter"),
    thesis: t("publications.thesis"),
    workshop: t("publications.workshop"),
    proceedings: t("publications.proceedings"),
    filter_by_year: t("publications.filter_by_year"),
    filter_by_type: t("publications.filter_by_type"),
    copy_bibtex: t("publications.copy_bibtex"),
    view_doi: t("publications.view_doi"),
    all: locale === "en" ? "All" : "Todos",
    results: locale === "en" ? "Results" : "Resultados",
    no_publications: locale === "en" ? "No publications available." : "Nenhuma publicação disponível.",
    no_results: locale === "en" ? "No publications match the filters." : "Nenhuma publicação corresponde aos filtros.",
    year: locale === "en" ? "Year" : "Ano",
    venue: locale === "en" ? "Venue" : "Local",
    copied_bibtex: locale === "en" ? "BibTeX copied!" : "BibTeX copiado!",
  };

  return (
    <main id="main-content" className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            {t("publications.title")}
          </h1>
        </div>
      </section>

      {/* Interactive Client Component */}
      <PublicationsList
        initialPublications={publications}
        locale={locale}
        translations={listTranslations}
      />
    </main>
  );
}


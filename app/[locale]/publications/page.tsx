"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

export default function PublicationsPage() {
  const t = useTranslations();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterYear, setFilterYear] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await fetch("/api/publications");
      if (response.ok) {
        const data = await response.json();
        setPublications(data);
      }
    } catch (error) {
      console.error("Error fetching publications:", error);
    } finally {
      setLoading(false);
    }
  };

  const typeLabels: Record<string, string> = {
    journal: t("publications.journal"),
    conference: t("publications.conference"),
    book_chapter: t("publications.book_chapter"),
    thesis: t("publications.thesis"),
    workshop: t("publications.workshop"),
    proceedings: t("publications.proceedings"),
  };

  const filteredPublications = publications.filter((p: any) => {
    if (filterYear && p.year !== parseInt(filterYear)) return false;
    if (filterType && p.publication_type !== filterType) return false;
    return true;
  });

  const years = Array.from(
    new Set(publications.map((p: any) => p.year).filter(Boolean)),
  ).sort((a, b) => b - a);

  const copyBibTeX = (bibtex: string) => {
    navigator.clipboard.writeText(bibtex);
    alert("BibTeX copiado!");
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

      {/* Filters and Publications */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          {publications.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t("publications.filter_by_year")}
                  </label>
                  <select
                    value={filterYear || ""}
                    onChange={(e) => setFilterYear(e.target.value || null)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  >
                    <option value="">Todos</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t("publications.filter_by_type")}
                  </label>
                  <select
                    value={filterType || ""}
                    onChange={(e) => setFilterType(e.target.value || null)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  >
                    <option value="">Todos</option>
                    {Object.entries(typeLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">
                    Resultados
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {filteredPublications.length}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Publications List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Carregando publicações...</p>
            </div>
          ) : filteredPublications.length === 0 && publications.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <p className="text-slate-600 mb-4">
                Nenhuma publicação disponível.
              </p>
            </div>
          ) : filteredPublications.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <p className="text-slate-600">
                Nenhuma publicação corresponde aos filtros.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPublications.map((pub: any) => (
                <article
                  key={pub.id}
                  className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {pub.title}
                  </h3>

                  <div className="flex flex-wrap gap-4 mb-4">
                    <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      {typeLabels[pub.publication_type] || pub.publication_type}
                    </span>
                    {pub.year && (
                      <span className="text-sm text-slate-600">
                        <strong>Ano:</strong> {pub.year}
                      </span>
                    )}
                    {pub.venue && (
                      <span className="text-sm text-slate-600">
                        <strong>Local:</strong> {pub.venue}
                      </span>
                    )}
                  </div>

                  {pub.abstract_pt && (
                    <p className="text-slate-600 mb-4">{pub.abstract_pt}</p>
                  )}

                  <div className="flex flex-wrap gap-4 pt-4 border-t">
                    {pub.bibtex && (
                      <button
                        onClick={() => copyBibTeX(pub.bibtex)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {t("publications.copy_bibtex")}
                      </button>
                    )}
                    {pub.doi && (
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {t("publications.view_doi")}
                      </a>
                    )}
                    {pub.pdf_url && (
                      <a
                        href={pub.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        PDF
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

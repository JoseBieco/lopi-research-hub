"use client";

import { useState, useMemo } from "react";
import { 
  FileText, 
  Presentation, 
  BookOpen, 
  GraduationCap, 
  BookType, 
  Quote, 
  ExternalLink, 
  FileDown, 
  Search, 
  Check, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";

type Publication = {
  id: string;
  title: string;
  authors: string;
  publication_type: string;
  year: number;
  venue: string;
  abstract_pt?: string;
  abstract_en?: string;
  bibtex?: string;
  doi?: string;
  pdf_url?: string;
};

export default function PublicationsList({
  initialPublications,
  locale,
  translations,
}: {
  initialPublications: Publication[];
  locale: string;
  translations: Record<string, string>;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterYear, setFilterYear] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const typeLabels: Record<string, string> = {
    journal: translations.journal,
    conference: translations.conference,
    book_chapter: translations.book_chapter,
    thesis: translations.thesis,
    workshop: translations.workshop,
    proceedings: translations.proceedings,
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "journal": return <FileText className="w-4 h-4" />;
      case "conference":
      case "workshop": return <Presentation className="w-4 h-4" />;
      case "thesis": return <GraduationCap className="w-4 h-4" />;
      case "book_chapter": return <BookType className="w-4 h-4" />;
      case "proceedings": return <BookOpen className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredPublications = useMemo(() => {
    return initialPublications.filter((p) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        !query || 
        p.title?.toLowerCase().includes(query) || 
        p.authors?.toLowerCase().includes(query) ||
        p.venue?.toLowerCase().includes(query);
      
      const matchesYear = !filterYear || p.year === parseInt(filterYear);
      const matchesType = !filterType || p.publication_type === filterType;
      
      return matchesSearch && matchesYear && matchesType;
    });
  }, [initialPublications, searchQuery, filterYear, filterType]);

  const years = Array.from(
    new Set(initialPublications.map((p) => p.year).filter(Boolean)),
  ).sort((a, b) => b - a);

  const copyBibTeX = (id: string, bibtex: string) => {
    navigator.clipboard.writeText(bibtex);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getAbstract = (pub: Publication) => locale === 'en' && pub.abstract_en ? pub.abstract_en : pub.abstract_pt;

  return (
    <section className="py-12 md:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Filters & Search Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="grid md:grid-cols-12 gap-4 items-end">
            
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {locale === 'en' ? 'Search' : 'Buscar'}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder={locale === 'en' ? "Search by title, author, or venue..." : "Buscar por título, autor ou local..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700"
                />
              </div>
            </div>

            {/* Year Filter */}
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {translations.filter_by_year}
              </label>
              <select
                value={filterYear || ""}
                onChange={(e) => setFilterYear(e.target.value || null)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              >
                <option value="">{translations.all}</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {translations.filter_by_type}
              </label>
              <select
                value={filterType || ""}
                onChange={(e) => setFilterType(e.target.value || null)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              >
                <option value="">{translations.all}</option>
                {Object.entries(typeLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="mt-6 flex items-center justify-between text-sm text-slate-500 border-t border-slate-100 pt-4">
            <p>
              <strong className="text-indigo-600 font-bold">{filteredPublications.length}</strong> {translations.results}
            </p>
          </div>
        </div>

        {/* Publications List */}
        {filteredPublications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">
              {searchQuery || filterYear || filterType 
                ? translations.no_results 
                : translations.no_publications}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPublications.map((pub) => {
              const abstract = getAbstract(pub);
              const isExpanded = expandedId === pub.id;

              return (
                <article
                  key={pub.id}
                  className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group relative overflow-hidden"
                >
                  {/* Left accent border */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Badges / Meta info */}
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-100">
                      {getTypeIcon(pub.publication_type)}
                      {typeLabels[pub.publication_type] || pub.publication_type}
                    </span>
                    {pub.year && (
                      <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
                        {pub.year}
                      </span>
                    )}
                  </div>

                  {/* Title & Authors */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
                    {pub.title}
                  </h3>
                  
                  {pub.authors && (
                    <p className="text-slate-600 mb-4 font-medium text-sm leading-relaxed">
                      {pub.authors}
                    </p>
                  )}

                  {/* Venue */}
                  {pub.venue && (
                    <div className="text-sm text-slate-500 mb-4 flex items-start gap-2">
                      <span className="font-semibold text-slate-400 mt-0.5">&mdash;</span>
                      <span className="italic">{pub.venue}</span>
                    </div>
                  )}

                  {/* Abstract Toggle */}
                  {abstract && (
                    <div className="mt-4 mb-4">
                      <button 
                        onClick={() => setExpandedId(isExpanded ? null : pub.id)}
                        className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        {isExpanded ? (
                          <><ChevronUp className="w-4 h-4" /> {locale === 'en' ? 'Hide Abstract' : 'Ocultar Resumo'}</>
                        ) : (
                          <><ChevronDown className="w-4 h-4" /> {locale === 'en' ? 'View Abstract' : 'Ver Resumo'}</>
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="mt-3 p-4 bg-slate-50 rounded-lg text-sm text-slate-700 leading-relaxed border border-slate-100">
                          {abstract}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-5 mt-2 border-t border-slate-100">
                    {pub.doi && (
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        DOI
                      </a>
                    )}
                    {pub.pdf_url && (
                      <a
                        href={pub.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 transition-all shadow-sm"
                      >
                        <FileDown className="w-4 h-4" />
                        PDF
                      </a>
                    )}
                    {pub.bibtex && (
                      <button
                        onClick={() => copyBibTeX(pub.id, pub.bibtex!)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                      >
                        {copiedId === pub.id ? (
                          <><Check className="w-4 h-4 text-emerald-500" /> {translations.copied_bibtex || "Copiado!"}</>
                        ) : (
                          <><Quote className="w-4 h-4" /> BibTeX</>
                        )}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, CalendarDays, ArrowRight, Filter } from "lucide-react";

type NewsItem = {
  id: string;
  slug: string;
  title_pt: string;
  title_en: string;
  content_pt: string;
  content_en: string;
  news_type: string;
  published_at: string;
};

interface NewsListProps {
  initialNews: NewsItem[];
  locale: string;
  translations: {
    searchPlaceholder: string;
    all: string;
    readMore: string;
    noResults: string;
    sortNewest: string;
    sortOldest: string;
    adminLink: string;
  };
}

export default function NewsList({ initialNews, locale, translations }: NewsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const typeConfigs: Record<string, { icon: string; label: string; color: string }> = {
    defense: { icon: "🎓", label: locale === "en" ? "Defense" : "Defesa", color: "bg-purple-100 text-purple-700 border-purple-200" },
    award: { icon: "🏆", label: locale === "en" ? "Award" : "Prêmio", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    publication: { icon: "📄", label: locale === "en" ? "Publication" : "Publicação", color: "bg-blue-100 text-blue-700 border-blue-200" },
    grant: { icon: "💰", label: locale === "en" ? "Grant" : "Edital", color: "bg-green-100 text-green-700 border-green-200" },
    general: { icon: "📢", label: locale === "en" ? "General" : "Geral", color: "bg-slate-100 text-slate-700 border-slate-200" },
    seminar: { icon: "🔎", label: locale === "en" ? "Seminar" : "Seminário", color: "bg-orange-100 text-orange-700 border-orange-200" },
  };

  const types = Object.keys(typeConfigs);

  const filteredAndSortedNews = useMemo(() => {
    return initialNews
      .filter((item) => {
        const title = locale === "en" && item.title_en ? item.title_en : item.title_pt;
        const content = locale === "en" && item.content_en ? item.content_en : item.content_pt;
        
        // Match Search
        const matchesSearch =
          title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          content?.toLowerCase().includes(searchTerm.toLowerCase());

        // Match Type
        const matchesType = selectedType === "all" || item.news_type === selectedType;

        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const dateA = new Date(a.published_at).getTime();
        const dateB = new Date(b.published_at).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
  }, [initialNews, searchTerm, selectedType, sortOrder, locale]);

  const getTitle = (item: NewsItem) => locale === "en" && item.title_en ? item.title_en : item.title_pt;
  const getContent = (item: NewsItem) => locale === "en" && item.content_en ? item.content_en : item.content_pt;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === "en" ? "en-US" : "pt-BR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Control Panel (Filters & Sort) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-10">
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
          
          {/* Search Bar */}
          <div className="relative w-full lg:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder={translations.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 block w-full rounded-lg border border-slate-300 bg-slate-50 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <Filter className="h-5 w-5 text-slate-400 hidden lg:block" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
              className="block w-full rounded-lg border border-slate-300 bg-slate-50 py-2 px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            >
              <option value="desc">{translations.sortNewest}</option>
              <option value="asc">{translations.sortOldest}</option>
            </select>
          </div>
        </div>

        {/* Categories / Pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedType === "all"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {translations.all}
          </button>
          {types.map((type) => {
            const config = typeConfigs[type] || typeConfigs.general;
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${
                  isSelected
                    ? "bg-slate-800 text-white shadow-md border-transparent"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span>{config.icon}</span>
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of News Cards */}
      {filteredAndSortedNews.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            {initialNews.length === 0 ? "Nenhuma notícia publicada" : translations.noResults}
          </h3>
          <p className="text-slate-500 mb-6">
            {initialNews.length === 0 
              ? "Ainda não há conteúdo no sistema." 
              : "Tente ajustar os filtros de busca para encontrar o que procura."}
          </p>
          {initialNews.length === 0 && (
            <Link
              href="/admin/login"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {translations.adminLink}
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedNews.map((item) => {
            const config = typeConfigs[item.news_type] || typeConfigs.general;

            return (
              <article
                key={item.id}
                className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Header (Type & Date) */}
                <div className={`px-6 py-4 flex justify-between items-center border-b ${config.color.replace('text-', 'border-').replace('100', '200')} ${config.color.split(' ')[0]}`}>
                  <div className={`flex items-center gap-2 font-medium text-sm ${config.color.split(' ')[1]}`}>
                    <span>{config.icon}</span>
                    {config.label}
                  </div>
                  <div className="flex items-center text-slate-500 text-xs font-medium">
                    <CalendarDays className="h-3 w-3 mr-1" />
                    {formatDate(item.published_at)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    <Link href={`/news/${item.slug}`}>
                      {getTitle(item)}
                    </Link>
                  </h3>
                  
                  {getContent(item) && (
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                      {getContent(item)}
                    </p>
                  )}

                  {/* Action Link */}
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center text-blue-600 font-semibold text-sm group-hover:text-blue-700">
                    <Link href={`/news/${item.slug}`} className="flex items-center">
                      {translations.readMore}
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

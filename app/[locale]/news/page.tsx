"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function NewsPage() {
  const t = useTranslations();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news");
      if (response.ok) {
        const data = await response.json();
        setNews(data);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const newsTypeLabels: Record<string, string> = {
    defense: "🎓 Defesa",
    award: "🏆 Prêmio",
    publication: "📄 Publicação",
    grant: "💰 Edital",
    general: "📢 Geral",
    seminar: "🔎 Seminário",
  };

  const getIcon = (type: string) => {
    const icons: Record<string, string> = {
      defense: "🎓",
      award: "🏆",
      publication: "📄",
      grant: "💰",
      general: "📢",
      seminar: "🔎",
    };
    return icons[type] || "📢";
  };

  return (
    <main id="main-content" className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            {t("common.news")}
          </h1>
          <p className="text-lg text-slate-600">
            Acompanhe os últimos acontecimentos do grupo de pesquisa
          </p>
        </div>
      </section>

      {/* News Feed */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Carregando notícias...</p>
            </div>
          ) : news.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <p className="text-slate-600 mb-4">
                Nenhuma notícia publicada no momento.
              </p>
              <a
                href="/admin/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Ir para Administração
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {news.map((item: any) => {
                const publishedDate = new Date(item.published_at);
                const formattedDate = publishedDate.toLocaleDateString(
                  "pt-BR",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                );

                return (
                  <article
                    key={item.id}
                    className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow border-l-4 border-blue-600"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <span className="text-3xl">
                        {getIcon(item.news_type)}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-slate-500 font-medium mb-1">
                          {newsTypeLabels[item.news_type] || item.news_type} •{" "}
                          {formattedDate}
                        </p>
                        <h3 className="text-2xl font-bold text-slate-900">
                          {item.title_pt}
                        </h3>
                      </div>
                    </div>

                    {item.content_pt && (
                      <p className="text-slate-600 mb-4 leading-relaxed">
                        {item.content_pt}
                      </p>
                    )}

                    <Link
                      href={`/news/${item.slug}`}
                      className="inline-block text-blue-600 hover:text-blue-700 font-medium mt-4"
                    >
                      Ler mais →
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

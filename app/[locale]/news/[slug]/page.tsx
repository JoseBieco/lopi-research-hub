import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, Calendar, Tag, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import { ShareButton } from "@/components/share-button";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const supabase = await createClient();

  const { data: news } = await supabase
    .from("news")
    .select("title_pt, title_en, excerpt_pt, excerpt_en, cover_image_url")
    .eq("slug", slug)
    .single();

  if (!news) {
    return { title: "News Not Found" };
  }

  const title = locale === "en" ? news.title_en : news.title_pt;
  const description = locale === "en" ? news.excerpt_en : news.excerpt_pt;

  return {
    title: `${title || "Notícia"} | Plataforma Acadêmica`,
    description: description?.substring(0, 160) || `Notícia: ${title}`,
    openGraph: {
      title: title || "Notícia",
      description: description || "",
      images: news.cover_image_url ? [news.cover_image_url] : [],
    },
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations();
  const supabase = await createClient();

  // Fetch news data
  const { data: news, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !news) {
    notFound();
  }

  const title =
    locale === "en" ? news.title_en || news.title_pt : news.title_pt;
  const content =
    locale === "en" ? news.content_en || news.content_pt : news.content_pt;
  const excerpt =
    locale === "en" ? news.excerpt_en || news.excerpt_pt : news.excerpt_pt;

  const typeLabels: Record<string, string> = {
    defense: locale === "en" ? "Defense" : "Defesa",
    award: locale === "en" ? "Award" : "Prêmio",
    publication: locale === "en" ? "Publication" : "Publicação",
    event: locale === "en" ? "Event" : "Evento",
    grant: locale === "en" ? "Grant" : "Edital",
    general: locale === "en" ? "General" : "Geral",
    seminar: locale === "en" ? "Seminar" : "Seminário",
  };

  const typeColors: Record<string, string> = {
    defense: "bg-purple-100 text-purple-800",
    award: "bg-amber-100 text-amber-800",
    publication: "bg-blue-100 text-blue-800",
    event: "bg-emerald-100 text-emerald-800",
    grant: "bg-rose-100 text-rose-800",
    general: "bg-slate-100 text-slate-800",
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === "en" ? "en-US" : "pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Fetch related news
  const { data: relatedNews } = await supabase
    .from("news")
    .select("id, slug, title_pt, title_en, published_at, news_type")
    .eq("is_published", true)
    .neq("id", news.id)
    .eq("news_type", news.news_type)
    .order("published_at", { ascending: false })
    .limit(3);

  return (
    <main id="main-content" className="flex-1">
      {/* Back button */}
      <div className="bg-muted/50 border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/${locale}/news`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {locale === "en" ? "Back to news" : "Voltar para notícias"}
            </Link>
          </Button>
        </div>
      </div>

      {/* Article */}
      <article className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="space-y-4 mb-8">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge
                className={typeColors[news.news_type] || typeColors.general}
              >
                <Tag className="h-3 w-3 mr-1" />
                {typeLabels[news.news_type] || news.news_type}
              </Badge>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="h-4 w-4" />
                <time dateTime={news.published_at}>
                  {formatDate(news.published_at)}
                </time>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              {title}
            </h1>

            {excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed">
                {excerpt}
              </p>
            )}
          </header>

          {/* Cover Image */}
          {news.cover_image_url && (
            <figure className="mb-8">
              <img
                src={news.cover_image_url}
                alt={title}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </figure>
          )}

          {/* Content */}
          <div className="prose prose-slate prose-lg max-w-none">
            {content ? (
              <div
                className="whitespace-pre-line text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: content.replace(/\n/g, "<br />"),
                }}
              />
            ) : (
              <p className="text-muted-foreground">
                {locale === "en"
                  ? "No content available."
                  : "Conteúdo não disponível."}
              </p>
            )}
          </div>

          {/* Share */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex items-center justify-end">
              {/* <span className="text-muted-foreground text-sm">
                {locale === "en" ? "Share this article" : "Compartilhar"}
              </span> */}
              <div className="flex gap-2">
                <ShareButton
                  title={title}
                  label={locale === "en" ? "Share" : "Compartilhar"}
                />
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related News */}
      {relatedNews && relatedNews.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">
              {locale === "en" ? "Related News" : "Notícias Relacionadas"}
            </h2>
            <div className="grid gap-4">
              {relatedNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/${locale}/news/${item.slug}`}
                  className="block p-4 bg-background rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {typeLabels[item.news_type] || item.news_type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(item.published_at)}
                    </span>
                  </div>
                  <h3 className="font-medium hover:text-primary transition-colors">
                    {locale === "en"
                      ? item.title_en || item.title_pt
                      : item.title_pt}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import { 
  Network, 
  Lightbulb, 
  RotateCcw, 
  Layers, 
  Brain, 
  Cpu, 
  Activity, 
  BookOpen, Image as ImageIcon, 
  Calculator, 
  Scan,
  ChevronRight,
  GraduationCap,
  Building2
} from "lucide-react";

export const metadata: Metadata = {
  title: "LOPI | Otimização e Problemas Inversos",
  description:
    "Grupo de pesquisa liderado pelo Prof. Dr. Elias Salomão Helou Neto no ICMC-USP, com apoio da FAPESP. Focado em Otimização Matemática, Problemas Inversos e Machine Learning.",
  keywords: [
    "LOPI",
    "otimização",
    "problemas inversos",
    "ICMC",
    "USP",
    "FAPESP",
    "machine learning",
  ],
  openGraph: {
    title: "LOPI | Otimização e Problemas Inversos",
    description:
      "Grupo de pesquisa liderado pelo Prof. Dr. Elias Salomão Helou Neto no ICMC-USP.",
    type: "website",
  },
};

export default async function Home() {
  // Using async getTranslations for Server Components
  const locale = await getLocale();
  const t = await getTranslations();

  const topics = [
    { icon: Network, title: locale === 'en' ? "Combinatorial Optimization" : "Otimização Combinatória" },
    { icon: Lightbulb, title: locale === 'en' ? "Meta-heuristics" : "Meta-heurísticas" },
    { icon: RotateCcw, title: locale === 'en' ? "Inverse Problems" : "Problemas Inversos" },
    { icon: Layers, title: locale === 'en' ? "Bilevel Optimization" : "Otimização Bilevel" },
    { icon: Brain, title: "Machine Learning" },
    { icon: Cpu, title: locale === 'en' ? "Deep Learning" : "Aprendizado Profundo" },
    { icon: Activity, title: locale === 'en' ? "Continuous & Non-smooth Optimization" : "Otimização Contínua e Não Suave" },
    { icon: ImageIcon, title: locale === 'en' ? "Image Processing" : "Processamento de Imagens" },
    { icon: Calculator, title: locale === 'en' ? "Numerical Methods" : "Métodos Numéricos" },
    { icon: Scan, title: locale === 'en' ? "Reconstruction & Tomography" : "Reconstrução de Imagens e Tomografia" }
  ];

  return (
    <main id="main-content" className="flex-1">
      {/* Hero Section */}
      <section className="relative text-white py-24 md:py-40 overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}>
        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-slate-950/80 mix-blend-multiply z-0" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-0" /><div className="absolute inset-0 bg-gradient-to-r from-indigo-950/80 to-transparent z-0" />


        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
            <Building2 className="w-4 h-4" />
            ICMC-USP • FAPESP
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight">
            <span className="text-indigo-500">LOPI</span> <br className="hidden md:block" />
            <span className="text-slate-200 text-3xl md:text-5xl lg:text-6xl mt-2 block">
              {t("home.subtitle")}
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl leading-relaxed">
            {t("home.hero_text")}
          </p>

          <nav className="flex flex-wrap gap-4">
            <Link
              href="/team"
              className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-lg font-semibold transition-all shadow-lg shadow-blue-900/20 hover:scale-105"
            >
              <GraduationCap className="w-5 h-5 mr-2" />
              {t("common.team")}
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white px-8 py-3.5 rounded-lg font-semibold transition-all hover:scale-105"
            >
              {t("common.projects")}
            </Link>
            <Link
              href="/publications"
              className="inline-flex items-center justify-center bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white px-8 py-3.5 rounded-lg font-semibold transition-all hover:scale-105"
            >
              {t("common.publications")}
            </Link>
          </nav>
        </div>
      </section>

      {/* Tópicos de Interesse */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {locale === 'en' ? "Research Topics" : "Tópicos de Interesse"}
            </h2>
            <p className="text-lg text-slate-600">
              {locale === 'en' 
                ? "Our group develops fundamental and applied research across several areas of mathematics and computing."
                : "Nosso grupo desenvolve pesquisas fundamentais e aplicadas em diversas áreas da matemática e computação."}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {topics.map((topic, idx) => (
              <div 
                key={idx} 
                className="group p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-colors text-center flex flex-col items-center justify-center gap-4"
              >
                <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600 group-hover:scale-110 transition-transform">
                  <topic.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-800 text-sm">
                  {topic.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-slate-900">
            {t("home.research_group")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <article className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">
                {t("common.team")}
              </h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                {t("home.team_description")}
              </p>
              <Link
                href="/team"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-bold"
              >
                {t("home.see_team")} <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </article>

            <article className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6" /> {/* Placeholder for documents icon */}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">
                {t("common.publications")}
              </h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                {t("home.publications_description")}
              </p>
              <Link
                href="/publications"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-bold"
              >
                {t("home.see_publications")} <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </article>

            <article className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">
                {t("common.tools")}
              </h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                {t("home.tools_description")}
              </p>
              <Link
                href="/tools"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-bold"
              >
                {t("home.see_tools")} <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-24 bg-indigo-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {t("home.latest_news")}
          </h2>
          <p className="text-xl mb-10 text-indigo-100">
            {t("home.latest_news_description")}
          </p>
          <Link
            href="/news"
            className="inline-flex items-center bg-white text-indigo-600 hover:bg-slate-50 px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-xl"
          >
            {t("home.see_news")} <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </main>
  );
}




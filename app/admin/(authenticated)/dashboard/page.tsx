import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Otimização: Pegamos apenas as métricas de quantidade (count)
  const [
    { count: membersCount },
    { count: projectsCount },
    { count: publicationsCount },
    { count: toolsCount },
    { count: newsCount },
  ] = await Promise.all([
    supabase.from("members").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("publications").select("*", { count: "exact", head: true }),
    supabase.from("tools").select("*", { count: "exact", head: true }),
    supabase.from("news").select("*", { count: "exact", head: true }),
  ]);

  const stats = {
    members: membersCount || 0,
    projects: projectsCount || 0,
    publications: publicationsCount || 0,
    tools: toolsCount || 0,
    news: newsCount || 0,
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Administrativo</h1>
            <p className="text-sm text-slate-500 mt-1">Visão geral do sistema e ações rápidas</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <article className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <span className="text-6xl">👥</span>
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">Membros</p>
            <p className="text-3xl font-extrabold text-slate-900">{stats.members}</p>
            <Link
              href="/admin/members"
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold mt-4 inline-block relative z-10"
            >
              Gerenciar &rarr;
            </Link>
          </article>

          <article className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <span className="text-6xl">📁</span>
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">Projetos</p>
            <p className="text-3xl font-extrabold text-slate-900">{stats.projects}</p>
            <Link
              href="/admin/projects"
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold mt-4 inline-block relative z-10"
            >
              Gerenciar &rarr;
            </Link>
          </article>

          <article className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <span className="text-6xl">📄</span>
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">Publicações</p>
            <p className="text-3xl font-extrabold text-slate-900">{stats.publications}</p>
            <Link
              href="/admin/publications"
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold mt-4 inline-block relative z-10"
            >
              Gerenciar &rarr;
            </Link>
          </article>

          <article className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <span className="text-6xl">🔧</span>
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">Ferramentas</p>
            <p className="text-3xl font-extrabold text-slate-900">{stats.tools}</p>
            <Link
              href="/admin/tools"
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold mt-4 inline-block relative z-10"
            >
              Gerenciar &rarr;
            </Link>
          </article>

          <article className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <span className="text-6xl">📢</span>
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">Notícias</p>
            <p className="text-3xl font-extrabold text-slate-900">{stats.news}</p>
            <Link
              href="/admin/news"
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold mt-4 inline-block relative z-10"
            >
              Gerenciar &rarr;
            </Link>
          </article>
        </div>

        {/* Quick Access */}
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Ações Rápidas</h2>
            <p className="text-slate-500 text-sm">Crie novos registros diretamente por aqui.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link
              href="/admin/members/new"
              className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl transition-colors text-center group"
            >
              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                ➕
              </div>
              <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">Membro</span>
            </Link>

            <Link
              href="/admin/projects/new"
              className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl transition-colors text-center group"
            >
              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                ➕
              </div>
              <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">Projeto</span>
            </Link>

            <Link
              href="/admin/publications/new"
              className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl transition-colors text-center group"
            >
              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                ➕
              </div>
              <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">Publicação</span>
            </Link>

            <Link
              href="/admin/tools/new"
              className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl transition-colors text-center group"
            >
              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                ➕
              </div>
              <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">Ferramenta</span>
            </Link>

            <Link
              href="/admin/news/new"
              className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl transition-colors text-center group"
            >
              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                ➕
              </div>
              <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">Notícia</span>
            </Link>
            
            <Link
              href="/"
              className="flex flex-col items-center justify-center p-4 bg-slate-900 hover:bg-slate-800 text-white border border-transparent rounded-xl transition-colors text-center group"
            >
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                👁️
              </div>
              <span className="text-sm font-semibold">Ver Site</span>
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}

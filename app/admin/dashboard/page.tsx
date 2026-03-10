"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    members: 0,
    projects: 0,
    publications: 0,
    tools: 0,
    news: 0,
  });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAuth();
    loadStats();
  }, []);

  const checkAuth = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.user_metadata?.is_admin) {
      router.push("/admin/login");
      return;
    }

    setUser(user);
    setLoading(false);
  };

  const loadStats = async () => {
    try {
      const [members, projects, publications, tools, news] = await Promise.all([
        fetch("/api/members").then((r) => r.json()),
        fetch("/api/projects").then((r) => r.json()),
        fetch("/api/publications").then((r) => r.json()),
        fetch("/api/tools").then((r) => r.json()),
        fetch("/api/news").then((r) => r.json()),
      ]);

      setStats({
        members: members.length || 0,
        projects: projects.length || 0,
        publications: publications.length || 0,
        tools: tools.length || 0,
        news: news.length || 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard Administrativo</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-6 mb-12">
          <article className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Membros</p>
            <p className="text-3xl font-bold">{stats.members}</p>
            <Link
              href="/admin/members"
              className="text-blue-400 hover:text-blue-300 text-sm mt-3 inline-block"
            >
              Gerenciar →
            </Link>
          </article>

          <article className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Projetos</p>
            <p className="text-3xl font-bold">{stats.projects}</p>
            <Link
              href="/admin/projects"
              className="text-blue-400 hover:text-blue-300 text-sm mt-3 inline-block"
            >
              Gerenciar →
            </Link>
          </article>

          <article className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Publicações</p>
            <p className="text-3xl font-bold">{stats.publications}</p>
            <Link
              href="/admin/publications"
              className="text-blue-400 hover:text-blue-300 text-sm mt-3 inline-block"
            >
              Gerenciar →
            </Link>
          </article>

          <article className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Ferramentas</p>
            <p className="text-3xl font-bold">{stats.tools}</p>
            <Link
              href="/admin/tools"
              className="text-blue-400 hover:text-blue-300 text-sm mt-3 inline-block"
            >
              Gerenciar →
            </Link>
          </article>

          <article className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Notícias</p>
            <p className="text-3xl font-bold">{stats.news}</p>
            <Link
              href="/admin/news"
              className="text-blue-400 hover:text-blue-300 text-sm mt-3 inline-block"
            >
              Gerenciar →
            </Link>
          </article>
        </div>

        {/* Quick Access */}
        <section className="bg-slate-800 rounded-lg p-8 border border-slate-700">
          <h2 className="text-2xl font-bold mb-6">Ações Rápidas</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/admin/members/new"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors text-center"
            >
              ➕ Novo Membro
            </Link>
            <Link
              href="/admin/projects/new"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors text-center"
            >
              ➕ Novo Projeto
            </Link>
            <Link
              href="/admin/publications/new"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors text-center"
            >
              ➕ Nova Publicação
            </Link>
            <Link
              href="/admin/tools/new"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors text-center"
            >
              ➕ Nova Ferramenta
            </Link>
            <Link
              href="/admin/news/new"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors text-center"
            >
              ➕ Nova Notícia
            </Link>
            <Link
              href="/"
              className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg font-medium transition-colors text-center"
            >
              👁️ Ver Site
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

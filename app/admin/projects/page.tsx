"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const checkAuth = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || !user.user_metadata?.is_admin) {
      router.push("/admin/login");
      return;
    }
    setUser(user);
  };

  const loadProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza?")) return;
    try {
      const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (response.ok) {
        setProjects(projects.filter((p: any) => p.id !== id));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-blue-400 hover:text-blue-300"
            >
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold mt-2">Gerenciar Projetos</h1>
          </div>
          <Link
            href="/admin/projects/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
          >
            ➕ Novo
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <p className="text-slate-400">Carregando...</p>
        ) : projects.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
            <p className="text-slate-400 mb-4">Nenhum projeto cadastrado</p>
            <Link
              href="/admin/projects/new"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
            >
              Criar Primeiro
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto bg-slate-800 rounded-lg border border-slate-700">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900">
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Título
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Agência
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-slate-300">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p: any) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-700 hover:bg-slate-700"
                  >
                    <td className="px-6 py-4 text-sm">{p.title_pt}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${p.status === "in_progress" ? "bg-green-900 text-green-200" : "bg-slate-700 text-slate-300"}`}
                      >
                        {p.status === "in_progress"
                          ? "Em Andamento"
                          : "Concluído"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {p.funding_agency || "-"}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <Link
                        href={`/admin/projects/${p.id}`}
                        className="text-blue-400 hover:text-blue-300 font-medium mr-4"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-400 hover:text-red-300 font-medium"
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

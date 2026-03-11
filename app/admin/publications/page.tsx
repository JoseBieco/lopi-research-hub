"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function PublicationsAdminPage() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadPublications();
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

  const loadPublications = async () => {
    try {
      const response = await fetch("/api/publications");
      if (response.ok) {
        const data = await response.json();
        setPublications(data);
      }
    } catch (error) {
      console.error("Error loading:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza?")) return;
    try {
      const response = await fetch(`/api/publications/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setPublications(publications.filter((p: any) => p.id !== id));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const typeLabels: Record<string, string> = {
    journal: "Periódico",
    conference: "Conferência",
    book_chapter: "Capítulo",
    thesis: "Tese",
    workshop: "Workshop",
    proceedings: "Anais",
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
            <h1 className="text-2xl font-bold mt-2">Gerenciar Publicações</h1>
          </div>
          <Link
            href="/admin/publications/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
          >
            ➕ Novo
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <p className="text-slate-400">Carregando...</p>
        ) : publications.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
            <p className="text-slate-400 mb-4">Nenhuma publicação cadastrada</p>
            <Link
              href="/admin/publications/new"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
            >
              Criar Primeira
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
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Ano
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Local
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-slate-300">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {publications.map((p: any) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-700 hover:bg-slate-700"
                  >
                    <td className="px-6 py-4 text-sm truncate">{p.title}</td>
                    <td className="px-6 py-4 text-sm">
                      {typeLabels[p.publication_type] || p.publication_type}
                    </td>
                    <td className="px-6 py-4 text-sm">{p.year}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {p.venue || "-"}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <Link
                        href={`/admin/publications/${p.id}`}
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

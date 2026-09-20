"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";

export default function PublicationsAdminPage() {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPublications();
  }, []);

  const loadPublications = async () => {
    try {
      const response = await fetch("/api/publications");
      if (response.ok) {
        const data = await response.json();
        setPublications(data);
      } else {
        toast.error("Erro ao carregar publicações.");
      }
    } catch (error) {
      console.error("Error loading publications:", error);
      toast.error("Falha na comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta publicação? Esta ação é irreversível.")) return;
    try {
      const response = await fetch(`/api/publications/${id}`, { method: "DELETE" });
      if (response.ok) {
        setPublications(publications.filter((p) => p.id !== id));
        toast.success("Publicação excluída com sucesso.");
      } else {
        toast.error("Erro ao excluir publicação.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Falha ao excluir publicação.");
    }
  };

  const typeLabels: Record<string, string> = {
    conference: "Conferência",
    journal: "Revista",
    book_chapter: "Capítulo de Livro",
    preprint: "Preprint",
    other: "Outro",
  };

  const filteredPublications = publications.filter(p => 
    (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (p.publication_type && typeLabels[p.publication_type]?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.year && p.year.toString().includes(searchTerm))
  );

  return (
    <div className="min-h-full">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <Link href="/admin/dashboard" className="hover:text-blue-600 transition-colors">Admin</Link>
              <span>/</span>
              <span className="text-slate-900 font-medium">Publicações</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Gerenciar Publicações</h1>
          </div>
          <Link
            href="/admin/publications/new"
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Publicação
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-6 flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm max-w-md">
          <Search className="w-5 h-5 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Buscar por título, ano ou tipo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : publications.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Nenhuma publicação cadastrada</h3>
            <p className="text-slate-500 mb-6">Comece adicionando o primeiro artigo ou trabalho.</p>
            <Link
              href="/admin/publications/new"
              className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5 mr-2" /> Adicionar Publicação
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Título</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ano</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredPublications.map((pub) => (
                    <tr key={pub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{pub.title}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                           {typeLabels[pub.publication_type] || pub.publication_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">{pub.year}</td>
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/publications/${pub.id}`}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(pub.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPublications.length === 0 && (
                     <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                          Nenhuma publicação encontrada com o termo pesquisado.
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Trash2, Edit2, Star } from "lucide-react";
import { toast } from "sonner";

export default function ToolsAdminPage() {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const response = await fetch("/api/tools");
      if (response.ok) {
        const data = await response.json();
        setTools(data);
      } else {
        toast.error("Erro ao carregar ferramentas.");
      }
    } catch (error) {
      console.error("Error loading tools:", error);
      toast.error("Falha na comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta ferramenta? Esta ação é irreversível.")) return;
    try {
      const response = await fetch(`/api/tools/${id}`, { method: "DELETE" });
      if (response.ok) {
        setTools(tools.filter((t) => t.id !== id));
        toast.success("Ferramenta excluída com sucesso.");
      } else {
        toast.error("Erro ao excluir ferramenta.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Falha ao excluir ferramenta.");
    }
  };

  const filteredTools = tools.filter(t => 
    t.name && t.name.toLowerCase().includes(searchTerm.toLowerCase())
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
              <span className="text-slate-900 font-medium">Ferramentas</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Gerenciar Ferramentas</h1>
          </div>
          <Link
            href="/admin/tools/new"
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Ferramenta
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
            placeholder="Buscar pelo nome da ferramenta..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : tools.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Nenhuma ferramenta cadastrada</h3>
            <p className="text-slate-500 mb-6">Comece adicionando o primeiro software ou dataset.</p>
            <Link
              href="/admin/tools/new"
              className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5 mr-2" /> Criar Ferramenta
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Destaque</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Link</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredTools.map((tool) => (
                    <tr key={tool.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{tool.name}</td>
                      <td className="px-6 py-4 text-sm">
                        {tool.is_featured ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
                            Destaque
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {tool.tool_url ? (
                          <a href={tool.tool_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Acessar</a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/tools/${tool.id}`}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(tool.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredTools.length === 0 && (
                     <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                          Nenhuma ferramenta encontrada com o termo pesquisado.
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

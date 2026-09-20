"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";

interface Member {
  id: string;
  slug: string;
  name_pt: string;
  role: string;
  email?: string;
  is_active: boolean;
}

export default function MembersAdminPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const response = await fetch("/api/members");
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      } else {
        toast.error("Erro ao carregar os membros.");
      }
    } catch (error) {
      console.error("Error loading members:", error);
      toast.error("Falha na comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este membro? Esta ação é irreversível.")) return;

    try {
      const response = await fetch(`/api/members/${id}`, { method: "DELETE" });
      if (response.ok) {
        setMembers(members.filter((m) => m.id !== id));
        toast.success("Membro excluído com sucesso.");
      } else {
        toast.error("Erro ao excluir membro.");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error("Falha ao excluir membro.");
    }
  };

  const roleLabels: Record<string, string> = {
    professor: "Professor",
    postdoc: "Pós-Doutorando",
    phd: "Doutorando",
    masters: "Mestrando",
    undergrad: "Iniciação Científica",
    alumni: "Alumni",
  };

  const filteredMembers = members.filter(m => 
    m.name_pt.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.email && m.email.toLowerCase().includes(searchTerm.toLowerCase()))
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
              <span className="text-slate-900 font-medium">Membros</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Gerenciar Membros</h1>
          </div>
          <Link
            href="/admin/members/new"
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Membro
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
            placeholder="Buscar por nome, cargo ou email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : members.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Nenhum membro cadastrado</h3>
            <p className="text-slate-500 mb-6">Comece adicionando o primeiro membro da equipe.</p>
            <Link
              href="/admin/members/new"
              className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5 mr-2" /> Criar Membro
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cargo</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{member.name_pt}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {roleLabels[member.role] || member.role}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{member.email || "-"}</td>
                      <td className="px-6 py-4 text-sm">
                        {member.is_active ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Inativo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/members/${member.id}`}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredMembers.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                          Nenhum membro encontrado com o termo pesquisado.
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

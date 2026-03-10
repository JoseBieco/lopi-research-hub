"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadMembers();
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

  const loadMembers = async () => {
    try {
      const response = await fetch("/api/members");
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      console.error("Error loading members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este membro?")) {
      return;
    }

    try {
      const response = await fetch(`/api/members/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMembers(members.filter((m) => m.id !== id));
      } else {
        alert("Erro ao deletar membro");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("Erro ao deletar membro");
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

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-blue-400 hover:text-blue-300"
            >
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold mt-2">Gerenciar Membros</h1>
          </div>
          <Link
            href="/admin/members/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            ➕ Novo Membro
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <p className="text-slate-400">Carregando...</p>
        ) : members.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
            <p className="text-slate-400 mb-4">Nenhum membro cadastrado</p>
            <Link
              href="/admin/members/new"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Criar Primeiro Membro
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto bg-slate-800 rounded-lg border border-slate-700">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900">
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Nome
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Cargo
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-slate-300">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-slate-700 hover:bg-slate-700"
                  >
                    <td className="px-6 py-4 text-sm">{member.name_pt}</td>
                    <td className="px-6 py-4 text-sm">
                      {roleLabels[member.role as keyof typeof roleLabels] ||
                        member.role}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {member.email || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {member.is_active ? (
                        <span className="px-3 py-1 bg-green-900 text-green-200 rounded-full text-xs font-medium">
                          Ativo
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-900 text-red-200 rounded-full text-xs font-medium">
                          Inativo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <Link
                        href={`/admin/members/${member.id}`}
                        className="text-blue-400 hover:text-blue-300 font-medium mr-4"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(member.id)}
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

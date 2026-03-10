"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function NewMemberPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name_pt: "",
    name_en: "",
    slug: "",
    role: "phd" as const,
    bio_pt: "",
    bio_en: "",
    email: "",
    lattes_url: "",
    linkedin_url: "",
    github_url: "",
    orcid_url: "",
    scholar_url: "",
    photo_url: "",
  });

  useEffect(() => {
    checkAuth();
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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name_pt: newName,
      slug: generateSlug(newName),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Erro ao criar membro");
        return;
      }

      router.push("/admin/members");
    } catch (err) {
      console.error("Error creating member:", err);
      setError("Erro ao criar membro");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/admin/members"
            className="text-blue-400 hover:text-blue-300"
          >
            ← Voltar
          </Link>
          <h1 className="text-2xl font-bold mt-2">Novo Membro</h1>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 rounded-lg p-8 border border-slate-700 space-y-6"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Nome PT */}
          <div>
            <label htmlFor="name_pt" className="block text-sm font-medium mb-2">
              Nome (Português) *
            </label>
            <input
              id="name_pt"
              type="text"
              value={formData.name_pt}
              onChange={handleNameChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-2">
              Slug (URL) *
            </label>
            <input
              id="slug"
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Nome EN */}
          <div>
            <label htmlFor="name_en" className="block text-sm font-medium mb-2">
              Nome (English)
            </label>
            <input
              id="name_en"
              type="text"
              value={formData.name_en}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name_en: e.target.value }))
              }
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium mb-2">
              Cargo *
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  role: e.target.value as any,
                }))
              }
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="professor">Professor</option>
              <option value="postdoc">Pós-Doutorando</option>
              <option value="phd">Doutorando</option>
              <option value="masters">Mestrando</option>
              <option value="undergrad">Iniciação Científica</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bio PT */}
          <div>
            <label htmlFor="bio_pt" className="block text-sm font-medium mb-2">
              Biografia (Português)
            </label>
            <textarea
              id="bio_pt"
              value={formData.bio_pt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio_pt: e.target.value }))
              }
              rows={4}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bio EN */}
          <div>
            <label htmlFor="bio_en" className="block text-sm font-medium mb-2">
              Biografia (English)
            </label>
            <textarea
              id="bio_en"
              value={formData.bio_en}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio_en: e.target.value }))
              }
              rows={4}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Links Sociais</h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="lattes_url"
                  className="block text-sm font-medium mb-2"
                >
                  Lattes
                </label>
                <input
                  id="lattes_url"
                  type="url"
                  value={formData.lattes_url}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lattes_url: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://lattes.cnpq.br/..."
                />
              </div>
              <div>
                <label
                  htmlFor="linkedin_url"
                  className="block text-sm font-medium mb-2"
                >
                  LinkedIn
                </label>
                <input
                  id="linkedin_url"
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      linkedin_url: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="github_url"
                  className="block text-sm font-medium mb-2"
                >
                  GitHub
                </label>
                <input
                  id="github_url"
                  type="url"
                  value={formData.github_url}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      github_url: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="orcid_url"
                  className="block text-sm font-medium mb-2"
                >
                  ORCID
                </label>
                <input
                  id="orcid_url"
                  type="url"
                  value={formData.orcid_url}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      orcid_url: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="scholar_url"
                  className="block text-sm font-medium mb-2"
                >
                  Google Scholar
                </label>
                <input
                  id="scholar_url"
                  type="url"
                  value={formData.scholar_url}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      scholar_url: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-slate-700">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 rounded-lg font-medium transition-colors"
            >
              {submitting ? "Salvando..." : "Salvar Membro"}
            </button>
            <Link
              href="/admin/members"
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

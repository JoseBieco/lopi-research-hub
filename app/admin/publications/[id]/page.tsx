"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminSidebar } from "@/components/admin-sidebar";
import { createClient } from "@/lib/supabase/client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditPublicationPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    year: new Date().getFullYear(),
    publication_type: "journal",
    venue: "",
    doi: "",
    pdf_url: "",
    bibtex: "",
    abstract_pt: "",
    abstract_en: "",
  });

  useEffect(() => {
    if (!isNew) {
      fetchPublication();
    }
  }, [id, isNew]);

  const fetchPublication = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("publications")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData(data);
      }
    } catch (err) {
      console.error("Error fetching publication:", err);
      setError("Erro ao carregar publicação");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();

      if (isNew) {
        const { error } = await supabase
          .from("publications")
          .insert([formData]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("publications")
          .update(formData)
          .eq("id", id);
        if (error) throw error;
      }

      router.push("/admin/publications");
    } catch (err) {
      console.error("Error saving publication:", err);
      setError("Erro ao salvar publicação");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar className="w-64 flex-shrink-0" />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-muted/30">
      <AdminSidebar className="w-64 flex-shrink-0" />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/publications">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {isNew ? "Nova Publicação" : "Editar Publicação"}
              </h1>
              <p className="text-muted-foreground">
                {isNew
                  ? "Adicione uma nova publicação"
                  : "Atualize as informações"}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authors">Autores *</Label>
                  <Input
                    id="authors"
                    value={formData.authors}
                    onChange={(e) => handleChange("authors", e.target.value)}
                    placeholder="Silva, J.; Santos, M.; Oliveira, P."
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Ano *</Label>
                    <Input
                      id="year"
                      type="number"
                      min="1900"
                      max="2100"
                      value={formData.year}
                      onChange={(e) =>
                        handleChange("year", parseInt(e.target.value))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="publication_type">Tipo *</Label>
                    <Select
                      value={formData.publication_type}
                      onValueChange={(value) =>
                        handleChange("publication_type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="journal">Periódico</SelectItem>
                        <SelectItem value="conference">Conferência</SelectItem>
                        <SelectItem value="book_chapter">
                          Capítulo de Livro
                        </SelectItem>
                        <SelectItem value="thesis">Tese/Dissertação</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="proceedings">Anais</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue">Veículo de Publicação</Label>
                  <Input
                    id="venue"
                    value={formData.venue || ""}
                    onChange={(e) => handleChange("venue", e.target.value)}
                    placeholder="Ex: Journal of Optimization Theory, ICML 2024"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Links */}
            <Card>
              <CardHeader>
                <CardTitle>Links e Identificadores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doi">DOI</Label>
                    <Input
                      id="doi"
                      value={formData.doi || ""}
                      onChange={(e) => handleChange("doi", e.target.value)}
                      placeholder="10.1000/xyz123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pdf_url">URL do PDF</Label>
                    <Input
                      id="pdf_url"
                      type="url"
                      value={formData.pdf_url || ""}
                      onChange={(e) => handleChange("pdf_url", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Abstract */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="abstract_pt">Resumo</Label>
                  <Textarea
                    id="abstract_pt"
                    value={formData.abstract_pt || ""}
                    onChange={(e) =>
                      handleChange("abstract_pt", e.target.value)
                    }
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="abstract_en">Abstract</Label>
                  <Textarea
                    id="abstract_en"
                    value={formData.abstract_en || ""}
                    onChange={(e) =>
                      handleChange("abstract_en", e.target.value)
                    }
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* BibTeX */}
            <Card>
              <CardHeader>
                <CardTitle>BibTeX</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="bibtex">Citação BibTeX</Label>
                  <Textarea
                    id="bibtex"
                    value={formData.bibtex || ""}
                    onChange={(e) => handleChange("bibtex", e.target.value)}
                    rows={8}
                    className="font-mono text-sm"
                    placeholder={
                      "@article{silva2024,\n  author = {Silva, João},\n  title = {Título do Artigo},\n  journal = {Revista},\n  year = {2024}\n}"
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isNew ? "Criar Publicação" : "Salvar Alterações"}
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/publications">Cancelar</Link>
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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

export default function EditProjectPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title_pt: "",
    title_en: "",
    slug: "",
    description_pt: "",
    description_en: "",
    objectives_pt: "",
    objectives_en: "",
    results_pt: "",
    results_en: "",
    status: "in_progress",
    funding_agency: "",
    funding_code: "",
    start_date: "",
    end_date: "",
    website_url: "",
  });

  useEffect(() => {
    if (!isNew) {
      fetchProject();
    }
  }, [id, isNew]);

  const fetchProject = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          ...data,
          start_date: data.start_date || "",
          end_date: data.end_date || "",
        });
      }
    } catch (err) {
      console.error("Error fetching project:", err);
      setError("Erro ao carregar projeto");
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
      const dataToSave = {
        ...formData,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      };

      if (isNew) {
        const { error } = await supabase.from("projects").insert([dataToSave]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("projects")
          .update(dataToSave)
          .eq("id", id);
        if (error) throw error;
      }

      router.push("/admin/projects");
    } catch (err) {
      console.error("Error saving project:", err);
      setError("Erro ao salvar projeto");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
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
              <Link href="/admin/projects">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {isNew ? "Novo Projeto" : "Editar Projeto"}
              </h1>
              <p className="text-muted-foreground">
                {isNew
                  ? "Adicione um novo projeto"
                  : "Atualize as informações do projeto"}
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
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title_pt">Título (PT) *</Label>
                    <Input
                      id="title_pt"
                      value={formData.title_pt}
                      onChange={(e) => handleChange("title_pt", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title_en">Título (EN)</Label>
                    <Input
                      id="title_en"
                      value={formData.title_en || ""}
                      onChange={(e) => handleChange("title_en", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL) *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleChange("slug", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in_progress">
                          Em Andamento
                        </SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="funding_agency">Agência de Fomento</Label>
                    <Input
                      id="funding_agency"
                      value={formData.funding_agency || ""}
                      onChange={(e) =>
                        handleChange("funding_agency", e.target.value)
                      }
                      placeholder="Ex: CNPq, FAPESP"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="funding_code">Código do Projeto</Label>
                    <Input
                      id="funding_code"
                      value={formData.funding_code || ""}
                      onChange={(e) =>
                        handleChange("funding_code", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Data de Início</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date || ""}
                      onChange={(e) =>
                        handleChange("start_date", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">Data de Término</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date || ""}
                      onChange={(e) => handleChange("end_date", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website_url">Website do Projeto</Label>
                  <Input
                    id="website_url"
                    type="url"
                    value={formData.website_url || ""}
                    onChange={(e) =>
                      handleChange("website_url", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Descrição</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description_pt">Descrição (PT)</Label>
                  <Textarea
                    id="description_pt"
                    value={formData.description_pt || ""}
                    onChange={(e) =>
                      handleChange("description_pt", e.target.value)
                    }
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_en">Descrição (EN)</Label>
                  <Textarea
                    id="description_en"
                    value={formData.description_en || ""}
                    onChange={(e) =>
                      handleChange("description_en", e.target.value)
                    }
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Objectives */}
            <Card>
              <CardHeader>
                <CardTitle>Objetivos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="objectives_pt">Objetivos (PT)</Label>
                  <Textarea
                    id="objectives_pt"
                    value={formData.objectives_pt || ""}
                    onChange={(e) =>
                      handleChange("objectives_pt", e.target.value)
                    }
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="objectives_en">Objetivos (EN)</Label>
                  <Textarea
                    id="objectives_en"
                    value={formData.objectives_en || ""}
                    onChange={(e) =>
                      handleChange("objectives_en", e.target.value)
                    }
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle>Resultados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="results_pt">Resultados (PT)</Label>
                  <Textarea
                    id="results_pt"
                    value={formData.results_pt || ""}
                    onChange={(e) => handleChange("results_pt", e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="results_en">Resultados (EN)</Label>
                  <Textarea
                    id="results_en"
                    value={formData.results_en || ""}
                    onChange={(e) => handleChange("results_en", e.target.value)}
                    rows={4}
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
                    {isNew ? "Criar Projeto" : "Salvar Alterações"}
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/projects">Cancelar</Link>
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

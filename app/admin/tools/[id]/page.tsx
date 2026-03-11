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
import { Switch } from "@/components/ui/switch";
import { AdminSidebar } from "@/components/admin-sidebar";
import { ImageUploader } from "@/components/image-uploader";
import { createClient } from "@/lib/supabase/client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditToolPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description_pt: "",
    description_en: "",
    tool_url: "",
    github_url: "",
    docs_url: "",
    image_url: "",
    is_featured: false,
    tags: [] as string[],
    slug: "",
  });
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (!isNew) {
      fetchTool();
    }
  }, [id, isNew]);

  const fetchTool = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData(data);
        setTagsInput(data.tags?.join(", ") || "");
      }
    } catch (err) {
      console.error("Error fetching tool:", err);
      setError("Erro ao carregar ferramenta");
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
        tags: tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (isNew) {
        const { error } = await supabase.from("tools").insert([dataToSave]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("tools")
          .update(dataToSave)
          .eq("id", id);
        if (error) throw error;
      }

      router.push("/admin/tools");
    } catch (err) {
      console.error("Error saving tool:", err);
      setError("Erro ao salvar ferramenta");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
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
              <Link href="/admin/tools">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {isNew ? "Nova Ferramenta" : "Editar Ferramenta"}
              </h1>
              <p className="text-muted-foreground">
                {isNew
                  ? "Adicione uma nova ferramenta"
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
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>

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
                  <Label>Logo</Label>
                  <ImageUploader
                    value={formData.image_url || ""}
                    onChange={(url) => handleChange("image_url", url || "")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                  <Input
                    id="tags"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Python, Otimização, Machine Learning"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Destaque</Label>
                    <p className="text-sm text-muted-foreground">
                      Ferramentas em destaque aparecem no topo
                    </p>
                  </div>
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(checked) =>
                      handleChange("is_featured", checked)
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

            {/* Links */}
            <Card>
              <CardHeader>
                <CardTitle>Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">URL de Acesso</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.tool_url || ""}
                    onChange={(e) => handleChange("tool_url", e.target.value)}
                    placeholder="https://ferramenta.exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github_url">Repositório GitHub</Label>
                  <Input
                    id="github_url"
                    type="url"
                    value={formData.github_url || ""}
                    onChange={(e) => handleChange("github_url", e.target.value)}
                    placeholder="https://github.com/usuario/repositorio"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="docs_url">Documentação</Label>
                  <Input
                    id="docs_url"
                    type="url"
                    value={formData.docs_url || ""}
                    onChange={(e) => handleChange("docs_url", e.target.value)}
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
                    {isNew ? "Criar Ferramenta" : "Salvar Alterações"}
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/tools">Cancelar</Link>
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

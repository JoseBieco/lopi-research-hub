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
import { Switch } from "@/components/ui/switch";
import { AdminSidebar } from "@/components/admin-sidebar";
import { ImageUploader } from "@/components/image-uploader";
import { createClient } from "@/lib/supabase/client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditNewsPage({ params }: PageProps) {
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
    excerpt_pt: "",
    excerpt_en: "",
    content_pt: "",
    content_en: "",
    news_type: "general",
    cover_image_url: "",
    is_published: false,
    published_at: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (!isNew) {
      fetchNews();
    }
  }, [id, isNew]);

  const fetchNews = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          ...data,
          published_at:
            data.published_at?.split("T")[0] ||
            new Date().toISOString().split("T")[0],
        });
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Erro ao carregar notícia");
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
        const { error } = await supabase.from("news").insert([formData]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("news")
          .update(formData)
          .eq("id", id);
        if (error) throw error;
      }

      router.push("/admin/news");
    } catch (err) {
      console.error("Error saving news:", err);
      setError("Erro ao salvar notícia");
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
              <Link href="/admin/news">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {isNew ? "Nova Notícia" : "Editar Notícia"}
              </h1>
              <p className="text-muted-foreground">
                {isNew ? "Crie uma nova notícia" : "Atualize as informações"}
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
                    <Label htmlFor="news_type">Tipo *</Label>
                    <Select
                      value={formData.news_type}
                      onValueChange={(value) =>
                        handleChange("news_type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Geral</SelectItem>
                        <SelectItem value="defense">Defesa</SelectItem>
                        <SelectItem value="award">Prêmio</SelectItem>
                        <SelectItem value="publication">Publicação</SelectItem>
                        <SelectItem value="event">Evento</SelectItem>
                        <SelectItem value="grant">Edital</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="published_at">Data de Publicação</Label>
                    <Input
                      id="published_at"
                      type="date"
                      value={formData.published_at}
                      onChange={(e) =>
                        handleChange("published_at", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between pt-8">
                    <div>
                      <Label>Publicar</Label>
                      <p className="text-sm text-muted-foreground">
                        Tornar visível no site
                      </p>
                    </div>
                    <Switch
                      checked={formData.is_published}
                      onCheckedChange={(checked) =>
                        handleChange("is_published", checked)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Imagem de Capa</Label>
                  <ImageUploader
                    value={formData.cover_image_url || ""}
                    onChange={(url) =>
                      handleChange("cover_image_url", url || "")
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Excerpt */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="excerpt_pt">Resumo (PT)</Label>
                  <Textarea
                    id="excerpt_pt"
                    value={formData.excerpt_pt || ""}
                    onChange={(e) => handleChange("excerpt_pt", e.target.value)}
                    rows={3}
                    placeholder="Breve descrição que aparece na listagem"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt_en">Resumo (EN)</Label>
                  <Textarea
                    id="excerpt_en"
                    value={formData.excerpt_en || ""}
                    onChange={(e) => handleChange("excerpt_en", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content_pt">Conteúdo (PT)</Label>
                  <Textarea
                    id="content_pt"
                    value={formData.content_pt || ""}
                    onChange={(e) => handleChange("content_pt", e.target.value)}
                    rows={10}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content_en">Conteúdo (EN)</Label>
                  <Textarea
                    id="content_en"
                    value={formData.content_en || ""}
                    onChange={(e) => handleChange("content_en", e.target.value)}
                    rows={10}
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
                    {isNew ? "Criar Notícia" : "Salvar Alterações"}
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/news">Cancelar</Link>
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

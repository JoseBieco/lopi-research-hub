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
import { Switch } from "@/components/ui/switch";
import { AdminSidebar } from "@/components/admin-sidebar";
import { ImageUploader } from "@/components/image-uploader";
import { createClient } from "@/lib/supabase/client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditMemberPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name_pt: "",
    name_en: "",
    slug: "",
    role: "phd",
    current_role_pt: "",
    current_role_en: "",
    bio_pt: "",
    bio_en: "",
    email: "",
    photo_url: "",
    lattes_url: "",
    orcid_url: "",
    linkedin_url: "",
    github_url: "",
    website_url: "",
    scholar_url: "",
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    fetchMember();
  }, [id]);

  const fetchMember = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData(data);
      }
    } catch (err) {
      console.error("Error fetching member:", err);
      setError("Erro ao carregar membro");
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
      const { error } = await supabase
        .from("members")
        .update(formData)
        .eq("id", id);

      if (error) throw error;

      router.push("/admin/members");
    } catch (err) {
      console.error("Error updating member:", err);
      setError("Erro ao atualizar membro");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string | boolean | number) => {
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
              <Link href="/admin/members">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Editar Membro</h1>
              <p className="text-muted-foreground">
                Atualize as informações do membro
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
                <CardDescription>
                  Nome e identificação do membro
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name_pt">Nome (PT) *</Label>
                    <Input
                      id="name_pt"
                      value={formData.name_pt}
                      onChange={(e) => handleChange("name_pt", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name_en">Nome (EN)</Label>
                    <Input
                      id="name_en"
                      value={formData.name_en || ""}
                      onChange={(e) => handleChange("name_en", e.target.value)}
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
                    <Label htmlFor="role">Categoria *</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => handleChange("role", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professor">Docente</SelectItem>
                        <SelectItem value="postdoc">Pós-Doutorando</SelectItem>
                        <SelectItem value="phd">Doutorando</SelectItem>
                        <SelectItem value="masters">Mestrando</SelectItem>
                        <SelectItem value="undergrad">
                          Iniciação Científica
                        </SelectItem>
                        <SelectItem value="alumni">Egresso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_role_pt">Cargo Atual (PT)</Label>
                    <Input
                      id="current_role_pt"
                      value={formData.current_role_pt || ""}
                      onChange={(e) =>
                        handleChange("current_role_pt", e.target.value)
                      }
                      placeholder="Ex: Professor Associado"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current_role_en">Cargo Atual (EN)</Label>
                    <Input
                      id="current_role_en"
                      value={formData.current_role_en || ""}
                      onChange={(e) =>
                        handleChange("current_role_en", e.target.value)
                      }
                      placeholder="Ex: Associate Professor"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Foto</Label>
                  <ImageUploader
                    value={formData.photo_url || ""}
                    onChange={(url) => handleChange("photo_url", url || "")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Biography */}
            <Card>
              <CardHeader>
                <CardTitle>Biografia</CardTitle>
                <CardDescription>Descrição detalhada do membro</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio_pt">Biografia (PT)</Label>
                  <Textarea
                    id="bio_pt"
                    value={formData.bio_pt || ""}
                    onChange={(e) => handleChange("bio_pt", e.target.value)}
                    rows={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio_en">Biografia (EN)</Label>
                  <Textarea
                    id="bio_en"
                    value={formData.bio_en || ""}
                    onChange={(e) => handleChange("bio_en", e.target.value)}
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Links */}
            <Card>
              <CardHeader>
                <CardTitle>Links Externos</CardTitle>
                <CardDescription>
                  Perfis acadêmicos e redes sociais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lattes_url">Currículo Lattes</Label>
                    <Input
                      id="lattes_url"
                      type="url"
                      value={formData.lattes_url || ""}
                      onChange={(e) =>
                        handleChange("lattes_url", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orcid_url">ORCID</Label>
                    <Input
                      id="orcid_url"
                      type="url"
                      value={formData.orcid_url || ""}
                      onChange={(e) =>
                        handleChange("orcid_url", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scholar_url">Google Scholar</Label>
                    <Input
                      id="scholar_url"
                      type="url"
                      value={formData.scholar_url || ""}
                      onChange={(e) =>
                        handleChange("scholar_url", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url">LinkedIn</Label>
                    <Input
                      id="linkedin_url"
                      type="url"
                      value={formData.linkedin_url || ""}
                      onChange={(e) =>
                        handleChange("linkedin_url", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github_url">GitHub</Label>
                    <Input
                      id="github_url"
                      type="url"
                      value={formData.github_url || ""}
                      onChange={(e) =>
                        handleChange("github_url", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website_url">Website Pessoal</Label>
                    <Input
                      id="website_url"
                      type="url"
                      value={formData.website_url || ""}
                      onChange={(e) =>
                        handleChange("website_url", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Membro Ativo</Label>
                    <p className="text-sm text-muted-foreground">
                      Membros inativos não aparecem no site público
                    </p>
                  </div>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      handleChange("is_active", checked)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_order">Ordem de Exibição</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      handleChange(
                        "display_order",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="w-32"
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
                    Salvar Alterações
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/members">Cancelar</Link>
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from "lucide-react";
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
import { ImageUploader } from "@/components/image-uploader";
import { createClient } from "@/lib/supabase/client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditMemberPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

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
    if (!isNew) {
      fetchMember();
    }
  }, [id, isNew]);

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
      toast.error("Erro ao carregar os dados do membro.");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
  };

  const handleNameChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      name_pt: val,
      slug: isNew && !prev.slug ? generateSlug(val) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const supabase = createClient();
      if (isNew) {
        const { error } = await supabase.from("members").insert([formData]);
        if (error) throw error;
        toast.success("Membro criado com sucesso!");
      } else {
        const { error } = await supabase.from("members").update(formData).eq("id", id);
        if (error) throw error;
        toast.success("Membro atualizado com sucesso!");
      }
      router.push("/admin/members");
    } catch (err) {
      console.error("Error saving member:", err);
      toast.error("Erro ao salvar os dados do membro.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <Link href="/admin/dashboard" className="hover:text-blue-600 transition-colors">Admin</Link>
              <span>/</span>
              <Link href="/admin/members" className="hover:text-blue-600 transition-colors">Membros</Link>
              <span>/</span>
              <span className="text-slate-900 font-medium">{isNew ? "Novo" : "Editar"}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isNew ? "Adicionar Membro" : "Editar Membro"}
            </h1>
          </div>
          <Link
            href="/admin/members"
            className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Informações Pessoais */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg text-slate-800">Informações Pessoais</CardTitle>
              <CardDescription>Dados básicos do membro da equipe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              
              {/* Photo */}
              <div className="space-y-3">
                <Label>Foto de Perfil</Label>
                <div className="max-w-xs">
                  <ImageUploader
                    value={formData.photo_url}
                    onChange={(url) => handleChange("photo_url", url)}
                    
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name_pt">Nome Completo (PT) <span className="text-red-500">*</span></Label>
                  <Input
                    id="name_pt"
                    value={formData.name_pt}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="bg-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_en">Nome Completo (EN)</Label>
                  <Input
                    id="name_en"
                    value={formData.name_en}
                    onChange={(e) => handleChange("name_en", e.target.value)}
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL) <span className="text-red-500">*</span></Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleChange("slug", e.target.value)}
                    className="bg-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Acadêmico / Profissional</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="bg-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Atuação */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg text-slate-800">Atuação no Laboratório</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="role">Nível Acadêmico / Cargo <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleChange("role", value)}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professor">Professor(a)</SelectItem>
                      <SelectItem value="postdoc">Pós-Doutorando(a)</SelectItem>
                      <SelectItem value="phd">Doutorando(a)</SelectItem>
                      <SelectItem value="masters">Mestrando(a)</SelectItem>
                      <SelectItem value="undergrad">Iniciação Científica</SelectItem>
                      <SelectItem value="alumni">Alumni (Ex-membro)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_order">Ordem de Exibição</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => handleChange("display_order", parseInt(e.target.value) || 0)}
                    className="bg-white"
                  />
                  <p className="text-xs text-slate-500">Menores números aparecem primeiro.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="current_role_pt">Cargo Customizado (PT)</Label>
                  <Input
                    id="current_role_pt"
                    value={formData.current_role_pt}
                    onChange={(e) => handleChange("current_role_pt", e.target.value)}
                    placeholder="Ex: Pesquisador Visitante"
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current_role_en">Cargo Customizado (EN)</Label>
                  <Input
                    id="current_role_en"
                    value={formData.current_role_en}
                    onChange={(e) => handleChange("current_role_en", e.target.value)}
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="space-y-0.5">
                  <Label className="text-slate-800">Status do Membro</Label>
                  <p className="text-sm text-slate-500">
                    Defina se o membro está atualmente ativo no grupo.
                  </p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleChange("is_active", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Biografia */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg text-slate-800">Biografia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="bio_pt">Resumo Biográfico (PT)</Label>
                <Textarea
                  id="bio_pt"
                  value={formData.bio_pt}
                  onChange={(e) => handleChange("bio_pt", e.target.value)}
                  rows={5}
                  className="bg-white resize-y"
                  placeholder="Escreva sobre a formação, interesses e pesquisas..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio_en">Resumo Biográfico (EN)</Label>
                <Textarea
                  id="bio_en"
                  value={formData.bio_en}
                  onChange={(e) => handleChange("bio_en", e.target.value)}
                  rows={5}
                  className="bg-white resize-y"
                />
              </div>
            </CardContent>
          </Card>

          {/* Redes e Plataformas */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg text-slate-800">Links e Plataformas</CardTitle>
              <CardDescription>Perfis acadêmicos e redes sociais</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="lattes_url">Currículo Lattes</Label>
                <Input
                  id="lattes_url"
                  type="url"
                  value={formData.lattes_url}
                  onChange={(e) => handleChange("lattes_url", e.target.value)}
                  className="bg-white"
                  placeholder="http://lattes.cnpq.br/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orcid_url">ORCID</Label>
                <Input
                  id="orcid_url"
                  type="url"
                  value={formData.orcid_url}
                  onChange={(e) => handleChange("orcid_url", e.target.value)}
                  className="bg-white"
                  placeholder="https://orcid.org/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scholar_url">Google Scholar</Label>
                <Input
                  id="scholar_url"
                  type="url"
                  value={formData.scholar_url}
                  onChange={(e) => handleChange("scholar_url", e.target.value)}
                  className="bg-white"
                  placeholder="https://scholar.google.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub</Label>
                <Input
                  id="github_url"
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => handleChange("github_url", e.target.value)}
                  className="bg-white"
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn</Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => handleChange("linkedin_url", e.target.value)}
                  className="bg-white"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website_url">Website Pessoal</Label>
                <Input
                  id="website_url"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => handleChange("website_url", e.target.value)}
                  className="bg-white"
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <Link
              href="/admin/members"
              className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </Link>
            <Button 
              type="submit" 
              disabled={saving}
              className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {isNew ? "Criar Membro" : "Salvar Alterações"}
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

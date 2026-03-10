# Plataforma Acadêmica - Guia de Setup

Bem-vindo à plataforma de centralização da produção acadêmica do seu grupo de pesquisa!

## Pré-requisitos

- Node.js 18+
- pnpm (gerenciador de pacotes)
- Conta Supabase (configurada)

## Instalação

### 1. Instalar Dependências

```bash
pnpm install
```

### 2. Variáveis de Ambiente

As variáveis do Supabase devem estar configuradas:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Adicione-as no painel de Vars do v0 ou no seu `.env.local`.

### 3. Criar Tabelas no Banco de Dados

Acesse a rota de setup para criar as tabelas:

```
GET/POST http://localhost:3000/api/setup-db
```

Ou execute manualmente o arquivo SQL:
```bash
cat scripts/001_create_main_tables.sql | psql (via Supabase SQL Editor)
```

### 4. Criar Usuário Admin

No dashboard do Supabase, crie um usuário com:
- Email: seu-email@example.com
- Senha: segura

Depois, atualize o user metadata para marcar como admin:

```sql
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{is_admin}', 'true'::jsonb)
WHERE email = 'seu-email@example.com';
```

### 5. Popular com Dados de Exemplo

Após fazer login como admin, acesse:
```
POST /api/seed
```

Ou execute o script TypeScript:
```bash
npx tsx scripts/seed-data.ts
```

## Estrutura do Projeto

```
app/
├── [locale]/              # Rotas com i18n (pt, en)
│   ├── page.tsx          # Homepage
│   ├── about/            # Sobre o grupo
│   ├── team/             # Equipe
│   ├── projects/         # Projetos
│   ├── publications/     # Publicações
│   ├── tools/            # Ferramentas
│   └── news/             # Notícias
├── admin/
│   ├── login/            # Área de login admin
│   ├── dashboard/        # Dashboard principal
│   ├── members/          # CRUD membros
│   ├── projects/         # CRUD projetos
│   ├── publications/     # CRUD publicações
│   ├── tools/            # CRUD ferramentas
│   └── news/             # CRUD notícias
└── api/                  # APIs REST

lib/
├── supabase/             # Clients Supabase
│   ├── client.ts        # Cliente browser
│   ├── server.ts        # Cliente servidor
│   └── middleware.ts    # Middleware autenticação
└── db/
    └── schema.ts        # Schema do banco

messages/                 # Traduções i18n
├── pt.json
└── en.json

components/              # Componentes reutilizáveis
├── header.tsx
├── footer.tsx
└── member-card.tsx
```

## Funcionalidades Principais

### Páginas Públicas (Sem autenticação)
- **Home**: Visão geral com chamadas para ação
- **Sobre**: Missão, visão, linhas de pesquisa
- **Equipe**: Membros categorizados por cargo
- **Projetos**: Em andamento e concluídos
- **Publicações**: Com filtros por ano/tipo + BibTeX
- **Ferramentas**: Softwares desenvolvidos
- **Notícias**: Feed de acontecimentos

### Área Administrativa (Login obrigatório)
- **Dashboard**: Estatísticas e ações rápidas
- **CRUD Completo**: Membros, Projetos, Publicações, Ferramentas, Notícias
- **Autenticação**: Apenas usuários com `is_admin=true`

### Internacionalização
- Suporte completo para PT-BR e EN
- Rotas: `/pt/*` e `/en/*`
- Seletor de idioma no header

## Acessibilidade

- ✅ Skip to main content link
- ✅ Hierarquia semântica (h1, h2, etc)
- ✅ Aria-labels em botões de ícones
- ✅ Contraste adequado (WCAG AA)
- ✅ Navegação por teclado total

## SEO

- Metadata otimizado em cada página
- Schema.org estruturado
- Open Graph para compartilhamento
- Robots.txt e sitemap
- Next.js dinâmico para melhor indexação

## Próximos Passos

1. **Customizar dados**: Atualize a descrição do grupo, objetivos, etc
2. **Adicionar membros**: Vá para `/admin/dashboard` e crie membros
3. **Publicar publicações**: Adicione seus artigos com metadados
4. **Configurar SSL**: Recomendado para produção
5. **Deploy**: Use Vercel (recomendado) ou seu host

## Troubleshooting

### "Unauthorized" no admin
- Verifique se seu usuário tem `is_admin=true` no Supabase
- Tente fazer logout e login novamente

### Dados não aparecem nas páginas públicas
- Verifique se os dados estão marcados como ativos (`is_active=true`)
- Confira o RLS policies no Supabase

### Erro de autenticação
- Confirme se as variáveis de ambiente estão corretas
- Verifique o token no Supabase Auth

## Suporte

Para mais informações, consulte:
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

## Licença

MIT

---

**Desenvolvido com v0 by Vercel**

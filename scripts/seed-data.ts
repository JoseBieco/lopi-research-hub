/**
 * Script para popular o banco de dados com dados de exemplo
 * Execute: uv run scripts/seed-data.ts
 * Ou: npx tsx scripts/seed-data.ts
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing env variables')
  process.exit(1)
}

// Dados de exemplo
export const sampleData = {
  members: [
    {
      slug: 'dr-carlos-silva',
      name_pt: 'Dr. Carlos Silva',
      name_en: 'Dr. Carlos Silva',
      role: 'professor',
      bio_pt:
        'Professor com expertise em otimização e métodos numéricos. Líder do grupo de pesquisa.',
      bio_en:
        'Professor with expertise in optimization and numerical methods. Research group leader.',
      email: 'carlos.silva@example.com',
      lattes_url: 'https://lattes.cnpq.br/example1',
      linkedin_url: 'https://linkedin.com/in/carlos-silva',
      github_url: 'https://github.com/carlos-silva',
      scholar_url: 'https://scholar.google.com/citations?user=example1',
      display_order: 1,
      is_active: true,
    },
    {
      slug: 'maria-oliveira',
      name_pt: 'Dra. Maria Oliveira',
      name_en: 'Dr. Maria Oliveira',
      role: 'postdoc',
      bio_pt: 'Pesquisadora em reconstrução de imagens e problemas inversos.',
      bio_en: 'Researcher in image reconstruction and inverse problems.',
      email: 'maria.oliveira@example.com',
      lattes_url: 'https://lattes.cnpq.br/example2',
      display_order: 2,
      is_active: true,
    },
    {
      slug: 'joao-santos',
      name_pt: 'João Santos',
      role: 'phd',
      bio_pt: 'Doutorando em otimização convexa.',
      email: 'joao.santos@example.com',
      display_order: 3,
      is_active: true,
    },
  ],

  research_areas: [
    {
      slug: 'otimizacao',
      name_pt: 'Otimização',
      name_en: 'Optimization',
      description_pt:
        'Desenvolvimento de algoritmos para problemas de otimização contínua e discreta.',
      description_en: 'Development of algorithms for continuous and discrete optimization problems.',
      icon: '🎯',
      display_order: 1,
    },
    {
      slug: 'problemas-inversos',
      name_pt: 'Problemas Inversos',
      name_en: 'Inverse Problems',
      description_pt: 'Metodologias para resolver problemas inversos mal-postos.',
      description_en: 'Methodologies for solving ill-posed inverse problems.',
      icon: '🔍',
      display_order: 2,
    },
    {
      slug: 'reconstrucao-imagens',
      name_pt: 'Reconstrução de Imagens',
      name_en: 'Image Reconstruction',
      description_pt: 'Técnicas avançadas para reconstrução de imagens médicas e científicas.',
      description_en: 'Advanced techniques for medical and scientific image reconstruction.',
      icon: '🖼️',
      display_order: 3,
    },
  ],

  projects: [
    {
      slug: 'projeto-otimizacao-gpu',
      title_pt: 'Otimização em GPU para Processamento em Larga Escala',
      title_en: 'GPU Optimization for Large-Scale Processing',
      description_pt:
        'Desenvolvimento de algoritmos paralelos para otimização em unidades de processamento gráfico.',
      description_en:
        'Development of parallel algorithms for optimization on graphics processing units.',
      status: 'in_progress',
      funding_agency: 'CNPq',
      start_date: new Date('2023-01-15'),
      end_date: new Date('2025-12-31'),
    },
    {
      slug: 'reconstrucao-tomografia',
      title_pt: 'Métodos Numéricos para Tomografia Computadorizada',
      title_en: 'Numerical Methods for Computed Tomography',
      description_pt:
        'Pesquisa em métodos regularizados para reconstrução de imagens tomográficas.',
      description_en:
        'Research on regularized methods for tomographic image reconstruction.',
      status: 'completed',
      funding_agency: 'FAPESP',
      start_date: new Date('2020-06-01'),
      end_date: new Date('2022-05-31'),
    },
  ],

  publications: [
    {
      title:
        'Fast algorithms for image reconstruction using proximal methods and applications to tomography',
      publication_type: 'journal',
      venue: 'Journal of Computational and Applied Mathematics',
      year: 2024,
      abstract_pt:
        'Este artigo apresenta algoritmos eficientes para problemas de reconstrução de imagens baseados em métodos proximais.',
      abstract_en:
        'This paper presents efficient algorithms for image reconstruction problems based on proximal methods.',
      doi: '10.1016/j.cam.2024.001234',
      bibtex: `@article{silva2024fast,
  title={Fast algorithms for image reconstruction},
  author={Silva, C. and Oliveira, M.},
  journal={Journal of Computational and Applied Mathematics},
  volume={442},
  pages={115700},
  year={2024}
}`,
    },
    {
      title: 'Convex optimization techniques for large-scale machine learning',
      publication_type: 'conference',
      venue: 'International Conference on Machine Learning 2024',
      year: 2024,
      abstract_pt: 'Estudo de técnicas de otimização convexa para aplicações em aprendizado de máquina.',
      abstract_en:
        'Study of convex optimization techniques for machine learning applications.',
      doi: '10.1145/example2024',
    },
  ],

  tools: [
    {
      slug: 'pyotim',
      name: 'PyOtim',
      description_pt: 'Biblioteca Python para otimização numérica com suporte a GPU.',
      description_en: 'Python library for numerical optimization with GPU support.',
      tool_url: 'https://pypi.org/project/pyotim',
      github_url: 'https://github.com/research-group/pyotim',
      docs_url: 'https://pyotim.readthedocs.io',
      is_featured: true,
    },
    {
      slug: 'tomrecon',
      name: 'TomRecon',
      description_pt: 'Software para reconstrução de imagens tomográficas.',
      description_en: 'Software for tomographic image reconstruction.',
      tool_url: 'https://example.com/tomrecon',
      github_url: 'https://github.com/research-group/tomrecon',
      is_featured: true,
    },
  ],

  news: [
    {
      slug: 'defesa-joao-2024',
      title_pt: 'Qualificação de Doutorado de João Santos',
      title_en: 'PhD Qualifying Exam - João Santos',
      content_pt: 'João Santos realizou com sucesso sua qualificação de doutorado em 15 de janeiro de 2024.',
      content_en: 'João Santos successfully completed his PhD qualifying exam on January 15, 2024.',
      news_type: 'defense',
      published_at: new Date('2024-01-15'),
      is_published: true,
    },
    {
      slug: 'publicacao-destaque-2024',
      title_pt: 'Novo artigo publicado em periódico de alto impacto',
      title_en: 'New paper published in high-impact journal',
      content_pt:
        'O artigo "Fast algorithms for image reconstruction" foi aceito para publicação no Journal of Computational and Applied Mathematics em janeiro de 2024.',
      content_en:
        'The paper "Fast algorithms for image reconstruction" was accepted for publication in the Journal of Computational and Applied Mathematics in January 2024.',
      news_type: 'publication',
      published_at: new Date('2024-01-10'),
      is_published: true,
    },
  ],
}

async function seedDatabase() {
  console.log('🌱 Iniciando população do banco de dados...\n')

  try {
    // Insert members
    console.log('📝 Inserindo membros...')
    const membersRes = await fetch(`${supabaseUrl}/rest/v1/members`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        apikey: supabaseServiceKey,
      },
      body: JSON.stringify(sampleData.members),
    })

    if (!membersRes.ok) {
      console.log(`⚠️  Membros: Status ${membersRes.status}`)
    } else {
      console.log('✅ Membros inseridos')
    }

    // Insert research areas
    console.log('📝 Inserindo linhas de pesquisa...')
    const areasRes = await fetch(`${supabaseUrl}/rest/v1/research_areas`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        apikey: supabaseServiceKey,
      },
      body: JSON.stringify(sampleData.research_areas),
    })

    if (!areasRes.ok) {
      console.log(`⚠️  Research Areas: Status ${areasRes.status}`)
    } else {
      console.log('✅ Linhas de pesquisa inseridas')
    }

    // Insert projects
    console.log('📝 Inserindo projetos...')
    const projectsRes = await fetch(`${supabaseUrl}/rest/v1/projects`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        apikey: supabaseServiceKey,
      },
      body: JSON.stringify(
        sampleData.projects.map((p) => ({
          ...p,
          start_date: p.start_date?.toISOString().split('T')[0],
          end_date: p.end_date?.toISOString().split('T')[0],
        }))
      ),
    })

    if (!projectsRes.ok) {
      console.log(`⚠️  Projetos: Status ${projectsRes.status}`)
    } else {
      console.log('✅ Projetos inseridos')
    }

    // Insert publications
    console.log('📝 Inserindo publicações...')
    const pubRes = await fetch(`${supabaseUrl}/rest/v1/publications`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        apikey: supabaseServiceKey,
      },
      body: JSON.stringify(sampleData.publications),
    })

    if (!pubRes.ok) {
      console.log(`⚠️  Publicações: Status ${pubRes.status}`)
    } else {
      console.log('✅ Publicações inseridas')
    }

    // Insert tools
    console.log('📝 Inserindo ferramentas...')
    const toolsRes = await fetch(`${supabaseUrl}/rest/v1/tools`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        apikey: supabaseServiceKey,
      },
      body: JSON.stringify(sampleData.tools),
    })

    if (!toolsRes.ok) {
      console.log(`⚠️  Ferramentas: Status ${toolsRes.status}`)
    } else {
      console.log('✅ Ferramentas inseridas')
    }

    // Insert news
    console.log('📝 Inserindo notícias...')
    const newsRes = await fetch(`${supabaseUrl}/rest/v1/news`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        apikey: supabaseServiceKey,
      },
      body: JSON.stringify(
        sampleData.news.map((n) => ({
          ...n,
          published_at: n.published_at?.toISOString(),
        }))
      ),
    })

    if (!newsRes.ok) {
      console.log(`⚠️  Notícias: Status ${newsRes.status}`)
    } else {
      console.log('✅ Notícias inseridas')
    }

    console.log('\n✅ Banco de dados populado com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao popular banco:', error)
    process.exit(1)
  }
}

seedDatabase()

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Plataforma Acadêmica | Grupo de Pesquisa',
  description: 'Centralizamos a produção acadêmica e as ferramentas do nosso grupo de pesquisa. Publicações, projetos, equipe e ferramentas.',
  keywords: ['pesquisa', 'grupo de pesquisa', 'publicações', 'projetos', 'ferramentas'],
  openGraph: {
    title: 'Plataforma Acadêmica | Grupo de Pesquisa',
    description: 'Centralizamos a produção acadêmica e as ferramentas do nosso grupo de pesquisa',
    type: 'website',
  },
}

export default function Home() {
  const t = useTranslations()

  return (
    <main id="main-content" className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            {t('home.title')}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl">
            {t('home.hero_text')}
          </p>
          <nav className="flex flex-wrap gap-4">
            <Link
              href="/team"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {t('common.team')}
            </Link>
            <Link
              href="/projects"
              className="inline-block bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {t('common.projects')}
            </Link>
            <Link
              href="/publications"
              className="inline-block bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {t('common.publications')}
            </Link>
          </nav>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-slate-900">
            Explore o Grupo de Pesquisa
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <article className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4 text-slate-900">Equipe</h3>
              <p className="text-slate-600 mb-4">
                Conheça os membros do grupo, desde docentes até alunos de iniciação científica.
              </p>
              <Link href="/team" className="text-blue-600 hover:text-blue-700 font-medium">
                Ver equipe →
              </Link>
            </article>

            {/* Card 2 */}
            <article className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4 text-slate-900">Publicações</h3>
              <p className="text-slate-600 mb-4">
                Acesse artigos em periódicos, conferências e capítulos de livros publicados pelo grupo.
              </p>
              <Link
                href="/publications"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Ver publicações →
              </Link>
            </article>

            {/* Card 3 */}
            <article className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4 text-slate-900">Ferramentas</h3>
              <p className="text-slate-600 mb-4">
                Explore as plataformas e softwares open-source desenvolvidos pelo grupo.
              </p>
              <Link href="/tools" className="text-blue-600 hover:text-blue-700 font-medium">
                Ver ferramentas →
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Últimas Notícias</h2>
          <p className="text-lg mb-8">
            Acompanhe os últimos acontecimentos do grupo: defesas, prêmios e publicações destaque.
          </p>
          <Link
            href="/news"
            className="inline-block bg-white text-blue-600 hover:bg-slate-100 px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Ver notícias
          </Link>
        </div>
      </section>
    </main>
  )
}

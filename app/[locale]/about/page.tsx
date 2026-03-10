import { useTranslations } from 'next-intl'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre o Grupo de Pesquisa | Plataforma Acadêmica',
  description: 'Conheça a missão, visão, valores e linhas de pesquisa do nosso grupo. Otimização, problemas inversos, reconstrução de imagens.',
  keywords: ['sobre', 'grupo de pesquisa', 'pesquisa', 'otimização', 'problemas inversos'],
  openGraph: {
    title: 'Sobre o Grupo de Pesquisa',
    description: 'Conheça a missão, visão e linhas de pesquisa do nosso grupo',
    type: 'website',
  },
}

export default function AboutPage() {
  const t = useTranslations()

  return (
    <main id="main-content" className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
            Sobre o Grupo de Pesquisa
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Somos um grupo dedicado à pesquisa de excelência em diversas áreas da computação científica e otimização.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <article className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-slate-900">Nossa Missão</h2>
              <p className="text-slate-600 mb-4">
                Desenvolvemos pesquisas de ponta que contribuem para o avanço científico em otimização,
                reconstrução de imagens e problemas inversos.
              </p>
              <p className="text-slate-600">
                Buscamos aplicar nossos conhecimentos para resolver problemas reais em colaboração com indústria
                e outros grupos de pesquisa.
              </p>
            </article>

            <article className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-slate-900">Nossa Visão</h2>
              <p className="text-slate-600 mb-4">
                Ser reconhecido como um centro de excelência em pesquisa que desenvolve soluções inovadoras
                para problemas científicos complexos.
              </p>
              <p className="text-slate-600">
                Formar pesquisadores qualificados capazes de contribuir para o desenvolvimento científico
                e tecnológico.
              </p>
            </article>

            <article className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-slate-900">Valores</h2>
              <ul className="text-slate-600 space-y-2">
                <li>✓ Excelência científica</li>
                <li>✓ Inovação e criatividade</li>
                <li>✓ Colaboração e interdisciplinaridade</li>
                <li>✓ Integridade na pesquisa</li>
                <li>✓ Transferência de conhecimento</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-slate-900">Linhas de Pesquisa</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <article className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-slate-900">Otimização</h3>
              <p className="text-slate-600">
                Desenvolvemos algoritmos avançados para resolver problemas de otimização contínua e discreta,
                com aplicações em machine learning, processamento de sinais e engenharia.
              </p>
            </article>

            <article className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-slate-900">Problemas Inversos</h3>
              <p className="text-slate-600">
                Estudamos metodologias para solucionar problemas inversos, com ênfase em regularização
                e estabilidade numérica para aplicações em tomografia e imageamento.
              </p>
            </article>

            <article className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-slate-900">Reconstrução de Imagens</h3>
              <p className="text-slate-600">
                Aplicamos técnicas de otimização e análise numérica para desenvolver métodos eficientes
                de reconstrução de imagens médicas e científicas.
              </p>
            </article>

            <article className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-slate-900">Análise Numérica</h3>
              <p className="text-slate-600">
                Investigamos propriedades de convergência e estabilidade de algoritmos numéricos para
                sistemas complexos e de grande escala.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* History/Highlights */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-slate-900">Destaques</h2>

          <div className="space-y-8">
            <article className="border-l-4 border-blue-600 pl-8 py-4">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Reconhecimento Nacional</h3>
              <p className="text-slate-600">
                Nossos trabalhos são regularmente publicados em periódicos de alta relevância e apresentados
                em conferências internacionais.
              </p>
            </article>

            <article className="border-l-4 border-blue-600 pl-8 py-4">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Colaborações Internacionais</h3>
              <p className="text-slate-600">
                Mantemos parcerias com grupos de pesquisa em universidades renomadas do Brasil e do exterior.
              </p>
            </article>

            <article className="border-l-4 border-blue-600 pl-8 py-4">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Software Livre</h3>
              <p className="text-slate-600">
                Desenvolvemos e compartilhamos ferramentas open-source que são utilizadas pela comunidade científica.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}

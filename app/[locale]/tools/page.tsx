import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  const supabase = await createClient()
  const { data: toolsData } = await supabase
    .from('tools')
    .select("id, name, description_pt, description_en, is_featured, image_url, tool_url, github_url, docs_url, created_at")
    .order('created_at', { ascending: false })

  const tools = toolsData || []

  const featured = tools.filter((t: any) => t.is_featured)
  const others = tools.filter((t: any) => !t.is_featured)

  const getDescription = (tool: any) => locale === 'en' && tool.description_en ? tool.description_en : tool.description_pt

  return (
    <main id="main-content" className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            {t('tools.title')}
          </h1>
          <p className="text-lg text-slate-600">
            {t('tools.subtitle')}
          </p>
        </div>
      </section>

      {/* Featured Tools */}
      {featured.length > 0 && (
        <section className="py-12 md:py-16 bg-yellow-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-slate-900">⭐ Destaque</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featured.map((tool: any) => (
                <article
                  key={tool.id}
                  className="bg-white rounded-lg shadow-lg p-8 border-2 border-yellow-400"
                >
                  {tool.image_url && (
                    <div className="relative w-full h-48 mb-4">
                      <Image
                        src={tool.image_url}
                        alt={tool.name}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{tool.name}</h3>
                  <p className="text-slate-600 mb-4">{getDescription(tool)}</p>

                  <div className="flex flex-wrap gap-3 pt-4 border-t">
                    {tool.tool_url && (
                      <a
                        href={tool.tool_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
                      >
                        {t('tools.access')}
                      </a>
                    )}
                    {tool.github_url && (
                      <a
                        href={tool.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-800 font-medium"
                      >
                        {t('tools.github')}
                      </a>
                    )}
                    {tool.docs_url && (
                      <a
                        href={tool.docs_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 font-medium"
                      >
                        {t('tools.documentation')}
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Tools */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {tools.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <p className="text-slate-600 mb-4">Nenhuma ferramenta disponível no momento.</p>
              <Link href="/admin/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Ir para Administração
              </Link>
            </div>
          ) : (
            <>
              {others.length > 0 && (
                <>
                  <h2 className="text-3xl font-bold mb-8 text-slate-900">
                    Todas as Ferramentas
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {others.map((tool: any) => (
                      <article
                        key={tool.id}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                      >
                        {tool.image_url && (
                          <div className="relative w-full h-32 mb-4">
                            <Image
                              src={tool.image_url}
                              alt={tool.name}
                              fill
                              className="object-cover rounded-lg"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                        )}
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{tool.name}</h3>
                        <p className="text-slate-600 text-sm mb-4">{getDescription(tool)}</p>

                        <div className="flex gap-2">
                          {tool.tool_url && (
                            <a
                              href={tool.tool_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              {t('tools.access')}
                            </a>
                          )}
                          {tool.github_url && (
                            <a
                              href={tool.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              {t('tools.github')}
                            </a>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}

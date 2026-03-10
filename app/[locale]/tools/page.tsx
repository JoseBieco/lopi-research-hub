'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

export default function ToolsPage() {
  const t = useTranslations()
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTools()
  }, [])

  const fetchTools = async () => {
    try {
      const response = await fetch('/api/tools')
      if (response.ok) {
        const data = await response.json()
        setTools(data)
      }
    } catch (error) {
      console.error('Error fetching tools:', error)
    } finally {
      setLoading(false)
    }
  }

  const featured = tools.filter((t: any) => t.is_featured)
  const others = tools.filter((t: any) => !t.is_featured)

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
                    <img
                      src={tool.image_url}
                      alt={tool.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{tool.name}</h3>
                  <p className="text-slate-600 mb-4">{tool.description_pt}</p>

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
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Carregando ferramentas...</p>
            </div>
          ) : tools.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <p className="text-slate-600 mb-4">Nenhuma ferramenta disponível.</p>
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
                          <img
                            src={tool.image_url}
                            alt={tool.name}
                            className="w-full h-32 object-cover rounded-lg mb-4"
                          />
                        )}
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{tool.name}</h3>
                        <p className="text-slate-600 text-sm mb-4">{tool.description_pt}</p>

                        <div className="flex gap-2">
                          {tool.tool_url && (
                            <a
                              href={tool.tool_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Acessar
                            </a>
                          )}
                          {tool.github_url && (
                            <a
                              href={tool.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              GitHub
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

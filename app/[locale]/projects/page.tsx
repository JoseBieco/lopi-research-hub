'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

export default function ProjectsPage() {
  const t = useTranslations()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const inProgress = projects.filter((p: any) => p.status === 'in_progress')
  const completed = projects.filter((p: any) => p.status === 'completed')

  return (
    <main id="main-content" className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            {t('projects.title')}
          </h1>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Carregando projetos...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <p className="text-slate-600 mb-4">Nenhum projeto disponível no momento.</p>
              <a href="/admin/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Ir para Administração
              </a>
            </div>
          ) : (
            <>
              {inProgress.length > 0 && (
                <section className="mb-16">
                  <h2 className="text-3xl font-bold mb-8 text-slate-900">
                    {t('projects.in_progress')}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    {inProgress.map((project: any) => (
                      <article
                        key={project.id}
                        className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow"
                      >
                        <h3 className="text-2xl font-bold mb-4 text-slate-900">
                          {project.title_pt}
                        </h3>
                        {project.description_pt && (
                          <p className="text-slate-600 mb-4">{project.description_pt}</p>
                        )}
                        {project.funding_agency && (
                          <p className="text-sm text-slate-500">
                            <strong>{t('projects.funding_agency')}:</strong> {project.funding_agency}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {completed.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-8 text-slate-900">
                    {t('projects.completed')}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    {completed.map((project: any) => (
                      <article
                        key={project.id}
                        className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow opacity-75"
                      >
                        <h3 className="text-2xl font-bold mb-4 text-slate-900">
                          {project.title_pt}
                        </h3>
                        {project.description_pt && (
                          <p className="text-slate-600 mb-4">{project.description_pt}</p>
                        )}
                        {project.funding_agency && (
                          <p className="text-sm text-slate-500">
                            <strong>{t('projects.funding_agency')}:</strong> {project.funding_agency}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}

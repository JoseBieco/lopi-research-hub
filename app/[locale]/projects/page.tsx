import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  const supabase = await createClient()
  const { data: projectsData } = await supabase
    .from('projects')
    .select("id, title_pt, title_en, description_pt, description_en, status, funding_agency, start_date")
    .order('start_date', { ascending: false })

  const projects = projectsData || []

  const inProgress = projects.filter((p: any) => p.status === 'in_progress')
  const completed = projects.filter((p: any) => p.status === 'completed')

  const getTitle = (project: any) => locale === 'en' && project.title_en ? project.title_en : project.title_pt
  const getDescription = (project: any) => locale === 'en' && project.description_en ? project.description_en : project.description_pt

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
          {projects.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <p className="text-slate-600 mb-4">Nenhum projeto disponível no momento.</p>
              <Link href="/admin/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Ir para Administração
              </Link>
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
                          {getTitle(project)}
                        </h3>
                        {getDescription(project) && (
                          <p className="text-slate-600 mb-4">{getDescription(project)}</p>
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
                          {getTitle(project)}
                        </h3>
                        {getDescription(project) && (
                          <p className="text-slate-600 mb-4">{getDescription(project)}</p>
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

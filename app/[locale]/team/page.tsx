import { getTranslations } from 'next-intl/server'
import { MemberCard } from '@/components/member-card'
import type { MemberProps } from '@/components/member-card'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  // Fetch members from Supabase directly via Server Component
  const supabase = await createClient()
  const { data: membersData } = await supabase
    .from('members')
    .select("id, slug, name_pt, name_en, role, photo_url, email, lattes_url, linkedin_url, github_url, orcid_url, scholar_url, display_order")
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('name_pt', { ascending: true })

  const members: MemberProps[] = (membersData || []).map((m: any) => ({
    ...m,
    locale: locale as 'pt' | 'en',
  }))

  const roleLabels = {
    professor: t('team.professors'),
    postdoc: t('team.postdocs'),
    phd: t('team.phd_students'),
    masters: t('team.masters_students'),
    undergrad: t('team.undergrad_students'),
    alumni: t('team.alumni'),
  }

  const roles: Array<keyof typeof roleLabels> = [
    'professor',
    'postdoc',
    'phd',
    'masters',
    'undergrad',
    'alumni',
  ]

  const groupedMembers = roles.reduce(
    (acc, role) => {
      acc[role] = members.filter((m) => m.role === role)
      return acc
    },
    {} as Record<string, MemberProps[]>
  )

  return (
    <main id="main-content" className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            {t('team.title')}
          </h1>
          <p className="text-lg text-slate-600">
            {t('team.subtitle')}
          </p>
        </div>
      </section>

      {/* Members by Role */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {members.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <p className="text-slate-600 mb-4">
                A equipe ainda não foi adicionada. Use o painel administrativo para adicionar membros.
              </p>
              <Link href="/admin/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Ir para Administração
              </Link>
            </div>
          ) : (
            <>
              {roles.map((role) => {
                const roleMembersCount = groupedMembers[role].length
                if (roleMembersCount === 0) return null

                return (
                  <section key={role} className="mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-slate-900">
                      {roleLabels[role]}
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {groupedMembers[role].map((member) => (
                        <MemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  </section>
                )
              })}
            </>
          )}
        </div>
      </section>
    </main>
  )
}

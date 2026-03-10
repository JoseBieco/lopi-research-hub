'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { MemberCard } from '@/components/member-card'
import type { MemberProps } from '@/components/member-card'

export default function TeamPage() {
  const t = useTranslations()
  const [members, setMembers] = useState<MemberProps[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  useEffect(() => {
    // Fetch members from Supabase
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members')
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      }
    } catch (error) {
      console.error('Error fetching members:', error)
      // For now, show empty state
      setMembers([])
    } finally {
      setLoading(false)
    }
  }

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
      acc[role] = members.filter((m) => m.role === role && m.is_active !== false)
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
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Carregando membros...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <p className="text-slate-600 mb-4">
                A equipe ainda não foi adicionada. Use o painel administrativo para adicionar membros.
              </p>
              <a href="/admin/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Ir para Administração
              </a>
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

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Github, Linkedin, GraduationCap, BookUser } from 'lucide-react'

const OrcidIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z"/>
  </svg>
)

export interface MemberProps {
  id: string
  slug: string
  name_pt: string
  name_en?: string
  role: 'professor' | 'postdoc' | 'phd' | 'masters' | 'undergrad' | 'alumni'
  photo_url?: string
  email?: string
  lattes_url?: string
  linkedin_url?: string
  github_url?: string
  orcid_url?: string
  scholar_url?: string
  locale?: 'pt' | 'en'
}

export function MemberCard({ member }: { member: MemberProps }) {
  const t = useTranslations('team')
  
  const roleLabels = {
    professor: t('professors'),
    postdoc: t('postdocs'),
    phd: t('phd_students'),
    masters: t('masters_students'),
    undergrad: t('undergrad_students'),
    alumni: t('alumni'),
  }

  const name = member.locale === 'en' && member.name_en ? member.name_en : member.name_pt

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Member Photo */}
      <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center relative overflow-hidden">
        {member.photo_url ? (
          <Image
            src={member.photo_url}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="text-4xl text-slate-400">👤</div>
        )}
      </div>

      {/* Member Info */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          <Link href={`/team/${member.slug}`} className="hover:text-indigo-600">
            {name}
          </Link>
        </h3>
        <p className="text-sm text-indigo-600 font-medium mb-3">{roleLabels[member.role] || member.role}</p>

        {member.email && (
          <p className="text-sm text-slate-600 mb-3">
            <a href={`mailto:${member.email}`} className="hover:text-indigo-600">
              {member.email}
            </a>
          </p>
        )}

        {/* Social Links */}
        {(member.lattes_url ||
          member.linkedin_url ||
          member.github_url ||
          member.orcid_url ||
          member.scholar_url) && (
          <div className="flex gap-4 pt-4 border-t mt-4">
            {member.lattes_url && (
              <a
                href={member.lattes_url}
                target="_blank"
                rel="noopener noreferrer"
                title="Lattes"
                className="text-slate-400 hover:text-indigo-600 transition-colors"
              >
                <BookUser className="w-5 h-5" />
              </a>
            )}
            {member.linkedin_url && (
              <a
                href={member.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="text-slate-400 hover:text-indigo-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {member.github_url && (
              <a
                href={member.github_url}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className="text-slate-400 hover:text-slate-900 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {member.orcid_url && (
              <a
                href={member.orcid_url}
                target="_blank"
                rel="noopener noreferrer"
                title="ORCID"
                className="text-slate-400 hover:text-green-600 transition-colors"
              >
                <OrcidIcon className="w-5 h-5" />
              </a>
            )}
            {member.scholar_url && (
              <a
                href={member.scholar_url}
                target="_blank"
                rel="noopener noreferrer"
                title="Google Scholar"
                className="text-slate-400 hover:text-indigo-500 transition-colors"
              >
                <GraduationCap className="w-5 h-5" />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}


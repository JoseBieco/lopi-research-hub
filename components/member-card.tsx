import Link from 'next/link'

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
  const roleLabels = {
    professor: 'Professor',
    postdoc: 'Pós-Doutorando',
    phd: 'Doutorando',
    masters: 'Mestrando',
    undergrad: 'Iniciação Científica',
    alumni: 'Alumni',
  }

  const name = member.locale === 'en' ? member.name_en || member.name_pt : member.name_pt

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Member Photo */}
      <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
        {member.photo_url ? (
          <img
            src={member.photo_url}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-4xl text-slate-400">👤</div>
        )}
      </div>

      {/* Member Info */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          <Link href={`/team/${member.slug}`} className="hover:text-blue-600">
            {name}
          </Link>
        </h3>
        <p className="text-sm text-blue-600 font-medium mb-3">{roleLabels[member.role]}</p>

        {member.email && (
          <p className="text-sm text-slate-600 mb-3">
            <a href={`mailto:${member.email}`} className="hover:text-blue-600">
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
          <div className="flex gap-3 pt-3 border-t">
            {member.lattes_url && (
              <a
                href={member.lattes_url}
                target="_blank"
                rel="noopener noreferrer"
                title="Lattes"
                className="text-slate-600 hover:text-blue-600"
              >
                L
              </a>
            )}
            {member.linkedin_url && (
              <a
                href={member.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="text-slate-600 hover:text-blue-600"
              >
                in
              </a>
            )}
            {member.github_url && (
              <a
                href={member.github_url}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className="text-slate-600 hover:text-blue-600"
              >
                GH
              </a>
            )}
            {member.orcid_url && (
              <a
                href={member.orcid_url}
                target="_blank"
                rel="noopener noreferrer"
                title="ORCID"
                className="text-slate-600 hover:text-blue-600"
              >
                O
              </a>
            )}
            {member.scholar_url && (
              <a
                href={member.scholar_url}
                target="_blank"
                rel="noopener noreferrer"
                title="Google Scholar"
                className="text-slate-600 hover:text-blue-600"
              >
                GS
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

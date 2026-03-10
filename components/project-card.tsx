'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, Users, Building2, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface ProjectProps {
  id: string
  slug: string
  title_pt: string
  title_en: string
  description_pt?: string
  description_en?: string
  status: 'active' | 'completed'
  funding_agency?: string
  start_date?: string
  end_date?: string
  members_count?: number
}

interface ProjectCardProps {
  project: ProjectProps
}

export function ProjectCard({ project }: ProjectCardProps) {
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'pt'

  const title = locale === 'en' ? project.title_en : project.title_pt
  const description = locale === 'en' ? project.description_en : project.description_pt

  const statusConfig = {
    active: {
      label: locale === 'en' ? 'In Progress' : 'Em Andamento',
      className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    completed: {
      label: locale === 'en' ? 'Completed' : 'Concluído',
      className: 'bg-slate-100 text-slate-700 border-slate-200',
    },
  }

  const { label, className } = statusConfig[project.status]

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'pt-BR', {
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg leading-tight line-clamp-2">
            {title || 'Sem título'}
          </CardTitle>
          <Badge variant="outline" className={className}>
            {label}
          </Badge>
        </div>
        {description && (
          <CardDescription className="line-clamp-3 mt-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2 text-sm text-muted-foreground">
          {project.funding_agency && (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{project.funding_agency}</span>
            </div>
          )}
          
          {(project.start_date || project.end_date) && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>
                {project.start_date && formatDate(project.start_date)}
                {project.start_date && project.end_date && ' - '}
                {project.end_date && formatDate(project.end_date)}
                {project.start_date && !project.end_date && ' - ' + (locale === 'en' ? 'Present' : 'Atual')}
              </span>
            </div>
          )}

          {project.members_count && project.members_count > 0 && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 flex-shrink-0" />
              <span>
                {project.members_count} {locale === 'en' ? 'members' : 'membros'}
              </span>
            </div>
          )}
        </div>

        <Button variant="ghost" className="w-full justify-between group-hover:bg-accent" asChild>
          <Link href={`/${locale}/projects/${project.slug}`}>
            {locale === 'en' ? 'View details' : 'Ver detalhes'}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

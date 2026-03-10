'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { FileText, ExternalLink, Copy, Check, BookOpen, GraduationCap, Presentation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export interface PublicationProps {
  id: string
  title: string
  authors: string
  year: number
  type: 'journal' | 'conference' | 'book_chapter' | 'thesis'
  venue?: string
  doi?: string
  pdf_url?: string
  bibtex?: string
}

interface PublicationItemProps {
  publication: PublicationProps
}

export function PublicationItem({ publication }: PublicationItemProps) {
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'pt'
  const [copied, setCopied] = useState(false)

  const typeConfig = {
    journal: {
      label: locale === 'en' ? 'Journal' : 'Periódico',
      icon: BookOpen,
      className: 'bg-blue-100 text-blue-800',
    },
    conference: {
      label: locale === 'en' ? 'Conference' : 'Conferência',
      icon: Presentation,
      className: 'bg-purple-100 text-purple-800',
    },
    book_chapter: {
      label: locale === 'en' ? 'Book Chapter' : 'Capítulo',
      icon: FileText,
      className: 'bg-amber-100 text-amber-800',
    },
    thesis: {
      label: locale === 'en' ? 'Thesis' : 'Tese',
      icon: GraduationCap,
      className: 'bg-emerald-100 text-emerald-800',
    },
  }

  const { label, icon: Icon, className } = typeConfig[publication.type]

  const handleCopyBibtex = async () => {
    if (!publication.bibtex) return

    try {
      await navigator.clipboard.writeText(publication.bibtex)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy BibTeX:', err)
    }
  }

  return (
    <article className="border-b border-border py-6 last:border-0">
      <div className="flex flex-col gap-3">
        {/* Type badge and year */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className={className}>
            <Icon className="h-3 w-3 mr-1" />
            {label}
          </Badge>
          <span className="text-sm text-muted-foreground font-medium">
            {publication.year}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold leading-tight text-foreground">
          {publication.title}
        </h3>

        {/* Authors */}
        <p className="text-sm text-muted-foreground">
          {publication.authors}
        </p>

        {/* Venue */}
        {publication.venue && (
          <p className="text-sm italic text-muted-foreground">
            {publication.venue}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {publication.pdf_url && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={publication.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={locale === 'en' ? 'View PDF' : 'Ver PDF'}
              >
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </a>
            </Button>
          )}

          {publication.doi && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://doi.org/${publication.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={locale === 'en' ? 'Access DOI' : 'Acessar DOI'}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                DOI
              </a>
            </Button>
          )}

          {publication.bibtex && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyBibtex}
                    aria-label={locale === 'en' ? 'Copy BibTeX' : 'Copiar BibTeX'}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2 text-emerald-600" />
                        {locale === 'en' ? 'Copied!' : 'Copiado!'}
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        BibTeX
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{locale === 'en' ? 'Copy citation to clipboard' : 'Copiar citação'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </article>
  )
}

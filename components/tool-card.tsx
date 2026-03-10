'use client'

import { usePathname } from 'next/navigation'
import { ExternalLink, Github, FileText, Wrench } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface ToolProps {
  id: string
  name: string
  description_pt?: string
  description_en?: string
  url?: string
  github_url?: string
  docs_url?: string
  logo_url?: string
  is_featured?: boolean
  tags?: string[]
}

interface ToolCardProps {
  tool: ToolProps
  featured?: boolean
}

export function ToolCard({ tool, featured = false }: ToolCardProps) {
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'pt'

  const description = locale === 'en' ? tool.description_en : tool.description_pt

  return (
    <Card className={`group transition-all duration-300 ${featured ? 'border-2 border-primary shadow-lg' : 'hover:shadow-md'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          {/* Logo or Icon */}
          <div className="flex-shrink-0">
            {tool.logo_url ? (
              <img
                src={tool.logo_url}
                alt={`${tool.name} logo`}
                className="h-12 w-12 rounded-lg object-contain bg-muted p-1"
              />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-lg">
                {tool.name}
              </CardTitle>
              {tool.is_featured && (
                <Badge variant="default" className="text-xs">
                  {locale === 'en' ? 'Featured' : 'Destaque'}
                </Badge>
              )}
            </div>

            {description && (
              <CardDescription className="mt-1 line-clamp-2">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tool.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {tool.url && (
            <Button size="sm" asChild>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={locale === 'en' ? 'Access system' : 'Acessar sistema'}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Access' : 'Acessar'}
              </a>
            </Button>
          )}

          {tool.github_url && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={tool.github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </a>
            </Button>
          )}

          {tool.docs_url && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={tool.docs_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={locale === 'en' ? 'Documentation' : 'Documentação'}
              >
                <FileText className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Docs' : 'Docs'}
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

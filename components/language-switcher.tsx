'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const languages = [
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
]

interface LanguageSwitcherProps {
  className?: string
  showLabel?: boolean
}

export function LanguageSwitcher({ className, showLabel = false }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()

  const currentLocale = pathname.split('/')[1] || 'pt'

  const handleLanguageChange = (newLocale: string) => {
    const newPathname = pathname.replace(/^\/[a-z]{2}/, `/${newLocale}`)
    router.push(newPathname)
  }

  return (
    <Select value={currentLocale} onValueChange={handleLanguageChange}>
      <SelectTrigger 
        className={className}
        aria-label="Selecionar idioma"
      >
        <Globe className="h-4 w-4 mr-2" />
        <SelectValue>
          {showLabel 
            ? languages.find(l => l.code === currentLocale)?.label 
            : currentLocale.toUpperCase()
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

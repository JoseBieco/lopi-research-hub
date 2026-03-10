'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function Footer() {
  const t = useTranslations()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-white mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">Plataforma Acadêmica</h3>
            <p className="text-slate-300 text-sm">
              Centralizando a produção científica e as ferramentas do grupo de pesquisa.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Links Rápidos</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/team" className="text-slate-300 hover:text-white text-sm">
                {t('common.team')}
              </Link>
              <Link href="/projects" className="text-slate-300 hover:text-white text-sm">
                {t('common.projects')}
              </Link>
              <Link href="/publications" className="text-slate-300 hover:text-white text-sm">
                {t('common.publications')}
              </Link>
              <Link href="/tools" className="text-slate-300 hover:text-white text-sm">
                {t('common.tools')}
              </Link>
            </nav>
          </div>

          {/* Research */}
          <div>
            <h4 className="font-bold mb-4">{t('common.research_areas')}</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/research-areas" className="text-slate-300 hover:text-white text-sm">
                Ver todas
              </Link>
              <Link href="/news" className="text-slate-300 hover:text-white text-sm">
                {t('common.news')}
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contato</h4>
            <p className="text-slate-300 text-sm mb-2">
              Entre em contato conosco para colaborações ou dúvidas.
            </p>
            <a href="mailto:contact@example.com" className="text-blue-400 hover:text-blue-300 text-sm">
              contact@example.com
            </a>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-slate-700 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
          <p>&copy; {currentYear} Grupo de Pesquisa. Todos os direitos reservados.</p>
          <nav className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white">
              Privacidade
            </Link>
            <Link href="/terms" className="hover:text-white">
              Termos de Uso
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

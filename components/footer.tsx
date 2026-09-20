'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function Footer() {
  const t = useTranslations()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-indigo-950 text-white mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">LOPI</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Grupo de pesquisa em Otimização e Problemas Inversos, do Instituto de Ciências Matemáticas e de Computação (ICMC-USP), com apoio da FAPESP.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Links Rápidos</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/team" className="text-slate-300 hover:text-white text-sm transition-colors">
                {t('common.team')}
              </Link>
              <Link href="/projects" className="text-slate-300 hover:text-white text-sm transition-colors">
                {t('common.projects')}
              </Link>
              <Link href="/publications" className="text-slate-300 hover:text-white text-sm transition-colors">
                {t('common.publications')}
              </Link>
              <Link href="/tools" className="text-slate-300 hover:text-white text-sm transition-colors">
                {t('common.tools')}
              </Link>
            </nav>
          </div>

          {/* Research */}
          <div>
            <h4 className="font-bold mb-4">{t('common.research_areas')}</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/news" className="text-slate-300 hover:text-white text-sm transition-colors">
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
            <a href="mailto:helou@icmc.usp.br" className="text-teal-400 hover:text-teal-300 text-sm transition-colors">
              helou@icmc.usp.br
            </a>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-indigo-800/50 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
          <p>&copy; {currentYear} LOPI ICMC-USP. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

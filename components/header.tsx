'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'

export function Header() {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const locale = pathname.split('/')[1] || 'pt'

  const handleLanguageChange = (newLocale: string) => {
    const newPathname = pathname.replace(/^\/[a-z]{2}/, `/${newLocale}`)
    router.push(newPathname)
  }

  const navLinks = [
    { href: '/about', label: t('common.about') },
    { href: '/team', label: t('common.team') },
    { href: '/projects', label: t('common.projects') },
    { href: '/tools', label: t('common.tools') },
    { href: '/publications', label: t('common.publications') },
    { href: '/news', label: t('common.news') },
  ]

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-blue-600">
            {t('home.title')}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-700 hover:text-blue-600 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Language Selector and Admin */}
          <div className="hidden md:flex items-center space-x-4">
            <select
              value={locale}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm"
            >
              <option value="pt">PT</option>
              <option value="en">EN</option>
            </select>
            <Link
              href="/admin/login"
              className="text-slate-700 hover:text-blue-600 font-medium"
            >
              {t('common.admin')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2" />
              <select
                value={locale}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="mx-4 px-3 py-2 border border-slate-300 rounded-md text-sm"
              >
                <option value="pt">Português</option>
                <option value="en">English</option>
              </select>
              <Link
                href="/admin/login"
                className="mx-4 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md font-medium"
              >
                {t('common.admin')}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  FileText, 
  Wrench, 
  Newspaper,
  LogOut,
  ChevronLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Membros',
    href: '/admin/members',
    icon: Users,
  },
  {
    title: 'Projetos',
    href: '/admin/projects',
    icon: FolderKanban,
  },
  {
    title: 'Publicações',
    href: '/admin/publications',
    icon: FileText,
  },
  {
    title: 'Ferramentas',
    href: '/admin/tools',
    icon: Wrench,
  },
  {
    title: 'Notícias',
    href: '/admin/news',
    icon: Newspaper,
  },
]

interface AdminSidebarProps {
  className?: string
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className={cn('flex flex-col h-full bg-white border-r border-slate-200 text-slate-700', className)}>
      {/* Header */}
      <div className="p-6 border-b border-slate-200 flex-shrink-0">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="h-10 w-12 text-sm rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-sm">LOPI</div>
          <div>
            <h1 className="font-bold text-slate-900 leading-none mb-1">Painel Admin</h1>
            <p className="text-xs text-slate-500 font-medium">Gestão de Conteúdo</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-1.5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4">
            Menu Principal
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm ring-1 ring-blue-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-indigo-600" : "text-slate-400")} />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 space-y-2 flex-shrink-0 bg-slate-50/50">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 shadow-sm transition-all"
          asChild
        >
          <Link href="/pt">
            <ChevronLeft className="h-4 w-4 mr-2 text-slate-400" />
            Voltar ao Site
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-600 hover:text-red-700 hover:bg-red-50 transition-all"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2 text-red-500" />
          Sair do Sistema
        </Button>
      </div>
    </aside>
  )
}



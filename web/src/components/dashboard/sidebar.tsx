'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, KeyRound, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  exact?: boolean
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'API Keys', href: '/dashboard/keys', icon: KeyRound },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar(): JSX.Element {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()

  const isActive = (item: NavItem): boolean =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  const handleSignOut = async (): Promise<void> => {
    await signOut()
    router.push('/login')
    router.refresh()
  }

  const userInitial =
    user?.user_metadata?.full_name?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    '?'

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden lg:flex flex-col w-64 bg-neutral-900 border-r border-border">
      <div className="h-16 flex items-center px-6 border-b border-border/20 flex-shrink-0">
        <span className="font-display font-bold text-xl text-white">PixShift</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
              isActive(item)
                ? 'bg-primary text-white'
                : 'text-neutral-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border/20 p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
          {userInitial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-50 truncate">
            {user?.user_metadata?.full_name ?? 'User'}
          </p>
          <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="text-neutral-400 hover:text-white transition-colors flex-shrink-0"
          aria-label="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface TopbarProps {
  title: string
  onMenuClick: () => void
}

export function Topbar({ title, onMenuClick }: TopbarProps): JSX.Element {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const userInitial =
    user?.user_metadata?.full_name?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    '?'

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async (): Promise<void> => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="fixed top-0 right-0 left-0 z-40 h-16 lg:pl-64 bg-surface border-b border-border">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-neutral-400 hover:text-white transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-neutral-50">{title}</h1>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
            aria-label="User menu"
          >
            {userInitial}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-elevated border border-border rounded-lg shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-medium text-neutral-50 truncate">
                  {user?.user_metadata?.full_name ?? 'User'}
                </p>
                <p className="text-xs text-muted truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

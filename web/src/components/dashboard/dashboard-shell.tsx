'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'
import { MobileDrawer } from './mobile-drawer'

interface DashboardShellProps {
  children: React.ReactNode
  title: string
}

export function DashboardShell({ children, title }: DashboardShellProps): JSX.Element {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-900">
      <Sidebar />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Topbar title={title} onMenuClick={() => setDrawerOpen(true)} />

        <main className="flex-1 mt-16 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

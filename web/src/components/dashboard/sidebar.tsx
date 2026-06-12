'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, KeyRound, Settings, LogOut, BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'API Keys', href: '/dashboard/keys', icon: KeyRound },
  { label: 'Docs', href: '/dashboard/docs', icon: BookOpen },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar(): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const isActive = (item: NavItem): boolean =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const handleSignOut = async (): Promise<void> => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  const userInitial =
    user?.user_metadata?.full_name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-border bg-neutral-900 lg:flex">
      <div className="flex h-16 flex-shrink-0 items-center border-b border-border/20 px-6">
        <span className="font-display text-xl font-bold text-white">PixShift</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
              isActive(item)
                ? 'bg-primary text-white'
                : 'text-neutral-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3 border-t border-border/20 p-4">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
          {userInitial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-neutral-50">
            {user?.user_metadata?.full_name ?? 'User'}
          </p>
          <p className="truncate text-xs text-neutral-400">{user?.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex-shrink-0 text-neutral-400 transition-colors hover:text-white"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}

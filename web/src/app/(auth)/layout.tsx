import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <header className="h-16 flex items-center px-6 flex-shrink-0">
        <Link
          href="/"
          className="font-display font-bold text-xl text-white hover:text-accent transition-colors"
        >
          PixShift
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </div>
    </div>
  )
}

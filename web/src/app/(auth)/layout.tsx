export default function AuthLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
      {children}
    </div>
  )
}

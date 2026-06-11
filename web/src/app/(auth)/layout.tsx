export default function AuthLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="min-h-screen bg-neutral-900">
      {children}
    </div>
  )
}

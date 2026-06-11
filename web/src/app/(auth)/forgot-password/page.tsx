'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function ForgotPasswordPage(): JSX.Element {
  return (
    <div className="w-full max-w-[400px]">
      <div className="text-center mb-8">
        <span className="font-display font-bold text-xl text-neutral-50">PixShift</span>
        <h1 className="mt-6 text-3xl font-display font-bold text-neutral-50 tracking-tight">
          Reset your password
        </h1>
      </div>

      <div className="bg-surface border border-border-default rounded-lg p-6 shadow-sm text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-accent" />
        </div>
        <p className="text-sm text-neutral-200 font-medium mb-2">
          Password reset via email is not yet available.
        </p>
        <p className="text-xs text-neutral-400 leading-relaxed">
          This feature requires SMTP configuration. In the meantime, contact support or check the
          open source repo if you are self-hosting.
        </p>
      </div>

      <p className="mt-5 text-center text-sm text-neutral-400">
        <Link href="/login" className="text-accent hover:text-neutral-200 transition-colors duration-150">
          Back to login
        </Link>
      </p>
    </div>
  )
}

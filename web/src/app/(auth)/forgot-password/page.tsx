'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { authService } from '@/services/auth.service'

const forgotSchema = z.object({
  email: z.string().email('Enter a valid email address'),
})

type ForgotFormData = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage(): JSX.Element {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormData>({ resolver: zodResolver(forgotSchema) })

  const onSubmit = async (data: ForgotFormData): Promise<void> => {
    try {
      await authService.resetPassword(data.email)
    } catch {
      // Always show the same confirmation — never reveal if email exists
    } finally {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-[400px] text-center">
          <h1 className="text-2xl font-display font-bold text-neutral-50 mb-3">
            Check your email
          </h1>
          <p className="text-neutral-400 text-sm">
            If an account exists with that email, you will receive a reset link shortly.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block text-sm text-accent hover:text-neutral-200 transition-colors"
          >
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-neutral-50">Reset your password</h1>
          <p className="text-neutral-400 text-sm mt-2">
            Enter your email and we&apos;ll send a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-200 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className="w-full px-3.5 py-2.5 bg-neutral-800 border border-neutral-700 rounded-md text-neutral-50 placeholder-neutral-500 text-sm focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(124,58,237,0.20)] transition-colors"
              placeholder="you@company.com"
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-error">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-full text-sm transition-colors duration-150"
          >
            {isSubmitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-400">
          <Link href="/login" className="text-accent hover:text-neutral-200 transition-colors">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}

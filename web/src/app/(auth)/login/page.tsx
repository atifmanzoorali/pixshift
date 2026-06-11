'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage(): JSX.Element {
  const router = useRouter()
  const { login } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData): Promise<void> => {
    setServerError(null)
    try {
      await login(data)
      router.push('/dashboard')
      router.refresh()
    } catch {
      // Never expose the raw API error — users don't need to know which field was wrong
      setServerError('Invalid email or password')
    }
  }

  return (
    <div className="w-full max-w-[400px]">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="font-display font-bold text-xl text-neutral-50">PixShift</span>
        <h1 className="mt-6 text-3xl font-display font-bold text-neutral-50 tracking-tight">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-neutral-400">Log in to your account.</p>
      </div>

      {/* Form card */}
      <div className="bg-surface border border-border-default rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-200 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              {...register('email')}
              className="w-full px-3.5 py-2.5 bg-elevated border border-border-default rounded-md text-neutral-50 placeholder-neutral-500 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors duration-150"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-error">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-neutral-200">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-accent hover:text-neutral-200 transition-colors duration-150"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              {...register('password')}
              className="w-full px-3.5 py-2.5 bg-elevated border border-border-default rounded-md text-neutral-50 placeholder-neutral-500 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors duration-150"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-error">{errors.password.message}</p>
            )}
          </div>

          {/* Server error */}
          {serverError && (
            <div className="bg-error-bg border-l-4 border-error rounded-md px-4 py-3">
              <p className="text-xs text-error">{serverError}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-6 bg-primary hover:bg-primary-hover disabled:bg-neutral-700 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-semibold rounded-full text-sm transition-colors duration-150 mt-1"
          >
            {isSubmitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>
      </div>

      <p className="mt-5 text-center text-sm text-neutral-400">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-accent hover:text-neutral-200 transition-colors duration-150">
          Sign up
        </Link>
      </p>
    </div>
  )
}

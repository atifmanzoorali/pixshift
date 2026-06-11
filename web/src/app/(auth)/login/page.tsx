'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { authService } from '@/services/auth.service'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage(): JSX.Element {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    setServerError(null)
    try {
      await authService.signIn(data.email, data.password)
      router.push('/dashboard')
      router.refresh()
    } catch {
      // Never expose which field is wrong — generic message intentional
      setServerError('Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-neutral-50">Welcome back</h1>
          <p className="text-neutral-400 text-sm mt-2">Log in to your account.</p>
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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-neutral-200">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              className="w-full px-3.5 py-2.5 bg-neutral-800 border border-neutral-700 rounded-md text-neutral-50 placeholder-neutral-500 text-sm focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(124,58,237,0.20)] transition-colors"
              placeholder="Your password"
            />
            {errors.password && (
              <p className="mt-1.5 text-xs text-error">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-xs text-error bg-error-bg border border-error/20 rounded-md px-3.5 py-2.5">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-full text-sm transition-colors duration-150"
          >
            {isSubmitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-400">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-accent hover:text-neutral-200 transition-colors">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}

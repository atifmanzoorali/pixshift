'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { authService } from '@/services/auth.service'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage(): JSX.Element {
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (data: RegisterFormData): Promise<void> => {
    setServerError(null)
    try {
      await authService.signUp(data.name, data.email, data.password)
      setSuccess(true)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (success) {
    return (
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-[400px] text-center">
          <h1 className="text-2xl font-display font-bold text-neutral-50 mb-3">
            Check your email
          </h1>
          <p className="text-neutral-400 text-sm">
            We&apos;ve sent a confirmation link. Click it to activate your account.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-neutral-50">
            Create your account
          </h1>
          <p className="text-neutral-400 text-sm mt-2">
            Start converting images in under 60 seconds.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-200 mb-1.5">
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              {...register('name')}
              className="w-full px-3.5 py-2.5 bg-neutral-800 border border-neutral-700 rounded-md text-neutral-50 placeholder-neutral-500 text-sm focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(124,58,237,0.20)] transition-colors"
              placeholder="Jane Smith"
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-error">{errors.name.message}</p>
            )}
          </div>

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
            <label htmlFor="password" className="block text-sm font-medium text-neutral-200 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register('password')}
              className="w-full px-3.5 py-2.5 bg-neutral-800 border border-neutral-700 rounded-md text-neutral-50 placeholder-neutral-500 text-sm focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(124,58,237,0.20)] transition-colors"
              placeholder="At least 8 characters"
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
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-400">
          Already have an account?{' '}
          <Link href="/login" className="text-accent hover:text-neutral-200 transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

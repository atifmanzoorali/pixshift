'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import type { AxiosError } from 'axios'

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormData = z.infer<typeof schema>

export default function RegisterPage(): JSX.Element {
  const { register: registerUser } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData): Promise<void> => {
    setServerError(null)
    try {
      await registerUser(data)
      setSuccess(true)
    } catch (err) {
      const axiosErr = err as AxiosError<{ error: { message: string } }>
      const msg = axiosErr.response?.data?.error?.message
      setServerError(msg ?? 'Something went wrong. Please try again.')
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-[400px] text-center">
        <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-display font-bold text-neutral-50 mb-2">
          Check your email
        </h1>
        <p className="text-sm text-neutral-400">
          We&apos;ve sent a confirmation link to your inbox. Click it to activate your account.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm text-accent hover:text-neutral-200 transition-colors duration-150"
        >
          Back to login
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[400px]">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="font-display font-bold text-xl text-neutral-50">PixShift</span>
        <h1 className="mt-6 text-3xl font-display font-bold text-neutral-50 tracking-tight">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Start converting images via API in under 60 seconds.
        </p>
      </div>

      {/* Form card */}
      <div className="bg-surface border border-border-default rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Full name */}
          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-neutral-200 mb-1.5"
            >
              Full name
            </label>
            <input
              id="full_name"
              type="text"
              autoComplete="name"
              placeholder="Jane Smith"
              {...register('full_name')}
              className="w-full px-3.5 py-2.5 bg-elevated border border-border-default rounded-md text-neutral-50 placeholder-neutral-500 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors duration-150"
            />
            {errors.full_name && (
              <p className="mt-1 text-xs text-error">{errors.full_name.message}</p>
            )}
          </div>

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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-200 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
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
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>

      <p className="mt-5 text-center text-sm text-neutral-400">
        Already have an account?{' '}
        <Link href="/login" className="text-accent hover:text-neutral-200 transition-colors duration-150">
          Log in
        </Link>
      </p>
    </div>
  )
}

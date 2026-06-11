'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

import { authService } from '@/services/auth.service'
import type { LoginPayload, RegisterPayload, User } from '@/types/auth.types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // On mount: restore session from the httpOnly cookie
  useEffect(() => {
    authService
      .restoreSession()
      .then((session) => setUser(session?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (payload: LoginPayload): Promise<void> => {
    await authService.login(payload)
    const session = await authService.restoreSession()
    setUser(session?.user ?? null)
  }, [])

  const register = useCallback(async (payload: RegisterPayload): Promise<void> => {
    await authService.register(payload)
    // Do not auto-login after register — user sees "check your email" confirmation
  }, [])

  const logout = useCallback(async (): Promise<void> => {
    await authService.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

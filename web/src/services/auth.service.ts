import { apiClient, setAuthToken } from '@/lib/axios'
import type { ApiSuccess } from '@/types/api.types'
import type { LoginPayload, RegisterPayload, TokenResponse, User } from '@/types/auth.types'

export const authService = {
  async register(payload: RegisterPayload): Promise<User> {
    const { data } = await apiClient.post<ApiSuccess<User>>('/api/v1/auth/register', payload)
    return data.data
  },

  async login(payload: LoginPayload): Promise<string> {
    const { data } = await apiClient.post<ApiSuccess<TokenResponse>>(
      '/api/v1/auth/login',
      payload
    )
    const token = data.data.access_token

    // Persist token in-memory for axios Bearer header
    setAuthToken(token)

    // Persist token in httpOnly cookie via Next.js internal route (for middleware + page refresh)
    await fetch('/api/internal/set-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })

    return token
  },

  async logout(): Promise<void> {
    setAuthToken(null)
    await fetch('/api/internal/clear-session', { method: 'POST' })
  },

  async getMe(token: string): Promise<User> {
    const { data } = await apiClient.get<ApiSuccess<User>>('/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data.data
  },

  // Called on page load to restore session from httpOnly cookie
  async restoreSession(): Promise<{ token: string; user: User } | null> {
    const res = await fetch('/api/internal/session')
    const { token } = (await res.json()) as { token: string | null }

    if (!token) return null

    try {
      setAuthToken(token)
      const user = await authService.getMe(token)
      return { token, user }
    } catch {
      // Token in cookie is expired or invalid — clear it
      await fetch('/api/internal/clear-session', { method: 'POST' })
      setAuthToken(null)
      return null
    }
  },
}

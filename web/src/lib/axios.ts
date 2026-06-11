import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not set. Check your .env.local file.')
}

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

// Attach the Bearer token before every request.
// The token is injected by setAuthToken() after login, and cleared on logout.
let _token: string | null = null

export function setAuthToken(token: string | null): void {
  _token = token
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common['Authorization']
  }
}

export function getAuthToken(): string | null {
  return _token
}

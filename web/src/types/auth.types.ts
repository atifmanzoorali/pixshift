export interface User {
  id: number
  email: string
  full_name: string
  is_active: boolean
  created_at: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface RegisterPayload {
  full_name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

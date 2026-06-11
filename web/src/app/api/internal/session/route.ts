import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Used by AuthContext on page load to restore the token from the httpOnly cookie.
// Returns { token } if a session exists, { token: null } if not.
export async function GET(): Promise<NextResponse> {
  const cookieStore = cookies()
  const token = cookieStore.get('auth_token')?.value ?? null
  return NextResponse.json({ token })
}

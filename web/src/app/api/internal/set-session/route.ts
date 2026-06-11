import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request): Promise<NextResponse> {
  const { token } = await request.json() as { token: string }

  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 })
  }

  const cookieStore = cookies()
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60, // 1 hour — matches ACCESS_TOKEN_EXPIRE_MINUTES
  })

  return NextResponse.json({ success: true })
}

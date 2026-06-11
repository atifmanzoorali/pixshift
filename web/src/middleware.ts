import { type NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest): NextResponse {
  const token = request.cookies.get('auth_token')?.value
  const pathname = request.nextUrl.pathname

  // Unauthenticated user trying to reach the dashboard
  if (!token && pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Authenticated user hitting login or register
  if (token && (pathname === '/login' || pathname === '/register')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}

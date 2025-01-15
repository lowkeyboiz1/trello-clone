// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function getCookie(request: NextRequest, cookieName: string) {
  const cookie = request.cookies.get(cookieName)
  return cookie ? cookie.value : null
}

export function middleware(request: NextRequest) {
  // get token from cookie
  const token = getCookie(request, 'google_token')

  // Public routes where login check is not required
  const publicRoutes = ['/login']
  // If token exists, user is authenticated, continue to the requested route
  if (token) {
    return NextResponse.next()
  }

  // If the route is public, skip the middleware
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  // If no token and trying to access a private route, redirect to login
  return NextResponse.redirect(new URL('/login', request.url))
}

// Config: define on which paths the middleware should run
export const config = {
  matcher: ['/', '/board/:path*', '/profile/:path*'] // Add other private routes as needed
}

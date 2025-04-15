import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth_token')?.value
  
  // Check if the user is authenticated
  const isAuthenticated = !!token
  
  // Paths that don't require authentication
  const publicPaths = ['/login']
  
  // Check if the requested path is a public path
  const isPublicPath = publicPaths.includes(pathname)
  
  // If the user is not authenticated and the path is not public, redirect to login
  if (!isAuthenticated && !isPublicPath && !pathname.startsWith('/api/')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // If the user is authenticated and trying to access login, redirect to home
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)'],
}

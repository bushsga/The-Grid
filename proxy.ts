// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Only protect admin routes
  const isAdminRoute = path.startsWith('/admin/')
  const isLoginPage = path === '/admin/login'
  
  // Get the session cookie
  const session = request.cookies.get('__session')?.value
  
  console.log(`🔒 Proxy: ${path} | Session exists: ${!!session}`)
  
  // 🔴 CASE 1: Trying to access admin page (not login) without session
  if (isAdminRoute && !isLoginPage && !session) {
    console.log(`🚫 No session, redirecting ${path} to /admin/login`)
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
  
  // 🔴 CASE 2: Already logged in and trying to visit login page
  if (isLoginPage && session) {
    console.log(`✅ Has session, redirecting from login to dashboard`)
    const dashboardUrl = new URL('/admin/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }
  
  // ✅ Otherwise, proceed normally
  console.log(`✅ Allowing access to ${path}`)
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
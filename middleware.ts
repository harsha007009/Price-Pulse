import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get user ID from cookies directly
  const userId = request.cookies.get('userId')?.value;
  
  // Define public routes that don't require authentication
  const isPublicRoute = 
    pathname === '/' || 
    pathname.startsWith('/auth/') || 
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/search');
  
  // If it's a public route, allow access
  if (isPublicRoute) {
    // If user is logged in and trying to access auth pages, redirect to home
    if (userId && pathname.startsWith('/auth/')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }
  
  // For protected routes, check if user is authenticated
  if (!userId) {
    // If no userId, redirect to login
    const redirectUrl = new URL('/auth/signin', request.url);
    redirectUrl.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(redirectUrl);
  }
  
  // User is authenticated, allow access to protected route
  return NextResponse.next();
}

// Configure which routes should trigger this middleware
export const config = {
  matcher: [
    // Match all routes except static files, api routes we want to be public, and auth pages
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
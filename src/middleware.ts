import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/sign-in",
  "/sign-up",
  "/interview",
  "/call",
  "/api/register-call",
  "/api/get-call", 
  "/api/generate-interview-questions",
  "/api/create-interviewer",
  "/api/analyze-communication",
];

// Define protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/interview",
];

// Check if a route is public
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => {
    if (route.endsWith('(.*)')) {
      const baseRoute = route.replace('(.*)', '');
      return pathname.startsWith(baseRoute);
    }
    return pathname === route || pathname.startsWith(route + '/');
  });
}

// Check if a route is protected
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => {
    if (route.endsWith('(.*)')) {
      const baseRoute = route.replace('(.*)', '');
      return pathname.startsWith(baseRoute);
    }
    return pathname === route || pathname.startsWith(route + '/');
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check for authentication on protected routes
  if (isProtectedRoute(pathname)) {
    // For page routes, let the client-side auth handle the checks
    // The middleware will only redirect if there's no session cookie
    if (!pathname.startsWith('/api/')) {
      const sessionCookie = request.cookies.get('foloup_auth_session');
      
      // Only redirect if we're sure there's no session
      // This allows the client-side auth to handle the initial load
      if (!sessionCookie && !pathname.includes('sign-in') && !pathname.includes('sign-up')) {
        const signInUrl = new URL('/sign-in', request.url);
        signInUrl.searchParams.set('redirect_url', pathname);
        return NextResponse.redirect(signInUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

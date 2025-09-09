import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/interview",
  "/call",
  "/api/register-call",
  "/api/get-call", 
  "/api/generate-interview-questions",
  "/api/create-interviewer",
  "/api/analyze-communication",
  "/api/feedback",
  "/api/auth/session",
  "/api/auth/logout",
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
    // Don't redirect in middleware - let the client-side auth handle it
    if (!pathname.startsWith('/api/')) {
      // Always allow the request through - client-side will handle auth
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

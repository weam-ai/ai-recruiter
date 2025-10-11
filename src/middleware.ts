import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/config/withSession';
import { getHostnameFromRequest } from '@/lib/utils';

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
  "/api/auth/check-access",
];

// Define protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/interview",
];

// Helper function to call check-access API
async function callCheckAccessAPI(userId: string, companyId: string, urlPath: string, baseUrl: string) {
  try {
    // Construct the full URL for the API call
    
    const basePath = process.env.NEXT_PUBLIC_API_BASE_PATH;
    const fullUrl = `${baseUrl}${basePath}/api/auth/check-access`;
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        companyId,
        urlPath
      }),
    });

    if (!response.ok) {
      return false;
    }

    const jsonData = await response.json();
    
    return jsonData.data?.hasAccess;
  } catch (error) {
    // console.error('Error calling check-access API....:', error);
    return false;
  }
}

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = getHostnameFromRequest(request);
  const session = await getSession();
  console.log('!pathname.startsWith(/api/): ', !pathname.startsWith('/api/'));
  // Call check-access API for every page access (except API routes and static files)
  if (pathname.startsWith('/api/') === false && session?.user?.roleCode === 'USER') {
    console.log('session?.user?.roleCode: ', session?.user?.roleCode);
    try {          
      if (session?.user && session?.user?._id) {
        // Call check-access API for every page access
        const hasAccess = await callCheckAccessAPI(session?.user?._id, session?.user?.companyId, process.env.NEXT_PUBLIC_API_BASE_PATH, hostname);
        
        // If access is denied, redirect to login page
        if (!hasAccess) {          
          console.log('Access denied, redirecting to login page');
          return NextResponse.redirect(new URL('/login', request.url));
        } else {
          return NextResponse.next();
        }
      } else {
        console.log('No user session found, redirecting to login page');
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      console.error('Error in middleware check-access call:', error);
      // Redirect to login page on error
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

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
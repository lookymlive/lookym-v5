// middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/error',
  '/about',
  '/api/auth',
  '/api/webhooks',
];

// Routes that require specific roles
const roleRoutes = {
  admin: ['/admin'],
  store: ['/store'],
};

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is public
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  try {
    const session = await auth();

    // If no session exists, redirect to signin
    if (!session) {
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Role-based access control
    const userRole = session.user.role;

    // Check admin routes
    if (pathname.startsWith('/admin')) {
      if (userRole !== 'admin') {
        return new NextResponse('Unauthorized', { status: 403 });
      }
    }

    // Check store routes
    if (pathname.startsWith('/store')) {
      if (!['store', 'admin'].includes(userRole)) {
        return new NextResponse('Unauthorized', { status: 403 });
      }
    }

    // Check if user is verified for sensitive operations
    const requiresVerification = pathname.startsWith('/api/protected') || 
                               pathname.startsWith('/dashboard');
    
    if (requiresVerification && !session.user.verified) {
      return new NextResponse('Email verification required', { status: 403 });
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Specify which routes should be processed by the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
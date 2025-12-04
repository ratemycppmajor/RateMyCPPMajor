import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { middlewareAuthConfig } from '@/middleware.config';
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from '@/routes';

const { auth } = NextAuth(middlewareAuthConfig);

// in the middleware decide what to do with these routes
export default auth((req) => {
  // destructure the next url
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // Allow API auth routes to pass through
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // check if we are on auth route
  if (isAuthRoute) {
    // if logged in, redirect to default("settings") page, pass nextUrl so it creates absolute url
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    // Allow unauthenticated users to access auth routes
    return NextResponse.next();
  }

  // check if not logged in and not on public route
  if (!isLoggedIn && !isPublicRoute) {
    // if you login redirect back to the page you were on
    let callbackUrl = nextUrl.pathname;

    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    );
  }

  // allow every other route so if user on public route fallback here
  return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths, simply gonna be used to invoke the middleware, the auth function above. Invoke on everything excpet that regex
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

import type { NextAuthConfig } from 'next-auth';

/**
 * Minimal auth config for middleware (Edge runtime compatible)
 * Only includes what's needed for JWT token verification
 */
export const middlewareAuthConfig = {
  secret: process.env.AUTH_SECRET,
  providers: [], // Providers aren't needed in middleware - only JWT verification happens
} satisfies NextAuthConfig;

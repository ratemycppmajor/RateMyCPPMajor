import NextAuth, { type DefaultSession } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from './lib/db';
import authConfig from './auth.config';
import { getUserById } from './services/user';
import { getAccountByUserId } from './services/account';

// helps avoid .role type error
export type ExtendedUser = DefaultSession['user'] & {
  isOAuth?: boolean; // custom field to check if user is authenticated via OAuth
  studentVerified?: boolean; // custom field to check if email is @cpp.edu
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // define routes for when something goes wrong, ex. using different created oauth provider for login
  pages: {
    signIn: '/login',
    error: '/error',
  },
  // events are asynch functions that do not resturn a response, they are useful for audit logs/reporting or handling other side-effects
  // use this event for "linkAccount", if this event is triggered that means this user just used an OAuth provider to create or log in their account
  // don't need a special register for OAuth, if it exists, it's going to login otherwise create a new account
  // gonna use linkAccount so when someone creates an account using google or github, we're gonna automatically popular the emailverified field in User
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    // essentially checks if user is signed with email verification, extra security to see if email verified, a fallback
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') {
        return true;
      }

      // proceed with credentials auth, no account created yet
      if (!user.id) return false;

      const existingUser = await getUserById(user.id);

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      return true;
    },
    async session({ token, session }) {
      // console.log({ sessionToken: token, session })
      // we want to transfer the id inside the user

      if (token.sub && session.user) {
        // create a custom field for user id to store in session
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email ?? '';
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.studentVerified = token.studentVerified as boolean;
      }

      return session;
    },
    // first it starts with the token
    async jwt({ token }) {
      // console token, make sure you are logged in, contains fields like "name, email, sub"
      // token contains a "sub" field, which contains our userid from the prisma db, check supabase
      // console.log({token})
      if (!token.sub) return token;

      // do this since extract user doesn't work in params
      // good we seperate callbacks since getUserById is prisma
      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;
      // If the user has an account entry from Google/GitHub/etc., !!existingAccount becomes true.
      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.studentVerified = existingUser.studentVerified ?? false;

      return token;
    },
  },
  // The adapter works at runtime but TypeScript can't verify the type compatibility with custom Prisma client output
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' }, // use jwt cause prisma database session not compatible with edge
  ...authConfig,
});

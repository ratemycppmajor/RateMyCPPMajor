import { db } from '@/lib/db';
import type { VerificationToken } from '@/app/generated/prisma/client';

/**
 * Fetches a verification token from the database by their token.
 *
 * @param email - The verification token from the URL
 * @returns The verification token(email, token, expires) if found, otherwise null.
 */
export const getVerficationToken = async (
  token: string,
): Promise<VerificationToken | null> => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });

    return verificationToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Fetches a token from the database by their email.
 *
 * @param email - The email address of the user to look up.
 * @returns The verification token(email, token, expires) if found, otherwise null.
 */
export const getVerficationTokenByEmail = async (
  email: string,
): Promise<VerificationToken | null> => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email },
    });

    return verificationToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

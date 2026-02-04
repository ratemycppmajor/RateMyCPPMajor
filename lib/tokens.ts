import { v4 as uuidv4 } from 'uuid';
import type { Prisma } from '@/app/generated/prisma/client';
import { db } from '@/lib/db';
import { getVerficationTokenByEmail } from '@/services/verfication-token';
import { getPasswordResetTokenByEmail } from '@/services/password-reset-token';

export type VerificationPurpose = 'primary_email' | 'cpp_email';

/**
 * Generates a new email verification token for a given email address.
 * Deletes any existing token before creating a new one.
 *
 * @param email - The user's email address
 * @param userId - Optional. When set with purpose, identifies which user to update on verify.
 * @param purpose - Optional. 'primary_email' = change primary email, 'cpp_email' = add CPP student email. Omit for signup.
 * @returns The created verification token
 */
export const generateVerificationToken = async (
  email: string,
  userId?: string,
  purpose?: VerificationPurpose
) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // expires in 1 hr

  const existingToken = await getVerficationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }
  
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
      userId: userId ?? undefined,
      purpose: purpose ?? undefined,
    } as Prisma.VerificationTokenCreateInput,
  });

  return verificationToken;
};

/**
 * Generates a new password reset token for a given email address.
 * Deletes any existing token before creating a new one.
 *
 * @param email - The user's email address
 * @returns The created password reset token
 */
export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};

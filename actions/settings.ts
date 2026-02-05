'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';

import { db } from '@/lib/db';
import { SettingsSchema } from '@/schemas';
import { getUserById, getUserByEmail } from '@/services/user';
import { currentUser } from '@/lib/auth';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user || !user.id) {
    return { error: 'Unauthorized!' };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: 'Unauthorized!' };
  }

  if (user.isOAuth) {
    // OAuth users cannot change these fields because these are handled by the provider
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
  }

  // CPP email verification: add a @cpp.edu email to gain studentVerified (keeps OAuth/primary email unchanged)
  if (values.cppEmail) {
    const cppEmailLower = values.cppEmail.toLowerCase();

    // Already have this CPP email verified — don't send another verification; allow other updates
    if (dbUser.cppEmail === cppEmailLower && dbUser.cppEmailVerified) {
      values.cppEmail = undefined;
    } else {
      const existingByEmail = await getUserByEmail(cppEmailLower);

      if (existingByEmail && existingByEmail.id !== user.id) {
        return {
          error: 'This CPP email is already in use by another account!',
        };
      }

      const existingByCppEmail = await db.user.findFirst({
        where: {
          cppEmail: cppEmailLower,
          id: { not: user.id },
        },
      });

      if (existingByCppEmail) {
        return {
          error: 'This CPP email is already in use by another account!',
        };
      }

      const verificationToken = await generateVerificationToken(
        cppEmailLower,
        user.id,
        'cpp_email',
      );

      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
      );

      return { success: 'Verification email sent to your CPP email!' };
    }
  }

  if (values.email && values.email !== user.email) {
    // ensure the email is not already in use by another user
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: 'Email already in use!' };
    }
    // generate verification token using new email and user id for primary email change
    const verificationToken = await generateVerificationToken(
      values.email,
      user.id,
      'primary_email',
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: 'Verification email sent!' };
  }

  if (values.password && values.newPassword && dbUser.password) {
    // check if they entered a correct password
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbUser.password,
    );

    if (!passwordMatch) {
      return { error: 'Incorrect password!' };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);

    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  // Don't send cppEmail to DB here; it's set only after verification in newVerification
  const { cppEmail: _cppEmail, ...updateData } = values;

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...updateData,
    },
  });

  return { success: 'Settings Updated!' };
};

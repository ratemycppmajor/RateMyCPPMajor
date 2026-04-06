'use server';

import { db } from '@/lib/db';
import { getUserByEmail } from '@/services/user';
import { getVerficationToken } from '@/services/verfication-token';

/**
 * Handles email verification using a provided token.
 *
 * 1. Checks if the token exists and is valid.
 * 2. Verifies the token hasn't expired.
 * 3. Confirms the associated user exists.
 * 4. Updates the user's `emailVerified` field and optionally updates the email.
 * 5. Deletes the used verification token from the database.
 * Three flows:
 * 1. CPP email verification (token has userId + purpose 'cpp_email'): set user's cppEmail, cppEmailVerified, studentVerified. Primary email unchanged. e.g. User adds @cpp.edu email in specific field in settings
 * 2. Primary email change (token has userId + purpose 'primary_email'): update user's email, emailVerified, and studentVerified (if @cpp.edu or already had verified CPP). e.g. User changes their general email to different general email or change to @cpp.edu email
 * 3. Signup verification (no userId, no purpose): find user by token email, update email, emailVerified, and studentVerified if @cpp.edu. e.g. User signs up with @cpp.edu email
 *
 * @param token - The verification token sent to the user's email.
 * @returns An object indicating success or an appropriate error message.
 */
export const newVerification = async (token: string) => {
  const existingToken = await getVerficationToken(token);

  if (!existingToken) {
    return { error: 'Token does not exist!' };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: 'Token has expired!' };
  }

  const user = existingToken.userId;

  // CPP email verification: token was created with userId + purpose 'cpp_email' in settings
  if (existingToken.purpose === 'cpp_email' && user) {
    const cppEmail = existingToken.email.toLowerCase();

    if (!cppEmail.endsWith('@cpp.edu')) {
      return { error: 'Invalid CPP email!' };
    }

    await db.user.update({
      where: { id: existingToken.userId! },
      data: {
        cppEmail,
        cppEmailVerified: new Date(),
        studentVerified: true,
      },
    });

    // no need to store in db anymore
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });
    return { success: 'CPP email verified! You can now add reviews.' };
  }

  // Primary email change: token was created with userId + purpose 'primary_email' in settings, used for in case user is changing their primary email to CPP email
  if (existingToken.purpose === 'primary_email' && user) {
    const newEmailIsCpp = existingToken.email
      .toLowerCase()
      .endsWith('@cpp.edu');

    const existingUser = await db.user.findUnique({
      where: { id: existingToken.userId! },
      select: { cppEmail: true, cppEmailVerified: true }, // can be null
    });

    // Keep studentVerified true if new primary is @cpp.edu OR they already have verified CPP email from adding @cpp.edu email in settings
    const studentVerified = newEmailIsCpp || !!(existingUser?.cppEmail && existingUser?.cppEmailVerified);

    await db.user.update({
      where: { id: existingToken.userId! },
      data: {
        email: existingToken.email,
        emailVerified: new Date(),
        studentVerified,
      },
    });

    // no need to store in db anymore
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });
    return { success: 'Email verified!' };
  }

  // Signup verification: no userId, no purpose, find user by token email
  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: 'Email does not exist!' };
  }

  const studentVerified = existingToken.email
    .toLowerCase()
    .endsWith('@cpp.edu');

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
      studentVerified,
    },
  });

  // no need to store in db anymore
  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: 'Email verified!' };
};

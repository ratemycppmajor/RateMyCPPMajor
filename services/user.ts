import { db } from '@/lib/db';
import type { User } from '@/app/generated/prisma/client';

/**
 * Fetches a user from the database by their email address.
 *
 * @param email - The email address of the user to look up.
 * @returns The user object if found, otherwise null.
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const user = await db.user.findUnique({ where: { email } });

    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Fetches a user from the database by their unique ID.
 *
 * @param id - The unique identifier of the user.
 * @returns The user object if found, otherwise null.
 */
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const user = await db.user.findUnique({ where: { id } });

    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

import { db } from '@/lib/db';
import type { Account } from '@/app/generated/prisma/client'; 

export const getAccountByUserId = async (userId: string): Promise<Account | null> => {
  try {
    const account = await db.account.findFirst({
      where: { userId },
    });

    return account;
  } catch {
    return null;
  }
};

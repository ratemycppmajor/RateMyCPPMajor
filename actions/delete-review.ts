'use server';

import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';

export const deleteReview = async (reviewId: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized!' };
  }

  await db.review.delete({
    where: {
      id: reviewId,
      userId: user.id,
    },
  });

  return { success: 'Review deleted successfully!' };
};

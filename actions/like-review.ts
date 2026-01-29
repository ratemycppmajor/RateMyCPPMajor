'use server';

import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';

export const likeReview = async (reviewId : string) => {
  const user = await currentUser();

  if (!user?.id) {
    return { error: 'Unauthorized' };
  }

  const exisitngLike = await db.reviewLike.findUnique({
    where: {
        userId_reviewId: {
            userId: user.id,
            reviewId
        }
    }
  })

  if (exisitngLike) {
    await db.reviewLike.delete({
        where: {
            userId_reviewId: {
                userId: user.id,
                reviewId
            }
        },
    })
    return { liked: false };

  }
  else {
    await db.reviewLike.create({
        data: {
            userId: user.id,
            reviewId
        }
    })
    return { liked: true };
  }
};

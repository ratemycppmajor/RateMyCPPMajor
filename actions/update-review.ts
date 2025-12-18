'use server';

import { z } from 'zod';

import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { RatingSchema } from '@/schemas';

const UpdateReviewSchema = z.object({
  reviewId: z.string().min(1),
  reviewText: z.string().min(60, 'Review must be at least 60 characters'),
  ratings: RatingSchema,
}).strict();

export const updateReview = async (input: z.infer<typeof UpdateReviewSchema>) => {
  const user = await currentUser();
  if (!user?.id) {
    return { error: 'Unauthorized' };
  }

  const parsed = UpdateReviewSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid data' };
  }

  const { reviewId, reviewText, ratings } = parsed.data;

  // Check if review exists and belongs to the user
  const existingReview = await db.review.findUnique({
    where: { id: reviewId },
    select: { userId: true },
  });

  if (!existingReview) {
    return { error: 'Review not found' };
  }

  if (existingReview.userId !== user.id) {
    return { error: 'Unauthorized' };
  }

  const review = await db.review.update({
    where: { id: reviewId },
    data: {
      rating: ratings.major,
      comment: reviewText,
      careerReadiness: ratings.careerReadiness,
      difficulty: ratings.difficulty,
      satisfaction: ratings.satisfaction,
    },
  });

  return { success: true, review };
};


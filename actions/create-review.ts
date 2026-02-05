'use server';

import { z } from 'zod';

import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { ReviewSchema } from '@/schemas';

export const createReview = async (input: z.infer<typeof ReviewSchema>) => {
  const user = await currentUser();
  if (!user?.id) {
    return { error: 'Unauthorized' };
  }

  const parsed = ReviewSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid data' };
  }

  const { slug, reviewText, ratings } = parsed.data;

  const major = await db.major.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!major) {
    return { error: 'Major not found' };
  }

  const exisitingReview = await db.review.findUnique({
    where: {
      userId_majorId: {
        userId: user.id,
        majorId: major.id,
      },
    },
  });

  if (exisitingReview) {
    return { error: 'You have already reviewed this major!' };
  }

  const review = await db.review.create({
    data: {
      rating: ratings.major,
      comment: reviewText,
      careerReadiness: ratings.careerReadiness,
      difficulty: ratings.difficulty,
      satisfaction: ratings.satisfaction,
      userId: user.id,
      majorId: major.id,
    },
  });

  return { success: true, review };
};

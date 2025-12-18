import { db } from '@/lib/db';
import { AddReviewWithRelations } from '@/types/major';
import { notFound } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import ReviewClient from '@/components/review/ReviewClient';

export default async function EditReview({ params } : {params : Promise<{ reviewId: string }>}) {
  const { reviewId } = await params;
  const user = await currentUser();

  if (!user?.id) {
    notFound();
  }

  const review = await db.review.findUnique({
    where: { id: reviewId },
    select: {
      id: true,
      rating: true,
      comment: true,
      careerReadiness: true,
      difficulty: true,
      satisfaction: true,
      userId: true,
      major: {
        select: {
          name: true,
          slug: true,
          department: {
            select: {
              name: true,
              college: {
                select: {
                  name: true,
                }
              }
            }
          }
        }
      }
    }
  });

  if (!review || review.userId !== user.id) {
    notFound();
  }

  const major : AddReviewWithRelations = review.major;

  return (
    <ReviewClient major={major} review={review} />
  )
}

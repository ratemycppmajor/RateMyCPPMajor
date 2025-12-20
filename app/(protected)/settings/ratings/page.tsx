import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import UserRatingClient from './UserRatingClient';

export default async function Ratings() {
  const user = await currentUser();

  if (!user?.id) {
    notFound();
  }

  const userData = await db.user.findUnique({
    where: { id: user.id },
    select: {
      reviews: {
        include: {
          major: {
            select: {
              slug: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  const userReviews = userData?.reviews || [];

  return (
    <UserRatingClient reviews={userReviews} />
  )
}

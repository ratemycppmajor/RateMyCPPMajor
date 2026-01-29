import { db } from '@/lib/db';
import MajorClient from './MajorClient';
import { MajorWithRelations } from '@/types/major';
import { notFound } from 'next/navigation';
import { currentUser } from '@/lib/auth';

export default async function Major({ params } : {params : Promise<{ slug: string }>}) {
  const { slug } = await params;
  const user = await currentUser();
  const userIdForWhere = user?.id ?? "__anonymous__";

  const major : MajorWithRelations | null = await db.major.findUnique({
    where: { slug },
    select: {
      name: true,
      imgSrc: true,
      url: true,
      description: true,
      averageGpa: true,
      slug: true,
      reviews: {
        select: {
          id: true,
          rating: true,
          careerReadiness: true,
          difficulty: true,
          satisfaction: true,
          comment: true,
          createdAt: true,
          userId: true,
          likes: { // Get the likes for the current user
            where: {
              userId: userIdForWhere,
            },
            select: {
              id: true,
            },
          },
          _count: { // Get the count of likes for the review
            select: {
              likes: true,
            },
          },
        }
      },
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
  })

  if (!major) {
    notFound();
  }

  return (
    <MajorClient major={major} />
  )
}

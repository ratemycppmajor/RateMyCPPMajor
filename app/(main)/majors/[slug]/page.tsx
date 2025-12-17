import { db } from '@/lib/db';
import MajorClient from './MajorClient';
import { MajorWithRelations } from '@/types/major';
import { notFound } from 'next/navigation';

export default async function Major({ params } : {params : Promise<{ slug: string }>}) {
  const { slug } = await params;

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

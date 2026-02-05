import { db } from '@/lib/db';
import { AddReviewWithRelations } from '@/types/major';
import { notFound } from 'next/navigation';
import ReviewClient from '@/components/review/ReviewClient';

export default async function AddReview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const major: AddReviewWithRelations | null = await db.major.findUnique({
    where: { slug },
    select: {
      name: true,
      slug: true,
      department: {
        select: {
          name: true,
          college: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!major) {
    notFound();
  }

  return <ReviewClient major={major} />;
}

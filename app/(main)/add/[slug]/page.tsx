import { db } from '@/lib/db';
import { AddMajorWithRelations } from '@/types/major';
import { notFound } from 'next/navigation';
import AddMajorClient from './AddMajorClient';

export default async function AddMajor({ params } : {params : Promise<{ slug: string }>}) {
  const { slug } = await params;

  const major : AddMajorWithRelations | null = await db.major.findUnique({
    where: { slug },
    select: {
      name: true,
      imgSrc: true,
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
  })

  if (!major) {
    notFound();
  }

  return (
    <AddMajorClient major={major} />
  )
}

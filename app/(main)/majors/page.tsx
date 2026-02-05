import { db } from '@/lib/db';
import type { CollegeWithRelations } from '@/types/major';
import MajorList from './MajorListClient';

export default async function Majors() {
  const cppColleges: CollegeWithRelations[] = await db.college.findMany({
    include: {
      departments: {
        include: {
          majors: true,
        },
      },
    },
  });

  return <MajorList colleges={cppColleges} />;
}

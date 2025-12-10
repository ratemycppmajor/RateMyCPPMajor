import { db } from '@/lib/db';
import type { CollegeWithRelations } from '@/types/major';
import MajorList from './components/major-list';

export default async function Majors() {

  const cppColleges : CollegeWithRelations[] = await db.college.findMany({
    include: {
      departments: {
        include: {
          majors: true
        }
      }
    }
  })

  return (
    <MajorList colleges={cppColleges} />
  )
}

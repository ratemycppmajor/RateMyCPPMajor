import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const majors = await db.major.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(majors)

    return NextResponse.json({ majors: majors })

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Failed to fetch majors" }, { status: 500 })
  }
}

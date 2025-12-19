import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ majors: [] });
    }

    const searchTerm = query.trim();

    const majors = await db.major.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        imgSrc: true,
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
      take: 10,
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ majors });
  } catch (error) {
    console.error('Error searching majors:', error);
    return NextResponse.json(
      { error: 'Failed to search majors' },
      { status: 500 }
    );
  }
}


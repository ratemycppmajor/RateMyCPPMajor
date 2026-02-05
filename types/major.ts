import type { Prisma } from '@/app/generated/prisma/client';

export type CollegeWithRelations = Prisma.CollegeGetPayload<{
  include: {
    departments: {
      include: {
        majors: true;
      };
    };
  };
}>;

export type MajorWithRelations = Prisma.MajorGetPayload<{
  select: {
    name: true;
    imgSrc: true;
    url: true;
    description: true;
    averageGpa: true;
    slug: true;
    reviews: {
      select: {
        id: true;
        rating: true;
        careerReadiness: true;
        difficulty: true;
        satisfaction: true;
        comment: true;
        createdAt: true;
        userId: true;
        likes: {
          select: {
            id: true;
          };
        };
        _count: {
          select: {
            likes: true;
          };
        };
      };
    };
    department: {
      select: {
        name: true;
        college: {
          select: {
            name: true;
          };
        };
      };
    };
  };
}>;

export type AddReviewWithRelations = Prisma.MajorGetPayload<{
  select: {
    name: true;
    slug: true;
    department: {
      select: {
        name: true;
        college: {
          select: {
            name: true;
          };
        };
      };
    };
  };
}>;

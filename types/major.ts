import type { Prisma } from "@/app/generated/prisma/client";

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
    name: true
    url: true;
    description: true;
    averageGpa: true;
    reviews: {
      select: {
        rating: true,
        careerReadiness: true,
        difficulty: true,
        satisfaction: true,
        comment: true,
        createdAt: true
      }
    },
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
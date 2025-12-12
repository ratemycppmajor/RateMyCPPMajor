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

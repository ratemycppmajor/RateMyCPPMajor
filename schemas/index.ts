import * as z from 'zod';

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: 'New password is required!',
      path: ['newPassword'],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: 'Password is required!',
      path: ['password'],
    },
  );

export const LoginSchema = z.object({
  email: z.email({
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
});

export const SignUpSchema = z.object({
  email: z.email({
    message: 'Email is required',
  }),
  password: z.string().min(8, {
    message: 'Minimum 8 characers required',
  }),
  name: z.string().min(1, {
    message: 'Name is required',
  }),
});

export const ResetSchema = z.object({
  email: z.email({
    message: 'Email is required',
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(8, {
    message: 'Minimum 8 characers required',
  }),
});

export const RatingSchema = z.object({
  major: z.number().int().min(1).max(5),
  careerReadiness: z.number().int().min(1).max(5),
  difficulty: z.number().int().min(1).max(5),
  satisfaction: z.number().int().min(1).max(5),
}).strict();

export const ReviewSchema = z.object({
  slug: z.string().min(1),
  reviewText: z.string().min(60, 'Review must be at least 60 characters'),
  ratings: RatingSchema,
}).strict();

import {
  LoginSchema,
  SignUpSchema,
  ResetSchema,
  NewPasswordSchema,
  RatingSchema,
  ReviewSchema,
  SettingsSchema,
} from '../index';

describe('LoginSchema', () => {
  it('accepts valid email and password', () => {
    const result = LoginSchema.safeParse({
      email: 'user@example.com',
      password: 'secret',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = LoginSchema.safeParse({
      email: 'not-an-email',
      password: 'secret',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty password', () => {
    const result = LoginSchema.safeParse({
      email: 'user@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('SignUpSchema', () => {
  it('accepts valid signup data', () => {
    const result = SignUpSchema.safeParse({
      email: 'new@example.com',
      password: 'password123',
      name: 'John Doe',
    });
    expect(result.success).toBe(true);
  });

  it('rejects password shorter than 8 characters', () => {
    const result = SignUpSchema.safeParse({
      email: 'new@example.com',
      password: 'short',
      name: 'John Doe',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty name', () => {
    const result = SignUpSchema.safeParse({
      email: 'new@example.com',
      password: 'password123',
      name: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('ResetSchema', () => {
  it('accepts valid email', () => {
    const result = ResetSchema.safeParse({ email: 'user@example.com' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = ResetSchema.safeParse({ email: 'invalid' });
    expect(result.success).toBe(false);
  });
});

describe('NewPasswordSchema', () => {
  it('accepts password 8+ characters', () => {
    const result = NewPasswordSchema.safeParse({ password: 'newpass123' });
    expect(result.success).toBe(true);
  });

  it('rejects short password', () => {
    const result = NewPasswordSchema.safeParse({ password: 'short' });
    expect(result.success).toBe(false);
  });
});

describe('RatingSchema', () => {
  it('accepts valid ratings 1-5', () => {
    const result = RatingSchema.safeParse({
      major: 3,
      careerReadiness: 4,
      difficulty: 2,
      satisfaction: 5,
    });
    expect(result.success).toBe(true);
  });

  it('rejects rating below 1', () => {
    const result = RatingSchema.safeParse({
      major: 0,
      careerReadiness: 1,
      difficulty: 1,
      satisfaction: 1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects rating above 5', () => {
    const result = RatingSchema.safeParse({
      major: 6,
      careerReadiness: 1,
      difficulty: 1,
      satisfaction: 1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects decimal values', () => {
    const result = RatingSchema.safeParse({
      major: 3.5,
      careerReadiness: 1,
      difficulty: 1,
      satisfaction: 1,
    });
    expect(result.success).toBe(false);
  });
});

describe('ReviewSchema', () => {
  const validRatings = {
    major: 3,
    careerReadiness: 4,
    difficulty: 2,
    satisfaction: 5,
  };

  it('accepts valid review with 60+ character text', () => {
    const result = ReviewSchema.safeParse({
      slug: 'computer-science',
      reviewText: 'A'.repeat(60),
      ratings: validRatings,
    });
    expect(result.success).toBe(true);
  });

  it('rejects review text shorter than 60 characters', () => {
    const result = ReviewSchema.safeParse({
      slug: 'computer-science',
      reviewText: 'Too short',
      ratings: validRatings,
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty slug', () => {
    const result = ReviewSchema.safeParse({
      slug: '',
      reviewText: 'A'.repeat(60),
      ratings: validRatings,
    });
    expect(result.success).toBe(false);
  });

  it('rejects extra keys (strict)', () => {
    const result = ReviewSchema.safeParse({
      slug: 'cs',
      reviewText: 'A'.repeat(60),
      ratings: validRatings,
      extra: 'not allowed',
    });
    expect(result.success).toBe(false);
  });
});

describe('SettingsSchema', () => {
  it('accepts optional name and email only', () => {
    const result = SettingsSchema.safeParse({
      name: 'New Name',
      email: 'new@example.com',
    });
    expect(result.success).toBe(true);
  });

  it('accepts valid CPP email', () => {
    const result = SettingsSchema.safeParse({
      cppEmail: 'student@cpp.edu',
    });
    expect(result.success).toBe(true);
  });

  it('rejects non-CPP email for cppEmail', () => {
    const result = SettingsSchema.safeParse({
      cppEmail: 'user@gmail.com',
    });
    expect(result.success).toBe(false);
  });

  it('rejects newPassword without password', () => {
    const result = SettingsSchema.safeParse({
      newPassword: 'newpass123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password without newPassword', () => {
    const result = SettingsSchema.safeParse({
      password: 'oldpass',
    });
    expect(result.success).toBe(false);
  });

  it('accepts password and newPassword together', () => {
    const result = SettingsSchema.safeParse({
      password: 'oldpass123',
      newPassword: 'newpass123',
    });
    expect(result.success).toBe(true);
  });
});

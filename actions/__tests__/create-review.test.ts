import { createReview } from '../create-review';

jest.mock('@/lib/db', () => ({
  db: {
    major: {
      findUnique: jest.fn(),
    },
    review: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('@/lib/auth', () => ({
  currentUser: jest.fn(),
}));

const { db } = require('@/lib/db');
const { currentUser } = require('@/lib/auth');

describe('createReview action', () => {
  const userId = 'user-1';
  const validInput = {
    slug: 'computer-science',
    reviewText: 'A'.repeat(60),
    ratings: {
      major: 3,
      careerReadiness: 4,
      difficulty: 2,
      satisfaction: 5,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns error when user is not authenticated', async () => {
    currentUser.mockResolvedValue(null);

    const result = await createReview(validInput);

    expect(result).toEqual({ error: 'Unauthorized' });
    expect(db.major.findUnique).not.toHaveBeenCalled();
  });

  it('returns error when user has no id', async () => {
    currentUser.mockResolvedValue({ email: 'test@test.com' });

    const result = await createReview(validInput);

    expect(result).toEqual({ error: 'Unauthorized' });
  });

  it('returns error when input fails schema validation', async () => {
    currentUser.mockResolvedValue({ id: userId });

    const result = await createReview({
      ...validInput,
      reviewText: 'Too short',
    });

    expect(result).toEqual({ error: expect.any(String) });
    expect(db.major.findUnique).not.toHaveBeenCalled();
  });

  it('returns error when major is not found', async () => {
    currentUser.mockResolvedValue({ id: userId });
    db.major.findUnique.mockResolvedValue(null);

    const result = await createReview(validInput);

    expect(db.major.findUnique).toHaveBeenCalledWith({
      where: { slug: 'computer-science' },
      select: { id: true },
    });
    expect(result).toEqual({ error: 'Major not found' });
    expect(db.review.create).not.toHaveBeenCalled();
  });

  it('returns error when user already reviewed this major', async () => {
    currentUser.mockResolvedValue({ id: userId });
    db.major.findUnique.mockResolvedValue({ id: 'major-1' });
    db.review.findUnique.mockResolvedValue({
      id: 'review-1',
      userId,
      majorId: 'major-1',
    });

    const result = await createReview(validInput);

    expect(db.review.findUnique).toHaveBeenCalledWith({
      where: {
        userId_majorId: { userId, majorId: 'major-1' },
      },
    });
    expect(result).toEqual({ error: 'You have already reviewed this major!' });
    expect(db.review.create).not.toHaveBeenCalled();
  });

  it('creates review and returns success when valid', async () => {
    currentUser.mockResolvedValue({ id: userId });
    db.major.findUnique.mockResolvedValue({ id: 'major-1' });
    db.review.findUnique.mockResolvedValue(null);
    const createdReview = {
      id: 'review-1',
      userId,
      majorId: 'major-1',
      rating: 3,
      comment: validInput.reviewText,
      careerReadiness: 4,
      difficulty: 2,
      satisfaction: 5,
    };
    db.review.create.mockResolvedValue(createdReview);

    const result = await createReview(validInput);

    expect(db.review.create).toHaveBeenCalledWith({
      data: {
        rating: 3,
        comment: validInput.reviewText,
        careerReadiness: 4,
        difficulty: 2,
        satisfaction: 5,
        userId,
        majorId: 'major-1',
      },
    });
    expect(result).toEqual({ success: true, review: createdReview });
  });
});

import { updateReview } from '../update-review';

jest.mock('@/lib/db', () => ({
  db: {
    review: { findUnique: jest.fn(), update: jest.fn() },
  },
}));

jest.mock('@/lib/auth', () => ({
  currentUser: jest.fn(),
}));

const { db } = require('@/lib/db');
const { currentUser } = require('@/lib/auth');

describe('updateReview action', () => {
  const userId = 'user-1';
  const reviewId = 'review-1';
  const validInput = {
    reviewId,
    reviewText: 'A'.repeat(60),
    ratings: {
      major: 4,
      careerReadiness: 5,
      difficulty: 3,
      satisfaction: 4,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns error when user is not authenticated', async () => {
    currentUser.mockResolvedValue(null);

    const result = await updateReview(validInput);

    expect(result).toEqual({ error: 'Unauthorized' });
    expect(db.review.findUnique).not.toHaveBeenCalled();
  });

  it('returns error when user has no id', async () => {
    currentUser.mockResolvedValue({ email: 'test@test.com' });

    const result = await updateReview(validInput);

    expect(result).toEqual({ error: 'Unauthorized' });
  });

  it('returns error when input fails schema validation', async () => {
    currentUser.mockResolvedValue({ id: userId });

    const result = await updateReview({
      ...validInput,
      reviewText: 'Too short',
    });

    expect(result).toEqual({ error: expect.any(String) });
    expect(db.review.findUnique).not.toHaveBeenCalled();
  });

  it('returns error when review is not found', async () => {
    currentUser.mockResolvedValue({ id: userId });
    db.review.findUnique.mockResolvedValue(null);

    const result = await updateReview(validInput);

    expect(db.review.findUnique).toHaveBeenCalledWith({
      where: { id: reviewId },
      select: { userId: true },
    });
    expect(result).toEqual({ error: 'Review not found' });
    expect(db.review.update).not.toHaveBeenCalled();
  });

  it('returns error when review belongs to another user', async () => {
    currentUser.mockResolvedValue({ id: userId });
    db.review.findUnique.mockResolvedValue({ userId: 'other-user-id' });

    const result = await updateReview(validInput);

    expect(result).toEqual({ error: 'Unauthorized' });
    expect(db.review.update).not.toHaveBeenCalled();
  });

  it('updates review and returns success when valid and owned by user', async () => {
    currentUser.mockResolvedValue({ id: userId });
    db.review.findUnique.mockResolvedValue({ userId });
    const updatedReview = {
      id: reviewId,
      userId,
      rating: 4,
      comment: validInput.reviewText,
      careerReadiness: 5,
      difficulty: 3,
      satisfaction: 4,
    };
    db.review.update.mockResolvedValue(updatedReview);

    const result = await updateReview(validInput);

    expect(db.review.update).toHaveBeenCalledWith({
      where: { id: reviewId },
      data: {
        rating: 4,
        comment: validInput.reviewText,
        careerReadiness: 5,
        difficulty: 3,
        satisfaction: 4,
      },
    });
    expect(result).toEqual({ success: true, review: updatedReview });
  });
});

import { likeReview } from '../like-review';

jest.mock('@/lib/db', () => ({
  db: {
    reviewLike: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock('@/lib/auth', () => ({
  currentUser: jest.fn(),
}));

const { db } = require('@/lib/db');
const { currentUser } = require('@/lib/auth');

describe('likeReview action', () => {
  const userId = 'user-1';
  const reviewId = 'review-1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns error when user is not authenticated', async () => {
    currentUser.mockResolvedValue(null);

    const result = await likeReview(reviewId);

    expect(result).toEqual({ error: 'Unauthorized' });
    expect(db.reviewLike.findUnique).not.toHaveBeenCalled();
  });

  it('returns error when user has no id', async () => {
    currentUser.mockResolvedValue({ email: 'test@test.com' });

    const result = await likeReview(reviewId);

    expect(result).toEqual({ error: 'Unauthorized' });
  });

  it('removes like and returns liked: false when user already liked', async () => {
    currentUser.mockResolvedValue({ id: userId });
    db.reviewLike.findUnique.mockResolvedValue({
      userId,
      reviewId,
    });
    db.reviewLike.delete.mockResolvedValue(undefined);

    const result = await likeReview(reviewId);

    expect(db.reviewLike.findUnique).toHaveBeenCalledWith({
      where: {
        userId_reviewId: { userId, reviewId },
      },
    });
    expect(db.reviewLike.delete).toHaveBeenCalledWith({
      where: {
        userId_reviewId: { userId, reviewId },
      },
    });
    expect(db.reviewLike.create).not.toHaveBeenCalled();
    expect(result).toEqual({ liked: false });
  });

  it('adds like and returns liked: true when user has not liked', async () => {
    currentUser.mockResolvedValue({ id: userId });
    db.reviewLike.findUnique.mockResolvedValue(null);
    db.reviewLike.create.mockResolvedValue({ userId, reviewId });

    const result = await likeReview(reviewId);

    expect(db.reviewLike.findUnique).toHaveBeenCalledWith({
      where: {
        userId_reviewId: { userId, reviewId },
      },
    });
    expect(db.reviewLike.create).toHaveBeenCalledWith({
      data: { userId, reviewId },
    });
    expect(db.reviewLike.delete).not.toHaveBeenCalled();
    expect(result).toEqual({ liked: true });
  });
});

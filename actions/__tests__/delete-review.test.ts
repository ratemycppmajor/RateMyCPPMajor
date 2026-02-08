import { deleteReview } from '../delete-review';

jest.mock('@/lib/db', () => ({
  db: {
    review: { delete: jest.fn() },
  },
}));

jest.mock('@/lib/auth', () => ({
  currentUser: jest.fn(),
}));

const { db } = require('@/lib/db');
const { currentUser } = require('@/lib/auth');

describe('deleteReview action', () => {
  const userId = 'user-1';
  const reviewId = 'review-1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns error when user is not authenticated', async () => {
    currentUser.mockResolvedValue(null);

    const result = await deleteReview(reviewId);

    expect(result).toEqual({ error: 'Unauthorized!' });
    expect(db.review.delete).not.toHaveBeenCalled();
  });

  it('calls delete with review id and user id and returns success', async () => {
    currentUser.mockResolvedValue({ id: userId });
    db.review.delete.mockResolvedValue(undefined);

    const result = await deleteReview(reviewId);

    expect(db.review.delete).toHaveBeenCalledWith({
      where: {
        id: reviewId,
        userId,
      },
    });
    expect(result).toEqual({ success: 'Review deleted successfully!' });
  });
});

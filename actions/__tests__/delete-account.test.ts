import { deleteAccount } from '../delete-account';

jest.mock('@/lib/db', () => ({
  db: {
    user: { delete: jest.fn() },
  },
}));

jest.mock('@/lib/auth', () => ({
  currentUser: jest.fn(),
}));

const { db } = require('@/lib/db');
const { currentUser } = require('@/lib/auth');

describe('deleteAccount action', () => {
  const userId = 'user-1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns error when user is not authenticated', async () => {
    currentUser.mockResolvedValue(null);

    const result = await deleteAccount();

    expect(result).toEqual({ error: 'Unauthorized!' });
    expect(db.user.delete).not.toHaveBeenCalled();
  });

  it('deletes user and returns success when authenticated', async () => {
    currentUser.mockResolvedValue({ id: userId });
    db.user.delete.mockResolvedValue(undefined);

    const result = await deleteAccount();

    expect(db.user.delete).toHaveBeenCalledWith({
      where: { id: userId },
    });
    expect(result).toEqual({ success: 'Account deleted successfully!' });
  });
});

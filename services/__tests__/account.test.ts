import { getAccountByUserId } from '../account';

jest.mock('@/lib/db', () => ({
  db: {
    account: {
      findFirst: jest.fn(),
    },
  },
}));

const { db } = require('@/lib/db');

describe('account service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAccountByUserId', () => {
    it('returns account when found', async () => {
      const mockAccount = {
        id: 'acc-1',
        userId: 'user-1',
        type: 'oauth',
        provider: 'google',
        providerAccountId: 'google-123',
        refresh_token: null,
        access_token: null,
        expires_at: null,
        token_type: null,
        scope: null,
        id_token: null,
        session_state: null,
      };
      db.account.findFirst.mockResolvedValue(mockAccount);

      const result = await getAccountByUserId('user-1');

      expect(db.account.findFirst).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
      expect(result).toEqual(mockAccount);
    });

    it('returns null when not found', async () => {
      db.account.findFirst.mockResolvedValue(null);

      const result = await getAccountByUserId('non-existent');

      expect(result).toBeNull();
    });

    it('returns null when findFirst throws', async () => {
      db.account.findFirst.mockRejectedValue(new Error('DB error'));

      const result = await getAccountByUserId('user-1');

      expect(result).toBeNull();
    });
  });
});

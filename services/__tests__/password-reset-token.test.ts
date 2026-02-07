import {
  getPasswordResetToken,
  getPasswordResetTokenByEmail,
} from '../password-reset-token';

jest.mock('@/lib/db', () => ({
  db: {
    passwordResetToken: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

const { db } = require('@/lib/db');

describe('password-reset-token service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPasswordResetToken', () => {
    it('returns token when found', async () => {
      const mockToken = {
        id: 'token-1',
        email: 'user@example.com',
        token: 'abc123',
        expires: new Date(),
      };
      db.passwordResetToken.findUnique.mockResolvedValue(mockToken);

      const result = await getPasswordResetToken('abc123');

      expect(db.passwordResetToken.findUnique).toHaveBeenCalledWith({
        where: { token: 'abc123' },
      });
      expect(result).toEqual(mockToken);
    });

    it('returns null when not found', async () => {
      db.passwordResetToken.findUnique.mockResolvedValue(null);

      const result = await getPasswordResetToken('missing');

      expect(result).toBeNull();
    });

    it('returns null and logs error when findUnique throws', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      db.passwordResetToken.findUnique.mockRejectedValue(new Error('DB error'));

      const result = await getPasswordResetToken('abc123');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getPasswordResetTokenByEmail', () => {
    it('returns token when found', async () => {
      const mockToken = {
        id: 'token-1',
        email: 'user@example.com',
        token: 'abc123',
        expires: new Date(),
      };
      db.passwordResetToken.findFirst.mockResolvedValue(mockToken);

      const result = await getPasswordResetTokenByEmail('user@example.com');

      expect(db.passwordResetToken.findFirst).toHaveBeenCalledWith({
        where: { email: 'user@example.com' },
      });
      expect(result).toEqual(mockToken);
    });

    it('returns null when not found', async () => {
      db.passwordResetToken.findFirst.mockResolvedValue(null);

      const result = await getPasswordResetTokenByEmail('missing@example.com');

      expect(result).toBeNull();
    });

    it('returns null and logs error when findFirst throws', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      db.passwordResetToken.findFirst.mockRejectedValue(new Error('DB error'));

      const result = await getPasswordResetTokenByEmail('user@example.com');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});

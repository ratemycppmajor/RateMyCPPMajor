import {
  getVerficationToken,
  getVerficationTokenByEmail,
} from '../verfication-token';

jest.mock('@/lib/db', () => ({
  db: {
    verificationToken: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

const { db } = require('@/lib/db');

describe('verfication-token service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getVerficationToken', () => {
    it('returns token when found', async () => {
      const mockToken = {
        id: 'vt-1',
        email: 'user@example.com',
        token: 'verify-abc',
        expires: new Date(),
        userId: null,
        purpose: null,
      };
      db.verificationToken.findUnique.mockResolvedValue(mockToken);

      const result = await getVerficationToken('verify-abc');

      expect(db.verificationToken.findUnique).toHaveBeenCalledWith({
        where: { token: 'verify-abc' },
      });
      expect(result).toEqual(mockToken);
    });

    it('returns null when not found', async () => {
      db.verificationToken.findUnique.mockResolvedValue(null);

      const result = await getVerficationToken('missing');

      expect(result).toBeNull();
    });

    it('returns null and logs error when findUnique throws', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      db.verificationToken.findUnique.mockRejectedValue(new Error('DB error'));

      const result = await getVerficationToken('verify-abc');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getVerficationTokenByEmail', () => {
    it('returns token when found', async () => {
      const mockToken = {
        id: 'vt-1',
        email: 'user@example.com',
        token: 'verify-abc',
        expires: new Date(),
        userId: null,
        purpose: null,
      };
      db.verificationToken.findFirst.mockResolvedValue(mockToken);

      const result = await getVerficationTokenByEmail('user@example.com');

      expect(db.verificationToken.findFirst).toHaveBeenCalledWith({
        where: { email: 'user@example.com' },
      });
      expect(result).toEqual(mockToken);
    });

    it('returns null when not found', async () => {
      db.verificationToken.findFirst.mockResolvedValue(null);

      const result = await getVerficationTokenByEmail('missing@example.com');

      expect(result).toBeNull();
    });

    it('returns null and logs error when findFirst throws', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      db.verificationToken.findFirst.mockRejectedValue(new Error('DB error'));

      const result = await getVerficationTokenByEmail('user@example.com');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});

import { getUserByEmail, getUserById } from '../user';

jest.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

const { db } = require('@/lib/db');

describe('user service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserByEmail', () => {
    it('returns user when found', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        emailVerified: null,
        image: null,
        password: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      db.user.findUnique.mockResolvedValue(mockUser);

      const result = await getUserByEmail('test@example.com');

      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('returns null when user not found', async () => {
      db.user.findUnique.mockResolvedValue(null);

      const result = await getUserByEmail('missing@example.com');

      expect(result).toBeNull();
    });

    it('returns null and logs error when findUnique throws', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      db.user.findUnique.mockRejectedValue(new Error('DB error'));

      const result = await getUserByEmail('test@example.com');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getUserById', () => {
    it('returns user when found', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        emailVerified: null,
        image: null,
        password: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      db.user.findUnique.mockResolvedValue(mockUser);

      const result = await getUserById('user-1');

      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
      expect(result).toEqual(mockUser);
    });

    it('returns null when user not found', async () => {
      db.user.findUnique.mockResolvedValue(null);

      const result = await getUserById('non-existent-id');

      expect(result).toBeNull();
    });

    it('returns null and logs error when findUnique throws', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      db.user.findUnique.mockRejectedValue(new Error('DB error'));

      const result = await getUserById('user-1');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});

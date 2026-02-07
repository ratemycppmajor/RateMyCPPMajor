import {
  generateVerificationToken,
  generatePasswordResetToken,
} from '../tokens';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-token'),
}));
// Mock the db and service functions
jest.mock('@/lib/db', () => ({
  db: {
    verificationToken: {
      delete: jest.fn(),
      create: jest.fn(),
    },
    passwordResetToken: {
      delete: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('@/services/verfication-token', () => ({
  getVerficationTokenByEmail: jest.fn(),
}));

jest.mock('@/services/password-reset-token', () => ({
  getPasswordResetTokenByEmail: jest.fn(),
}));

// Import the mocked modules
const { db } = require('@/lib/db');
const { getVerficationTokenByEmail } = require('@/services/verfication-token');
const { getPasswordResetTokenByEmail } = require('@/services/password-reset-token');

describe('lib/tokens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateVerificationToken', () => {
    it('creates verification token when no existing token', async () => {
      getVerficationTokenByEmail.mockResolvedValue(null);
      const created = {
        id: 'vt-1',
        email: 'user@example.com',
        token: 'mock-uuid-token',
        expires: expect.any(Date),
        userId: null,
        purpose: null,
      };
      // we use this when we want to check the return value of the function, we want to make sure it returns what the create function returns, so we mock the create function to return this value
      db.verificationToken.create.mockResolvedValue(created);

      const result = await generateVerificationToken('user@example.com');

      expect(getVerficationTokenByEmail).toHaveBeenCalledWith('user@example.com');
      expect(db.verificationToken.delete).not.toHaveBeenCalled();
      expect(db.verificationToken.create).toHaveBeenCalledWith({
        data: {
          email: 'user@example.com',
          token: 'mock-uuid-token',
          expires: expect.any(Date),
          userId: undefined,
          purpose: undefined,
        },
      });
      expect(result).toEqual(created);
    });

    it('deletes existing token then creates new one', async () => {
      getVerficationTokenByEmail.mockResolvedValue({
        id: 'existing-vt',
        email: 'user@example.com',
        token: 'old',
        expires: new Date(),
      });
      const created = {
        id: 'vt-2',
        email: 'user@example.com',
        token: 'mock-uuid-token',
        expires: expect.any(Date),
        userId: null,
        purpose: null,
      };
      db.verificationToken.delete.mockResolvedValue(undefined);
      db.verificationToken.create.mockResolvedValue(created);

      const result = await generateVerificationToken('user@example.com');

      expect(db.verificationToken.delete).toHaveBeenCalledWith({
        where: { id: 'existing-vt' },
      });
      // don't do toHaveBeenCalledWith because it's redundant with the first test and just focus on the delete call of this test, it's fine to but redundant
      expect(db.verificationToken.create).toHaveBeenCalled();
      expect(result).toEqual(created);
    });

    it('passes userId and purpose when provided', async () => {
      getVerficationTokenByEmail.mockResolvedValue(null);
      // essentially we are only testing that arguments we are passing to our real function returns the expected filled object values, so return empty object
      db.verificationToken.create.mockResolvedValue({});

      await generateVerificationToken('user@example.com', 'user-1', 'cpp_email');

      expect(db.verificationToken.create).toHaveBeenCalledWith({
        data: {
          email: 'user@example.com',
          token: 'mock-uuid-token',
          expires: expect.any(Date),
          userId: 'user-1',
          purpose: 'cpp_email',
        },
      });
    });
  });

  describe('generatePasswordResetToken', () => {
    it('creates password reset token when no existing token', async () => {
      getPasswordResetTokenByEmail.mockResolvedValue(null);
      const created = {
        id: 'prt-1',
        email: 'user@example.com',
        token: 'mock-uuid-token',
        expires: expect.any(Date),
      };
      db.passwordResetToken.create.mockResolvedValue(created);

      const result = await generatePasswordResetToken('user@example.com');

      expect(getPasswordResetTokenByEmail).toHaveBeenCalledWith('user@example.com');
      expect(db.passwordResetToken.delete).not.toHaveBeenCalled();
      expect(db.passwordResetToken.create).toHaveBeenCalledWith({
        data: {
          email: 'user@example.com',
          token: 'mock-uuid-token',
          expires: expect.any(Date),
        },
      });
      expect(result).toEqual(created);
    });

    it('deletes existing token then creates new one', async () => {
      getPasswordResetTokenByEmail.mockResolvedValue({
        id: 'existing-prt',
        email: 'user@example.com',
        token: 'old',
        expires: new Date(),
      });
      const created = {
        id: 'prt-2',
        email: 'user@example.com',
        token: 'mock-uuid-token',
        expires: expect.any(Date),
      };
      db.passwordResetToken.delete.mockResolvedValue(undefined);
      db.passwordResetToken.create.mockResolvedValue(created);

      const result = await generatePasswordResetToken('user@example.com');

      expect(db.passwordResetToken.delete).toHaveBeenCalledWith({
        where: { id: 'existing-prt' },
      });
      expect(db.passwordResetToken.create).toHaveBeenCalled();
      expect(result).toEqual(created);
    });
  });
});

const bcrypt = require('bcryptjs');
const AuthService = require('../src/services/authService');
const UserModel = require('../src/models/userModel');

// Mock UserModel
jest.mock('../src/models/userModel');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw error if email already exists', async () => {
      UserModel.findByEmail.mockResolvedValue({ id: '1', email: 'test@example.com' });

      await expect(AuthService.register('test@example.com', 'password123'))
        .rejects
        .toThrow('Email already in use');
    });

    it('should successfully register a new user', async () => {
      UserModel.findByEmail.mockResolvedValue(null);
      UserModel.create.mockResolvedValue({ id: '2', email: 'new@example.com', subscription_tier: 'free' });

      const result = await AuthService.register('new@example.com', 'password123');

      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe('new@example.com');
      expect(UserModel.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    it('should throw error if user does not exist', async () => {
      UserModel.findByEmail.mockResolvedValue(null);

      await expect(AuthService.login('unknown@example.com', 'password'))
        .rejects
        .toThrow('Invalid email or password');
    });
  });
});

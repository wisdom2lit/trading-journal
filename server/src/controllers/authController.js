const AuthService = require('../services/authService');
const { z } = require('zod');
const { AppError } = require('../middlewares/errorHandler');

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required')
});

const register = async (req, res, next) => {
  try {
    const { email, password } = registerSchema.parse(req.body);
    const result = await AuthService.register(email, password);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400));
    } else {
      next(error);
    }
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await AuthService.login(email, password);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400));
    } else {
      next(error);
    }
  }
};

const getMe = async (req, res, next) => {
  try {
    // req.user is populated by the authMiddleware
    res.status(200).json({
      success: true,
      data: {
        id: req.user.id,
        email: req.user.email,
        subscription_tier: req.user.subscription_tier
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, getMe };

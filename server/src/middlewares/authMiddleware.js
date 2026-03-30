const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');
const UserModel = require('../models/userModel');

const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Not authorized to access this route', 401));
  }
};

const requirePro = (req, res, next) => {
  if (req.user && req.user.subscription_tier === 'pro') {
    next();
  } else {
    return next(new AppError('This route requires a Pro subscription', 403));
  }
}

module.exports = { protect, requirePro };

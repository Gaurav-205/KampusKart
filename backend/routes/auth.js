const express = require('express');
const router = express.Router();
const passport = require('passport');
const rateLimit = require('express-rate-limit');

const {
  validateSignup,
  validateLogin,
  sanitizeInput
} = require('../middleware/validation');
const authController = require('../controllers/authController');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts, please try again after 15 minutes' }
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: 'Too many signup attempts, please try again after an hour' }
});

const { isGoogleAuthConfigured } = require('../config/passport');

const requireGoogleAuth = (req, res, next) => {
  if (!isGoogleAuthConfigured) {
    return res.status(503).json({ message: 'Google sign-in is disabled on this server' });
  }
  return next();
};

router.get('/google', requireGoogleAuth, (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })(req, res, next);
});

router.get(
  '/google/callback',
  requireGoogleAuth,
  (req, res, next) => {
    passport.authenticate('google', {
      session: false,
      failureRedirect: '/login'
    })(req, res, next);
  },
  authController.googleCallback
);

router.post('/signup', signupLimiter, sanitizeInput, validateSignup, authController.signup);
router.post('/login', loginLimiter, sanitizeInput, validateLogin, authController.login);
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: 'Too many token refresh requests, please try again later' }
});

// Password reset is disabled. authController.requestPasswordReset and resetPassword stay for re-enabling.
router.post(['/forgot-password', '/reset-password'], (req, res) => {
  res.status(503).json({ message: 'Password reset is currently disabled' });
});
router.post('/refresh', refreshLimiter, authController.refreshToken);

module.exports = router;

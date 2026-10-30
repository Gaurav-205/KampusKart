const { body, validationResult } = require('express-validator');

// Sanitize and validate user input
const sanitizeInput = (req, res, next) => {
  // Remove potentially dangerous characters
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  next();
};

const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s]+$/;
const STRONG_PASSWORD_MESSAGE =
  'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Validation rules for user registration
const validateSignup = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage(STRONG_PASSWORD_MESSAGE)
    .matches(STRONG_PASSWORD_REGEX)
    .withMessage(STRONG_PASSWORD_MESSAGE),
  body('name')
    .isLength({ min: 2, max: 50 })
    .trim()
    .escape()
    .withMessage('Name must be between 2 and 50 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        details: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];

// Validation rules for user login
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        details: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];

// Validation rules for requesting a password reset OTP
const validateForgotPassword = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  handleValidationErrors
];

// Validation rules for completing a password reset. The new password must meet the same
// policy as signup, otherwise the reset flow becomes a way to set weak passwords.
const validateResetPassword = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('otp')
    .matches(/^\d{6}$/)
    .withMessage('OTP must be a 6-digit code'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage(STRONG_PASSWORD_MESSAGE)
    .matches(STRONG_PASSWORD_REGEX)
    .withMessage(STRONG_PASSWORD_MESSAGE),
  handleValidationErrors
];

// Validation rules for profile updates
const validateProfileUpdate = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .trim()
    .escape()
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^[+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('major')
    .optional()
    .isLength({ min: 2, max: 100 })
    .trim()
    .escape()
    .withMessage('Major must be between 2 and 100 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        details: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];

// Validation rules for complaints
const validateComplaint = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .isIn(['Academic', 'Administrative', 'Facilities', 'IT', 'Security', 'Other'])
    .withMessage('Invalid category selected'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        message: 'Validation failed',
        details: errors.array().map(err => ({
          field: err.path,
          message: err.msg,
          value: err.value
        }))
      });
    }
    next();
  }
];

// Validation rules for lost/found items
const validateLostFoundItem = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('type')
    .isIn(['lost', 'found'])
    .withMessage('Type must be either "lost" or "found"'),
  body('location')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Location must be between 3 and 100 characters if provided'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        message: 'Validation failed',
        details: errors.array().map(err => ({
          field: err.path,
          message: err.msg,
          value: err.value
        }))
      });
    }
    next();
  }
];

// Partial-update validation for complaints: same limits as create, but every field is optional
const validateComplaintUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .optional()
    .isIn(['Academic', 'Administrative', 'Facilities', 'IT', 'Security', 'Other'])
    .withMessage('Invalid category selected'),
  body('statusComment')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Status comment cannot exceed 500 characters'),
  handleValidationErrors
];

// Partial-update validation for lost/found items
const validateLostFoundItemUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('type')
    .optional()
    .isIn(['lost', 'found'])
    .withMessage('Type must be either "lost" or "found"'),
  body('location')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Location must be between 3 and 100 characters if provided'),
  handleValidationErrors
];

module.exports = {
  sanitizeInput,
  validateForgotPassword,
  validateResetPassword,
  validateComplaintUpdate,
  validateLostFoundItemUpdate,
  validateSignup,
  validateLogin,
  validateProfileUpdate,
  validateComplaint,
  validateLostFoundItem
}; 
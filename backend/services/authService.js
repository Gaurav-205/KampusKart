const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const userRepository = require('../repositories/userRepository');
const { isAdminEmail } = require('../utils/adminUtils');
const { ServiceError } = require('./serviceError');

let transporter = null;
try {
  if (process.env.EMAIL_SERVICE && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
} catch (error) {
  transporter = null;
}

const ensureJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new ServiceError('Server configuration error', 500);
  }
};

const OTP_TTL_MS = 15 * 60 * 1000;
// A 6-digit OTP has 900k possibilities; cap guesses per issued OTP so it cannot be brute-forced
const MAX_OTP_ATTEMPTS = 5;
const GENERIC_RESET_MESSAGE = 'If that email is registered, an OTP has been sent';

const hashOtp = (otp) => crypto.createHash('sha256').update(String(otp)).digest('hex');

const createToken = (userId) => {
  ensureJwtSecret();
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const signup = async ({ email, password, name }) => {
  const normalizedEmail = email.toLowerCase();
  const existingUser = await userRepository.findByEmail(normalizedEmail);
  if (existingUser) {
    throw new ServiceError('User already exists', 400);
  }

  const user = await userRepository.create({
    email: normalizedEmail,
    password,
    name: name.trim()
  });

  const token = createToken(user._id);
  const isAdmin = isAdminEmail(user.email);

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      isAdmin
    }
  };
};

const login = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase();
  const user = await userRepository.findByEmail(normalizedEmail);
  if (!user) {
    throw new ServiceError('Invalid credentials', 400);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ServiceError('Invalid credentials', 400);
  }

  const token = createToken(user._id);
  const isAdmin = isAdminEmail(user.email);

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      isAdmin
    }
  };
};

const requestPasswordReset = async ({ email }) => {
  const normalizedEmail = email.toLowerCase();
  const user = await userRepository.findByEmail(normalizedEmail);
  if (!user) {
    return { message: GENERIC_RESET_MESSAGE };
  }

  const otp = crypto.randomInt(100000, 1000000).toString();

  user.resetPasswordOTP = hashOtp(otp);
  user.resetPasswordExpires = Date.now() + OTP_TTL_MS;
  user.resetPasswordAttempts = 0;
  await user.save();

  if (!transporter) {
    return { message: GENERIC_RESET_MESSAGE };
  }

  try {
    await transporter.sendMail({
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. This OTP is valid for 15 minutes.`
    });

    return { message: GENERIC_RESET_MESSAGE };
  } catch (error) {
    throw new ServiceError('Error sending email. Please try again later.', 500);
  }
};

const resetPassword = async ({ email, otp, newPassword }) => {
  const normalizedEmail = email.toLowerCase();
  const user = await userRepository.findByEmail(normalizedEmail);
  // Same response for unknown accounts and bad OTPs so the endpoint cannot enumerate users
  if (!user) {
    throw new ServiceError('Invalid or expired OTP', 400);
  }

  const now = Date.now();
  if (
    !user.resetPasswordOTP ||
    !user.resetPasswordExpires ||
    user.resetPasswordExpires < now ||
    (user.resetPasswordAttempts || 0) >= MAX_OTP_ATTEMPTS
  ) {
    throw new ServiceError('Invalid or expired OTP', 400);
  }

  const otpMatch = crypto.timingSafeEqual(
    Buffer.from(user.resetPasswordOTP, 'hex'),
    Buffer.from(hashOtp(otp), 'hex')
  );

  if (!otpMatch) {
    user.resetPasswordAttempts = (user.resetPasswordAttempts || 0) + 1;
    if (user.resetPasswordAttempts >= MAX_OTP_ATTEMPTS) {
      user.resetPasswordOTP = undefined;
      user.resetPasswordExpires = undefined;
    }
    await user.save();
    throw new ServiceError('Invalid or expired OTP', 400);
  }

  user.password = newPassword;
  user.resetPasswordOTP = undefined;
  user.resetPasswordExpires = undefined;
  user.resetPasswordAttempts = 0;
  await user.save();

  return { message: 'Password reset successfully' };
};

const refreshToken = async ({ token }) => {
  if (!token) {
    throw new ServiceError('No token provided', 401);
  }

  ensureJwtSecret();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Do not mint fresh tokens for accounts that have since been deleted
    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      throw new ServiceError('User not found', 401);
    }
    return { token: createToken(user._id) };
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }
    if (error.name === 'TokenExpiredError') {
      throw new ServiceError('Token expired', 401);
    }
    throw new ServiceError('Invalid token', 401);
  }
};

const buildGoogleRedirectUrl = ({ user }) => {
  const token = createToken(user._id);
  const frontendUrl = (
    process.env.FRONTEND_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://kampuskart.netlify.app'
      : 'http://localhost:3000')
  ).replace(/\/$/, '');

  return `${frontendUrl}/auth/google/callback?token=${token}`;
};

module.exports = {
  signup,
  login,
  requestPasswordReset,
  resetPassword,
  refreshToken,
  buildGoogleRedirectUrl
};

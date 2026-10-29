jest.mock('../../repositories/userRepository');

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const userRepository = require('../../repositories/userRepository');
const authService = require('../../services/authService');

const hash = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

const userWithOtp = (otp, overrides = {}) => ({
  _id: 'u1',
  email: 'student@example.com',
  resetPasswordOTP: hash(otp),
  resetPasswordExpires: Date.now() + 60 * 1000,
  resetPasswordAttempts: 0,
  save: jest.fn(),
  ...overrides,
});

describe('authService.resetPassword', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-key';
  });

  test('returns the same error for unknown accounts as for a wrong OTP', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    await expect(
      authService.resetPassword({
        email: 'nobody@example.com',
        otp: '123456',
        newPassword: 'Str0ng!pass',
      })
    ).rejects.toMatchObject({ status: 400, message: 'Invalid or expired OTP' });
  });

  test('counts failed attempts and invalidates the OTP after five', async () => {
    const user = userWithOtp('123456');
    userRepository.findByEmail.mockResolvedValue(user);

    for (let i = 0; i < 5; i += 1) {
      await expect(
        authService.resetPassword({ email: user.email, otp: '000000', newPassword: 'Str0ng!pass' })
      ).rejects.toMatchObject({ status: 400 });
    }

    expect(user.resetPasswordAttempts).toBe(5);
    expect(user.resetPasswordOTP).toBeUndefined();

    // Even the correct OTP no longer works once it has been burned
    await expect(
      authService.resetPassword({ email: user.email, otp: '123456', newPassword: 'Str0ng!pass' })
    ).rejects.toMatchObject({ status: 400 });
  });

  test('resets the password and clears OTP state on success', async () => {
    const user = userWithOtp('654321', { resetPasswordAttempts: 2 });
    userRepository.findByEmail.mockResolvedValue(user);

    await expect(
      authService.resetPassword({ email: user.email, otp: '654321', newPassword: 'Str0ng!pass' })
    ).resolves.toEqual({ message: 'Password reset successfully' });

    expect(user.password).toBe('Str0ng!pass');
    expect(user.resetPasswordOTP).toBeUndefined();
    expect(user.resetPasswordAttempts).toBe(0);
    expect(user.save).toHaveBeenCalled();
  });
});

describe('authService.requestPasswordReset', () => {
  test('stores a hashed 6-digit OTP generated with a CSPRNG and resets attempts', async () => {
    const user = { email: 'student@example.com', resetPasswordAttempts: 4, save: jest.fn() };
    userRepository.findByEmail.mockResolvedValue(user);
    const randomInt = jest.spyOn(crypto, 'randomInt');

    await authService.requestPasswordReset({ email: user.email });

    expect(randomInt).toHaveBeenCalledWith(100000, 1000000);
    expect(user.resetPasswordOTP).toMatch(/^[a-f0-9]{64}$/);
    expect(user.resetPasswordAttempts).toBe(0);
    randomInt.mockRestore();
  });
});

describe('authService.refreshToken', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-key';
  });

  test('refuses to refresh tokens for deleted accounts', async () => {
    userRepository.findById.mockResolvedValue(null);
    const token = jwt.sign({ userId: 'gone' }, process.env.JWT_SECRET);

    await expect(authService.refreshToken({ token })).rejects.toMatchObject({ status: 401 });
  });

  test('issues a new token for existing users', async () => {
    userRepository.findById.mockResolvedValue({ _id: 'u1' });
    const token = jwt.sign({ userId: 'u1' }, process.env.JWT_SECRET);

    const result = await authService.refreshToken({ token });
    expect(jwt.verify(result.token, process.env.JWT_SECRET).userId).toBe('u1');
  });
});

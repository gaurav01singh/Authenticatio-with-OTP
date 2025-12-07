const UserRepository = require('../repositories/userRepository');
const OTPService = require('../services/otpService');
const EmailService = require('../services/emailService');
const TokenService = require('../services/tokenService');

class AuthController {
  // Step 1: User Registration (Initiate OTP)
  static async signup(req, res, next) {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await UserRepository.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Generate and send OTP
      const otpResult = await OTPService.createOTP(email, 'signup');
      if (!otpResult.success) {
        return res.status(500).json({ message: 'Failed to generate OTP' });
      }

      const emailResult = await EmailService.sendOTP(email, otpResult.otp);
      if (!emailResult.success) {
        return res.status(500).json({ message: 'Failed to send OTP' });
      }

      // Store signup data temporarily (in practice, use session/cache)
      res.status(200).json({
        success: true,
        message: 'OTP sent to your email',
        data: {
          email,
          name,
          password, // In production, don't send password back
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Step 2: Verify OTP and Complete Signup
  static async verifySignupOTP(req, res, next) {
    try {
      const { email, otp, name, password } = req.body;

      // Verify OTP
      const otpVerification = await OTPService.verifyOTP(email, otp, 'signup');
      if (!otpVerification.success) {
        return res.status(400).json({ message: otpVerification.message });
      }

      // Create user
      const user = await UserRepository.create({
        name,
        email,
        password,
        isEmailVerified: true,
      });

      // Send welcome email
      await EmailService.sendWelcomeEmail(email, name);

      // Generate token
      const token = TokenService.generateToken(user._id);

      res.status(201).json({
        success: true,
        message: 'Signup successful',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Step 1: Login - Request OTP
  static async requestLoginOTP(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      // Check if user exists
      const user = await UserRepository.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Generate and send OTP
      const otpResult = await OTPService.createOTP(email, 'login');
      if (!otpResult.success) {
        return res.status(500).json({ message: 'Failed to generate OTP' });
      }

      const emailResult = await EmailService.sendOTP(email, otpResult.otp);
      if (!emailResult.success) {
        return res.status(500).json({ message: 'Failed to send OTP' });
      }

      res.status(200).json({
        success: true,
        message: 'OTP sent to your email',
      });
    } catch (error) {
      next(error);
    }
  }

  // Step 2: Login - Verify OTP
  static async loginWithOTP(req, res, next) {
    try {
      const { email, otp } = req.body;

      // Verify OTP
      const otpVerification = await OTPService.verifyOTP(email, otp, 'login');
      if (!otpVerification.success) {
        return res.status(400).json({ message: otpVerification.message });
      }

      // Get user
      const user = await UserRepository.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Generate token
      const token = TokenService.generateToken(user._id);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get current user profile
  static async getProfile(req, res, next) {
    try {
      const user = await UserRepository.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;

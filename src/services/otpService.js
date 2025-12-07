const crypto = require('crypto');
const OTP = require('../models/Otp');

class OTPService {
  // Generate random OTP
  static generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }

  // Create and save OTP
  static async createOTP(email, purpose = 'signup') {
    try {
      // Delete existing OTP for this email
      await OTP.deleteMany({ email, purpose });

      const otp = this.generateOTP(parseInt(process.env.OTP_LENGTH) || 6);
      const otpRecord = new OTP({
        email,
        otp,
        purpose,
      });

      await otpRecord.save();
      return { success: true, otp };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Verify OTP
  static async verifyOTP(email, otp, purpose = 'signup') {
    try {
      const otpRecord = await OTP.findOne({
        email,
        purpose,
        isUsed: false,
      });

      if (!otpRecord) {
        return { success: false, message: 'OTP not found or expired' };
      }

      // Check max attempts
      if (otpRecord.attempts >= parseInt(process.env.MAX_OTP_ATTEMPTS)) {
        await OTP.deleteOne({ _id: otpRecord._id });
        return { success: false, message: 'Maximum OTP attempts exceeded' };
      }

      // Verify OTP
      if (otpRecord.otp !== otp) {
        otpRecord.attempts += 1;
        await otpRecord.save();
        return { success: false, message: 'Invalid OTP' };
      }

      // Mark as used
      otpRecord.isUsed = true;
      await otpRecord.save();

      return { success: true, message: 'OTP verified successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Check if OTP exists for email
  static async otpExists(email) {
    const otp = await OTP.findOne({ email, isUsed: false });
    return !!otp;
  }
}

module.exports = OTPService;

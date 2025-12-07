const OTP = require('../models/Otp');

class OTPRepository {
  static async create(otpData) {
    return await OTP.create(otpData);
  }

  static async findByEmail(email, purpose) {
    return await OTP.findOne({ email, purpose, isUsed: false });
  }

  static async deleteByEmail(email, purpose) {
    return await OTP.deleteMany({ email, purpose });
  }

  static async update(id, updateData) {
    return await OTP.findByIdAndUpdate(id, updateData, { new: true });
  }
}

module.exports = OTPRepository;

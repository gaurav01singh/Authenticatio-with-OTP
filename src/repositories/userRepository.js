const User = require('../models/User');

class UserRepository {
  static async create(userData) {
    return await User.create(userData);
  }

  static async findByEmail(email) {
    return await User.findOne({ email });
  }

  static async findById(id) {
    return await User.findById(id);
  }

  static async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  static async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  static async findByEmailWithPassword(email) {
    return await User.findOne({ email }).select('+password');
  }
}

module.exports = UserRepository;

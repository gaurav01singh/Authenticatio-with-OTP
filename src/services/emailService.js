const transporter = require('../config/email');

class EmailService {
  static async sendOTP(email, otp) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Your OTP Code',
        html: `
          <h2>Email Verification</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <h3 style="color: #2563eb;">${otp}</h3>
          <p>This OTP is valid for ${process.env.OTP_EXPIRY} minutes.</p>
          <p>Do not share this code with anyone.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

  static async sendWelcomeEmail(email, name) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Welcome to Our Application',
        html: `
          <h2>Welcome, ${name}!</h2>
          <p>Your account has been successfully created and verified.</p>
          <p>You can now log in with your credentials.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = EmailService;

const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateSignup, validateLoginSignup } = require('../middleware/validator');

const router = express.Router();

// Signup routes
router.post('/signup', validateSignup, authController.signup);
router.post('/verify-signup-otp', validateLoginSignup, authController.verifySignupOTP);

// Login routes
router.post('/request-login-otp', authController.requestLoginOTP);
router.post('/login-with-otp', validateLoginSignup, authController.loginWithOTP);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;

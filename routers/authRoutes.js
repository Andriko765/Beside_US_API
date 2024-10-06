const express = require('express');
const {
	registerUser,
	loginUser,
	confirmEmail,
} = require('../controllers/authController');

const { forgotPassword, resetPassword } = require('../controllers/forgotPass');

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get(`/confirm/:token`, confirmEmail);
router.get('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;

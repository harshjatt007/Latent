const express = require('express');
const { signup, signin, checkAuth } = require('../controllers/authController');
const { verifyToken } = require('../middleware/verifyToken');

const router = express.Router();

// Signup route
router.get('/check-auth', verifyToken, checkAuth);
router.post('/signup', signup);
router.post('/login', signin);

module.exports = router;
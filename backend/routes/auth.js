const express = require('express');
const { signup, signin, checkAuth, updateProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/verifyToken');

const router = express.Router();

// Auth routes
router.get('/check-auth', verifyToken, checkAuth);
router.post('/signup', signup);
router.post('/login', signin);
router.post('/updateProfile', verifyToken, updateProfile);

module.exports = router;
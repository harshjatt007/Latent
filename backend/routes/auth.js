const express = require('express');
const { signup, signin, checkAuth, updateProfile, getPendingRequests, approveUser } = require('../controllers/authController');
const { verifyToken } = require('../middleware/verifyToken');

const router = express.Router();

// Auth routes
router.get('/check-auth', verifyToken, checkAuth);
router.post('/signup', signup);
router.post('/login', signin);
router.post('/updateProfile', verifyToken, updateProfile);

// Admin routes
router.get('/pending-requests', verifyToken, getPendingRequests);
router.post('/approve-user', verifyToken, approveUser);

module.exports = router;
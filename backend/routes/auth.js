const express = require('express');
const { signup, signin, checkAuth, updateProfile, getPendingRoleRequests, approveRoleRequest } = require('../controllers/authController');
const { verifyToken } = require('../middleware/verifyToken');

const router = express.Router();

// Auth routes
router.get('/check-auth', verifyToken, checkAuth);
router.post('/signup', signup);
router.post('/login', signin);
router.post('/updateProfile', verifyToken, updateProfile);

// Admin routes
router.get('/pending-role-requests', verifyToken, getPendingRoleRequests);
router.post('/approve-role-request', verifyToken, approveRoleRequest);

module.exports = router;
const express = require('express');
const { handleContactForm } = require('../controllers/contactController');

const router = express.Router();

router.post('/contact', handleContactForm);

module.exports = router;

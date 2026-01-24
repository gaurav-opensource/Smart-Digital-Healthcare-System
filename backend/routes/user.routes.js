const express = require('express');
const router = express.Router();

const authController = require('../controllers/user.controller');
const { auth } = require('../middleware/auth');
const { restrictTo } = require('../middleware/role');


// Register a new user
router.post('/register', authController.register);

// Login an existing user
router.post('/login', authController.login);

// Get user profile (only logged-in users with "user" role)
router.get('/profile', auth, restrictTo('user'), authController.profile);

// Search doctors
router.get('/search-doctors', authController.searchDoctors);



module.exports = router;

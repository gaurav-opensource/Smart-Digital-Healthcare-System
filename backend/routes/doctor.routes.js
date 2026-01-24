const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const { auth } = require('../middleware/auth');
const { restrictTo } = require('../middleware/role');
const Doctor = require('../models/doctor.model');

// Register doctor 
router.post('/register', doctorController.registerDoctor);

// Login
router.post('/login', doctorController.loginDoctor);

// Doctor profile 
router.get('/profile', auth, doctorController.doctorProfile);

//get doctor profile basis of doctor id
router.get('/profile/:id',  doctorController.GetdoctorProfile);

// Admin fetches unverified doctors
router.get('/unverified', auth, restrictTo('admin'), doctorController.getUnverifiedDoctors);


router.put('/update-profile', auth, doctorController.updateDoctorProfile);

router.get('/getdoctor', doctorController.getDoctors);

// Export the router
module.exports = router;

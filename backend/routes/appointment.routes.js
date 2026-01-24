const express = require('express');
const router = express.Router();

const {
  createAppointment,
  getAppointmentsByUser,
  getAppointmentsByDoctor,
  uploadTestReport,
  getAppointmentById,
  getAppointmentByRoomId,
  markAppointmentCompleted,
  uploadPrescription,
} = require('../controllers/appointment.controller');

const { auth } = require('../middleware/auth');
const { restrictTo } = require('../middleware/role');


// Create a new appointment
router.post('/', auth, createAppointment);

// Get all appointments for a specific user
router.get('/user/:userId', auth, restrictTo('user'), getAppointmentsByUser);

// Get all appointments for a specific doctor
router.get('/doctor/:doctorId', auth, restrictTo('doctor'), getAppointmentsByDoctor);

// Get details of a single appointment by appointment ID
router.get('/:appointmentId', auth, restrictTo('user'), getAppointmentById);

// Upload test report for an appointment (user only)
router.put('/:id/test-upload', auth, restrictTo('user'), uploadTestReport);

// Upload prescription for an appointment (doctor only)
router.put('/:id/test-prescription', auth, restrictTo('doctor'), uploadPrescription);

// Get appointment using room ID for video call
router.get('/:id', auth, restrictTo('user'), getAppointmentByRoomId);

// Mark an appointment as completed (user only)
router.put('/:id/complete', auth, restrictTo('user'), markAppointmentCompleted);



// Export the router
module.exports = router;

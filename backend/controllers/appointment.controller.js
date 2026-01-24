const Appointment = require('../models/appointment.model');
const Doctor = require('../models/doctor.model');
const User = require('../models/user.model');
const sendVideoCallReminder = require('../utils/emailService');


//Create new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { userId, doctorId, appointmentDate, description } = req.body;

    // Validate input
    if (!userId || !doctorId || !appointmentDate || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Split date and time
    const [date, time] = appointmentDate.split("T");

    // Check if doctor already has appointment
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date,
      time,
    });
    
    // If exists, return error
    if (existingAppointment) {
      return res.status(400).json({
        message: "Doctor already has an appointment at this time",
      });
    }

    const doctor = await Doctor.findById(doctorId);

    // If doctor not found
    if (!doctor)
      return res.status(404).json({ message: "Doctor not found" });

    // Create and save appointment
    const appointment = new Appointment({
      user: userId,
      doctor: doctorId,
      date,
      time,
      description,
    });

    await appointment.save();

    const user = await User.findById(userId);

    // Send reminder emails
    sendVideoCallReminder({ user, doctor, appointment }).catch((err) => {
      console.error("Error sending video call reminder:", err);
    });

    res.status(201).json({
      message: "Appointment created successfully. For video call details, check your email.",
      appointment,
    });

  } catch (error) {
    console.error("Appointment creation error:", error);
    res.status(500).json({
      message: "Error creating appointment",
      error: error.message,
    });
  }
};

// Get Appointment For User
exports.getAppointmentsByUser = async (req, res) => {
 try {
    const { userId } = req.params;


    // Fetch appointments for the user
    const appointments = await Appointment.find({ user: userId })
      .populate('doctor', 'name specialization location') // get doctor details
      .sort({ date: 1 });
    

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments', error });
  }
};

//Get Appointment for Doctor
exports.getAppointmentsByDoctor = async (req, res) => {
  try {
    //get doctor id from params
    const { doctorId } = req.params;
    const { completed } = req.query; 

    // Build query object
    const query = { doctor: doctorId };

    // Optional filtering
    if (completed === 'true') query.isCompleted = true;
    else if (completed === 'false') query.isCompleted = false;
    
    // Fetch appointments for the doctor
    const appointments = await Appointment.find(query)
      .populate('user', 'name email')
      .sort({ date: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ message: 'Error fetching doctor appointments', error: error.message });
  }
};

// Upload Report
exports.uploadTestReport= async (req, res) => {
 try {

    const appointmentId = req.params.id;
    const { testUpload } = req.body; 
    
    // Validate input
    if (!testUpload) {
      return res.status(400).json({ success: false, message: 'Test report URL is required', });
    }

    // Update appointment with test report URL
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { testReports: testUpload },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Test report uploaded successfully',
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload test report',
      error: error.message,
    });
  }
};


//Upload Prescription
exports.uploadPrescription = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { testUpload } = req.body; 
    
    // Validate input
    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    if (!testUpload) { 
      return res.status(400).json({
        success: false,
        message: 'Prescription URL is required',
      });
    }

   
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { prescription: testUpload },
      { new: true }
    );

    // Check if appointment exists
    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Success response
    res.status(200).json({
      success: true,
      message: 'Prescription uploaded successfully',
      appointment: updatedAppointment,
    });

  } catch (err) {
    console.error("Prescription upload error:", err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to upload prescription',
      error: err.message,
    });
  }
};

//Get appointment by id
exports.getAppointmentById = async (req, res) => {
  try {
    // Get appointment ID from params
    const { appointmentId } = req.params;

    // Find appointment by ID
    const appointment = await Appointment.findById(appointmentId)
      .populate('doctor', 'name _id')
      .populate('user', 'name _id');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointment', error: error.message });
  }
};



// Get appintment by unique room id
exports.getAppointmentByRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;
    // Find appointment by room ID
    const appointment = await Appointment.findOne({ roomId });
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Error finding appointment" });
  }
};



//mark appointment as completed after vidoes call
exports.markAppointmentCompleted = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find appointment by ID
    const appointment = await Appointment.findById(userId); 
    if (!appointment) {
      return res.status(404).json({ message: "Not found" });
    }
    
    // Mark as completed
    appointment.isCompleted = true;

    // Save changes
    await appointment.save();
    res.status(200).json({ message: "Appointment Completed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



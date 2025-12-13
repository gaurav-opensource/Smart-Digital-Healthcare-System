const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const Doctor = require('../models/doctor.model');

//doctor Schema
const doctorRegisterSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  location: Joi.string().required(),
  licenseNumber: Joi.string().required(),
  phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{9,14}$/).required(),
  fees: Joi.number().positive().integer().required(),
  specialization: Joi.string().valid(
    'Cardiology', 'General Physician', 'Orthopedics', 'Pediatrics', 'Neurology', 'Dermatology', 'Other'
  ).required(),
  profilePhoto: Joi.string().uri().required(),    
  certification: Joi.string().uri().required(),    
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Handle doctor register functionality
exports.registerDoctor = async (req, res) => {
  try {
    // 1. Validate request body
    const { error } = doctorRegisterSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const {
      name, email, password, location,
      licenseNumber, phoneNumber, fees,
      specialization, profilePhoto, certification,about
    } = req.body;

    // 2. Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) return res.status(400).json({ message: 'Email already exists' });

   
    if (!profilePhoto || !certification) {
      return res.status(400).json({ message: "Photo or certificate missing" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 12);

   
    const doctor = new Doctor({
      name,
      email,
      password: hashedPassword,
      location,
      licenseNumber,
      phoneNumber,
      fees,
      specialization,
      about,
      profilePhoto,      
      certification,     
      isVerified: false  // Admin approval required
    });

    // 6. Save to database
    await doctor.save();

    res.status(201).json({ message: 'Doctor registered successfully. Awaiting admin verification.' });

  } catch (error) {
    console.error('Doctor Register Error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Handle doctor login functionality
exports.loginDoctor = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email, role: 'doctor' });
    if (!doctor) return res.status(401).json({ message: 'Invalid credentials' });

    if (!doctor.isVerified) {
      return res.status(403).json({ message: 'Doctor not verified by admin yet' });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(401).json({ message: 'Password is Wrong Please try again' });

    const token = jwt.sign({ userId: doctor._id, role: doctor.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        role: doctor.role,
        fees: doctor.fees,
        profilePhoto: doctor.profilePhoto || null,
      },
    });
  } catch (error) {
    console.error('Doctor Login Error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Doctor profile
exports.doctorProfile = (req, res) => {
  const user = req.user;
  if (!user || user.role !== 'doctor') {
    return res.status(403).json({ message: 'Access denied: not a doctor' });
  }

  res.status(200).json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    location: user.location,
    phoneNumber: user.phoneNumber,
    address: user.address,
    availability:user.availability,
    fees: user.fees,
    specialization: user.specialization,
    profilePhoto: user.profilePhoto || null,
    certification: user.certification || null,
    about:user.about,
    experience:user.experience,
    achievements:user.achievements,
    other:user.otherSS,
  });
};

//Get  all un verified doctor
exports.getUnverifiedDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isVerified: false }).select('-password');
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Fetch unverified doctors error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

//Get doctor basis of id

exports.GetdoctorProfile = async (req, res) => {
  try {
    const doctorId = req.params.id;

    // Fetch doctor info
    const doctor = await Doctor.findById(doctorId)
      .select("-password");     // remove password

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.json(doctor);

  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//Update doctor profile
exports.updateDoctorProfile = async (req, res) => {
  try {
    
    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const {
      name,
      email,
      phoneNumber,
      location,
      address,
      availability,
      specialization,
      fees,
      about,
      experience,
      achievements,
      other,
      profilePhoto,
      certification,
    } = req.body;

    if (name !== undefined) doctor.name = name;
    if (email !== undefined) doctor.email = email;
    if (phoneNumber !== undefined) doctor.phoneNumber = phoneNumber;
    if (location !== undefined) doctor.location = location;
    if (address !== undefined) doctor.address = address;
    if (availability !== undefined) doctor.availability = availability;
    if (specialization !== undefined) doctor.specialization = specialization;
    if (fees !== undefined) doctor.fees = fees;
    if (about !== undefined) doctor.about = about;
    if (experience !== undefined) doctor.experience = experience;
    if (achievements !== undefined) doctor.achievements = achievements;
    if (other !== undefined) doctor.other = other;

    // File/image fields handle karein
    if (profilePhoto !== undefined) doctor.profilePhoto = profilePhoto;
    if (certification !== undefined) doctor.certification = certification;

    await doctor.save();

    res.status(200).json({
      message: 'Doctor profile updated successfully',
      doctor,
    });
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

// Filter doctors based on maxFees and location
exports.getDoctors = async (req, res) => {
  try {
    const { location, specialization, minFees, maxFees } = req.query;

    // Build dynamic filter
    let filter = {};

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (specialization) {
      filter.specialization = { $regex: specialization, $options: 'i' };
    }

    if (minFees || maxFees) {
      filter.fees = {};
      if (minFees) filter.fees.$gte = Number(minFees);
      if (maxFees) filter.fees.$lte = Number(maxFees);
    }

    const doctors = await Doctor.find({ ...filter, isVerified: true }).select(
      '-password' 
    );

    res.status(200).json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error while fetching doctors' });
  }
};





const User = require('../models/user.model');
const Doctor = require('../models/doctor.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Validation Schema of register
const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    location: Joi.string().required(),
    phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{9,14}$/),
});

// Validation Schema of login
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});


// Handle user register functionality
exports.register = async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { name, email, password, location, phoneNumber } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            location,
            phoneNumber,
            role: 'user',
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Handle login register functionality
exports.login = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                location: user.location,
                phoneNumber: user.phoneNumber,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


//Get user profile
exports.profile = (req, res) => {
    const user = req.user;
    // Ensure the user is authenticated
    if (!user) return res.status(400).json({ message: 'User not found' });

    const userProfile = {
        id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        phoneNumber: user.phoneNumber,
        role: user.role,
        healthMetrics: user.healthMetrics,
    };

    res.status(200).json(userProfile);
};


//Update profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, email, password, location, phoneNumber } = req.body;

        const updateFields = {};
        // Only add fields that are provided
        if (name) updateFields.name = name;
        if (email) updateFields.email = email;
        if (location) updateFields.location = location;
        if (phoneNumber) updateFields.phoneNumber = phoneNumber;
        
        // If password is provided, hash it before updating
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 12);
            updateFields.password = hashedPassword;
        }

        // Update user in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                location: updatedUser.location,
                phoneNumber: updatedUser.phoneNumber,
                role: updatedUser.role,
            },
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.searchDoctors = async (req, res) => {
  console.log("Searching doctors with filters:", req.query);
  const { specialization, location, maxFees, minRating, sort } = req.query;

  let filter = { isVerified: true };

  if (specialization) filter.specialization = specialization;
  if (location) filter.location = location;
  if (maxFees) filter.fees = { $lte: Number(maxFees) };
  if (minRating) filter.rating = { $gte: Number(minRating) };

  let query = Doctor.find(filter);

  // 🔥 SMART SORTING
  if (sort === "best") {
    query = query.sort({
      rating: -1,   // highest rating first
      fees: 1,      // lower fees better
      experience: -1
    });
  }

  const doctors = await query.limit(20);
  res.json(doctors);
};

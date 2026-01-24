const User = require('../models/user.model'); 
const Doctor = require('../models/doctor.model');
const Admin = require('../models/admin.model');


// Role-Based Access Control Middleware
const restrictTo = (...roles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'User not authenticated' });
            }

            let user;
            
            if (req.user.role === 'user') {
                user = await User.findById(req.user._id);
            } else if (req.user.role === 'doctor') {
                user = await Doctor.findById(req.user._id);
            } else if (req.user.role === 'admin') {
                user = await Admin.findById(req.user._id);
            }

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (!roles.includes(user.role)) {
                return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
            }

            next();
        } catch (error) {
            console.error('Role restriction error:', error);
            res.status(500).json({ message: 'Server error during role check' });
        }
    };
};

module.exports = { restrictTo };
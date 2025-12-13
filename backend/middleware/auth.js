const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); 
const Doctor = require('../models/doctor.model');
const Admin = require('../models/admin.model');



//Auth middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);// decode token using jwt secret

        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        
        let user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            user = await Doctor.findById(decoded.userId).select('-password');
        }
        if (!user) {
            user = await Admin.findById(decoded.userId).select('-password');
        }

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
        
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
};

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '5d' });
};

module.exports = { auth, generateToken };
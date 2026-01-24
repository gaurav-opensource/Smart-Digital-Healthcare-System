const mongoose = require('mongoose');


//  User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  healthMetrics: {
    bloodPressure: String,
    sugarLevel: String,
    weight: Number,
  },
  paymentHistory: [{
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    amount: Number,
    method: String,
    paymentStatus: String,
    date: { type: Date, default: Date.now }
  }],
  role: {
    type: String,
    enum: ['user', 'doctor', 'admin'],
    default: 'user',
    required: true,
  },
  phoneNumber: {
    type: String,
    match: /^\+?[1-9]\d{9,14}$/,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
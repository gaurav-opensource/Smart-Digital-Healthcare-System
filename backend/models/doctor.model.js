const mongoose = require('mongoose');


// Doctor Schema
const doctorSchema = new mongoose.Schema({
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
  role: {
    type: String,
    enum: ['doctor'],
    default: 'doctor',
    required: true,
  },
  profilePhoto: {
    type: String, 
  },
  licenseNumber: {
    type: String,
    required:true,
  },
  phoneNumber: {
    type: String,
    match: /^\+?[1-9]\d{9,14}$/,
    required:true,
  },
  
  fees: {
    type: Number,
    min: 1,
    required:true,
  },
  specialization: {
    type: String,
    enum: [
  "Cardiology",
  "General Physician",
  "Orthopedics",
  "Pediatrics",
  "Neurology",
  "Dermatology",
  "Other",
  "Gynecology",
  "Psychiatry",
  "Radiology",
  "Oncology",
  "Nephrology",
  "Urology",
  "Endocrinology",
  "Gastroenterology",
  "Pulmonology",
  "Hematology",
  "Rheumatology",
  "Ophthalmology",
  "ENT (Ear, Nose, Throat)",
  "Dentistry",
  "Anesthesiology",
  "Pathology",
  "Infectious Diseases",
  "Plastic Surgery",
  "Sports Medicine",
  "Emergency Medicine",
  "Geriatrics",
  "Allergy & Immunology",
  "Occupational Medicine"
]
,
    required: true,
  },
  certification: {
    type: String, 
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  availability: [{
    date: Date,
    startTime: String,
    endTime: String,
  }],
  about: { type: String, default: "" },
  experience: { type: String, default: "" },
  achievements: { type: String, default: "" },
  other: { type: String, default: "" },
  savedCardToken: String,

  receivedPayments: [{
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    amount: Number,
    method: String,
    paymentStatus: String,
    date: { type: Date, default: Date.now }
  }],
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
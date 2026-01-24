const mongoose = require('mongoose');


// Appointment Schema,
const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
      unique: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    prescription: {
      type: String,
      default: '',
    },
    testReports: {
      type: String,
      default: '',
    },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    status: {
      type: String,
      enum: [
        'pending',               // booked, not started yet
        'vidoes-call',           // during video call
        'awaiting_prescription', // after call, waiting for prescription
        'completed',             // prescription uploaded
        'cancelled'              // cancelled
      ],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);

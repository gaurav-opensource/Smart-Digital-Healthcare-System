const mongoose = require('mongoose');


// Payment Schema
const paymentSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", required: true 
    },
    doctorId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Doctor", required: true 
    },
    amount: { 
      type: Number, 
      required: true 
    },
    currency: { 
      type: String, 
      default: "USD" 
    },
    paymentStatus: { 
      type: String, 
      default: "Pending" 
    },
    orderId: { 
      type: String 
    },
    captureId: { 
      type: String 
    },
    description: { 
      type: String 
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;

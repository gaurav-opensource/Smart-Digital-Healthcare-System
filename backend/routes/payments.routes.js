const express = require("express");
const { auth } = require("../middleware/auth");
const {
  createOrder,
  captureOrder,
  getPayments,
} = require("../controllers/payment.controller");

const router = express.Router();

// Create PayPal Order
router.post("/create-order", auth, createOrder);

// Capture PayPal Payment
router.post("/capture-order/:orderId", auth, captureOrder);

// Get all payments for a user or doctor
router.get("/payments/:id", auth, getPayments);

module.exports = router;

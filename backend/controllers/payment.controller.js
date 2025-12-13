const axios = require("axios");
const Payment = require("../models/payment.model");

// Generate PayPal Token
async function generateAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
  ).toString("base64");

  const response = await axios.post(
    `${process.env.PAYPAL_API}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
}

// Create PayPal Order
exports.createOrder = async (req, res) => {
  try {
    const { amount, description, userId, doctorId } = req.body;

    const accessToken = await generateAccessToken();

    const order = await axios.post(
      `${process.env.PAYPAL_API}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: { currency_code: "USD", value: amount },
            description,
          },
        ],
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // Save pending payment
    await Payment.create({
      userId,
      doctorId,
      amount,
      description,
      orderId: order.data.id,
      paymentStatus: "Pending",
    });

    res.json(order.data);
  } catch (err) {
    console.error("Create Order Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to create PayPal order" });
  }
};

// Capture PayPal Order
exports.captureOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const accessToken = await generateAccessToken();

    const response = await axios.post(
      `${process.env.PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const captureId =
      response.data.purchase_units[0].payments.captures[0].id;

    const updatedPayment = await Payment.findOneAndUpdate(
      { orderId },
      { paymentStatus: "Completed", captureId },
      { new: true }
    );

    res.json({ success: true, payment: updatedPayment });
  } catch (err) {
    console.error("Capture Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to capture PayPal order" });
  }
};

// Get payments for a user or doctor
exports.getPayments = async (req, res) => {
  try {
    const { id } = req.params;

    const payments = await Payment.find({
      $or: [{ userId: id }, { doctorId: id }],
    }).sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    console.error("Fetch Payments Error:", err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};
